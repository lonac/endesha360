package com.endesha360.test_service.service;

import com.endesha360.test_service.dto.AnswerSubmission;
import com.endesha360.test_service.dto.QuestionDto;
import com.endesha360.test_service.dto.TestRequest;
import com.endesha360.test_service.model.Test;
import com.endesha360.test_service.model.TestQuestion;
import com.endesha360.test_service.repository.QuestionClient;
import com.endesha360.test_service.repository.TestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TestService {

    private final TestRepository mockTestRepository;
    private final QuestionClient questionClient;

    @Transactional
    public Test createTest(TestRequest request) {
        List<QuestionDto> questions = questionClient.getRandomQuestions(request.getNumberOfQuestions());

        Test mockTest = Test.builder()
                .studentId(request.getStudentId())
                .totalQuestions(questions.size())
                .score(0)
                .build();

        List<TestQuestion> testQuestions = questions.stream().map(q ->
                TestQuestion.builder()
                        .questionId(q.getId())
                        .questionText(q.getQuestionText())
                        .correctAnswer(q.getCorrectAnswer())
                        .mockTest(mockTest)
                        .build()
        ).collect(Collectors.toList());

        mockTest.setQuestions(testQuestions);
        return mockTestRepository.save(mockTest);
    }

    @Transactional
    public Test submitAnswers(Long testId, List<AnswerSubmission> submissions) {
        Test test = mockTestRepository.findById(testId)
                .orElseThrow(() -> new RuntimeException("Test not found"));

        int score = 0;
        for (TestQuestion tq : test.getQuestions()) {
            submissions.stream()
                    .filter(s -> s.getQuestionId().equals(tq.getQuestionId()))
                    .findFirst()
                    .ifPresent(s -> {
                        tq.setStudentAnswer(s.getStudentAnswer());
                        if (tq.getCorrectAnswer().equalsIgnoreCase(s.getStudentAnswer())) {
                            // Increase score safely
                            synchronized (this) {
                                test.setScore(test.getScore() + 1);
                            }
                        }
                    });
        }

        return mockTestRepository.save(test);
    }

    public List<Test> getTestsByStudent(Long studentId) {
        return mockTestRepository.findByStudentId(studentId);
    }

    public Test getTest(Long testId) {
        return mockTestRepository.findById(testId)
                .orElseThrow(() -> new RuntimeException("Test not found"));
    }
}

