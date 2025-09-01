package com.endesha360.test_service.service;

import com.endesha360.test_service.client.StudentProgressClient;
import com.endesha360.test_service.client.ExamResultUpdateRequest;

import com.endesha360.test_service.client.QuestionClient;
import com.endesha360.test_service.dto.*;
import com.endesha360.test_service.model.AttemptQuestion;
import com.endesha360.test_service.model.TestAttempt;
import com.endesha360.test_service.repository.AttemptQuestionRepository;
import com.endesha360.test_service.repository.TestAttemptRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class TestService {

    @Autowired private TestAttemptRepository attemptRepo;
    @Autowired private AttemptQuestionRepository aqRepo;
    @Autowired private QuestionClient questionClient;
    @Autowired private StudentProgressClient studentProgressClient;



    @Transactional
    public StartTestResponse startExam(StartTestRequest req, String ip, String ua) {
        // One-time access: only one active attempt per student
        attemptRepo.findFirstByStudentIdAndStatusIn(
                req.getStudentId(), List.of(TestAttempt.Status.CREATED, TestAttempt.Status.ACTIVE)
        ).ifPresent(a -> { throw new RuntimeException("Active attempt exists for this student"); });


        // Pull pool from question-service (INCLUDES answers; frontend never sees them)
        List<QuestionClient.QuestionInternalDto> pool =
                questionClient.getPool(req.getCategoryId(), req.getLevelId(), 500);
        if (pool.isEmpty()) throw new RuntimeException("Question pool is empty");

        // Randomize and pick requested count
        Collections.shuffle(pool);
        List<QuestionClient.QuestionInternalDto> picked =
                pool.stream().limit(req.getCount()).toList();

        // Build attempt
        Instant now = Instant.now();
        TestAttempt attempt = TestAttempt.builder()
                .studentId(req.getStudentId())
                .startedAt(now)
                .durationSeconds(req.getDurationSeconds())
                .endsAt(now.plusSeconds(req.getDurationSeconds()))
                .totalQuestions(picked.size())
                .status(TestAttempt.Status.ACTIVE)
                .ipAddress(ip)
                .userAgent(ua)
                .tabSwitches(0)
                .focusLosses(0)
                .fullscreenExits(0)
                .build();

        // Copy + shuffle options per question
        List<AttemptQuestion> snapshots = new ArrayList<>();
        int idx = 0;
        for (QuestionClient.QuestionInternalDto q : picked) {
            List<String> options = new ArrayList<>(q.getOptions());
            Collections.shuffle(options);
            snapshots.add(AttemptQuestion.builder()
                    .attempt(attempt)
                    .questionId(q.getId())
                    .questionText(q.getQuestionText())
                    .imageUrl(q.getImageUrl())
                    .optionOrder(options)
                    .correctAnswer(q.getCorrectAnswer()) // server-side only
                    .flagged(false)
                    .indexInExam(idx++)
                    .build());
        }
        attempt.setQuestions(snapshots);

        attempt = attemptRepo.save(attempt);

        // Build safe response (no answers)
        List<TestQuestionDto> qdto = attempt.getQuestions().stream()
                .sorted(Comparator.comparing(AttemptQuestion::getIndexInExam))
                .map(aq -> TestQuestionDto.builder()
                        .index(aq.getIndexInExam())
                        .questionId(aq.getQuestionId())
                        .questionText(aq.getQuestionText())
                        .imageUrl(aq.getImageUrl())
                        .options(aq.getOptionOrder())
                        .flagged(aq.getFlagged())
                        .build())
                .toList();

        return StartTestResponse.builder()
                .attemptId(attempt.getId())
                .startedAt(attempt.getStartedAt())
                .endsAt(attempt.getEndsAt())
                .durationSeconds(attempt.getDurationSeconds())
                .questions(qdto)
                .build();
    }

    @Transactional
    public SubmitTestResponse submit(String attemptId, SubmitTestRequest req, String ip) {
        TestAttempt a = attemptRepo.findById(attemptId)
                .orElseThrow(() -> new RuntimeException("Attempt not found"));

        // Soft IP/UA pin check → bump counters if mismatch
        if (a.getIpAddress() != null && !a.getIpAddress().equals(ip)) {
            a.setTabSwitches(a.getTabSwitches() + 1);
        }

        // If time passed → mark EXPIRED
        Instant now = Instant.now();
        if (now.isAfter(a.getEndsAt())) {
            a.setStatus(TestAttempt.Status.EXPIRED);
        }

        Map<Long, String> answers = req.getAnswers() == null ? Map.of() :
                req.getAnswers().stream().collect(Collectors.toMap(
                        AnswerDto::getQuestionId, AnswerDto::getSelectedOption, (x, y) -> y
                ));

        int score = 0;
        for (AttemptQuestion aq : a.getQuestions()) {
            String sel = answers.get(aq.getQuestionId());
            aq.setSelectedOption(sel);
            if (sel != null && sel.equals(aq.getCorrectAnswer())) score++;
            if (req.getFlaggedQuestionIds() != null &&
                    req.getFlaggedQuestionIds().contains(aq.getQuestionId())) {
                aq.setFlagged(true);
            }
        }

        a.setScore(score);
        if (a.getStatus() != TestAttempt.Status.EXPIRED) {
            a.setStatus(TestAttempt.Status.SUBMITTED);
        }
        attemptRepo.save(a);

                // Call Student Management Service to update progress
                try {
                        ExamResultUpdateRequest updateReq = new ExamResultUpdateRequest();
                        updateReq.studentId = a.getStudentId();
                        // You may need to fetch courseId/moduleName from context or question metadata
                        updateReq.courseId = null; // Set appropriately
                        updateReq.moduleName = "Exam"; // Or set dynamically
                        updateReq.score = (double) a.getScore();
                        updateReq.passed = a.getScore() != null && a.getScore() >= (a.getTotalQuestions() * 0.7); // Example: 70% pass
                        updateReq.notes = "Exam completed";
                        studentProgressClient.updateProgressAfterExam(updateReq);
                } catch (Exception ex) {
                        // Log error but do not fail submission
                        System.err.println("Failed to update student progress: " + ex.getMessage());
                }

        return SubmitTestResponse.builder()
                .attemptId(a.getId())
                .score(a.getScore())
                .totalQuestions(a.getTotalQuestions())
                .percentage(a.getTotalQuestions() == 0 ? 0d : (a.getScore() * 100.0 / a.getTotalQuestions()))
                .status(a.getStatus().name())
                .build();
    }

    @Transactional
    public void recordEvent(String attemptId, String type) {
        TestAttempt a = attemptRepo.findById(attemptId)
                .orElseThrow(() -> new RuntimeException("Attempt not found"));
        switch (type) {
            case "TAB_SWITCH" -> a.setTabSwitches(a.getTabSwitches() + 1);
            case "FOCUS_LOSS" -> a.setFocusLosses(a.getFocusLosses() + 1);
            case "FULLSCREEN_EXIT" -> a.setFullscreenExits(a.getFullscreenExits() + 1);
            default -> {}
        }
        attemptRepo.save(a);
    }

        // Auto-sweeper: finalize expired attempts (unanswered = wrong)
    @Scheduled(fixedDelay = 60_000)
    @Transactional
    public void sweepExpired() {
        List<TestAttempt> expired = attemptRepo.findAll().stream()
                .filter(a -> a.getStatus() == TestAttempt.Status.ACTIVE)
                .filter(a -> Instant.now().isAfter(a.getEndsAt()))
                .toList();

        for (TestAttempt a : expired) {
            // Auto-score unanswered = wrong
            int score = 0;
            for (AttemptQuestion aq : a.getQuestions()) {
                if (aq.getSelectedOption() != null && aq.getSelectedOption().equals(aq.getCorrectAnswer())) {
                    score++;
                }
            }
            a.setScore(score);
            a.setStatus(TestAttempt.Status.EXPIRED);
        }
        attemptRepo.saveAll(expired);
    }

    public List<TestResultDto> getStudentTestResults(Long studentId) {
        List<TestAttempt> attempts = attemptRepo.findByStudentIdAndStatusInOrderByStartedAtDesc(
                studentId, List.of(TestAttempt.Status.SUBMITTED, TestAttempt.Status.EXPIRED)
        );

        return attempts.stream()
                .map(this::convertToTestResultDto)
                .toList();
    }

    public Optional<TestResultDto> getTestResult(String attemptId) {
        return attemptRepo.findById(attemptId)
                .filter(attempt -> attempt.getStatus() == TestAttempt.Status.SUBMITTED || 
                                 attempt.getStatus() == TestAttempt.Status.EXPIRED)
                .map(this::convertToTestResultDto);
    }

    private TestResultDto convertToTestResultDto(TestAttempt attempt) {
        double percentage = attempt.getTotalQuestions() == 0 ? 0.0 : 
                           (attempt.getScore() * 100.0 / attempt.getTotalQuestions());
        
        return TestResultDto.builder()
                .attemptId(attempt.getId())
                .studentId(attempt.getStudentId())
                .startedAt(attempt.getStartedAt())
                .endsAt(attempt.getEndsAt())
                .durationSeconds(attempt.getDurationSeconds())
                .totalQuestions(attempt.getTotalQuestions())
                .score(attempt.getScore())
                .percentage(percentage)
                .status(attempt.getStatus().name())
                .tabSwitches(attempt.getTabSwitches())
                .focusLosses(attempt.getFocusLosses())
                .fullscreenExits(attempt.getFullscreenExits())
                .build();
    }
}
