package com.endesha360.student_management_service.service;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import com.endesha360.student_management_service.security.StudentAccess;
import com.endesha360.student_management_service.client.TestServiceClient;
import com.endesha360.student_management_service.dto.ExamResultUpdateRequest;
import com.endesha360.student_management_service.dto.StudentProgressWithResultsDto;
import com.endesha360.student_management_service.entity.StudentProgress;
import com.endesha360.student_management_service.repository.StudentProgressRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class StudentProgressService {
    @Autowired
    private StudentProgressRepository progressRepository;

    @Autowired
    private TestServiceClient testServiceClient;

    @Autowired
    private StudentAccess access;

    public StudentProgress saveProgress(StudentProgress progress) {
        access.teacher();
        access.requireStudent(progress.getStudentId());
        if (progress.getId() != null) {
            StudentProgress existing = progressRepository.findById(progress.getId())
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.NOT_FOUND));
            access.requireStudent(existing.getStudentId());
            if (!java.util.Objects.equals(existing.getStudentId(), progress.getStudentId()))
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST, "Student identity cannot be changed");
        }
        return progressRepository.save(progress);
    }

    public List<StudentProgress> getProgressByStudentId(Long studentId) {
        access.requireStudent(studentId);
        return progressRepository.findByStudentId(studentId);
    }

    public List<StudentProgress> getProgressByCourseId(Long courseId) {
        return progressRepository.findVisibleByCourse(courseId, access.principal().tenantCode(),
                access.readerUserId(), access.readerInstructorId());
    }

    public Optional<StudentProgress> getProgressById(Long id) {
        access.principal();
        return progressRepository.findById(id).map(record -> {
            access.requireStudent(record.getStudentId());
            return record;
        });
    }

    public void deleteProgress(Long id) {
        access.owner();
        getProgressById(id).ifPresent(progressRepository::delete);
    }

    public void updateProgressAfterExam(ExamResultUpdateRequest request) {
        access.teacher();
        access.requireStudent(request.getStudentId());
        // Find existing progress record or create new one
        List<StudentProgress> existingProgress = progressRepository.findByStudentId(request.getStudentId());

        StudentProgress progress = existingProgress.stream()
                .filter(p -> request.getCourseId() != null && request.getCourseId().equals(p.getCourseId())
                           && request.getModuleName() != null && request.getModuleName().equals(p.getModuleName()))
                .findFirst()
                .orElse(StudentProgress.builder()
                        .studentId(request.getStudentId())
                        .courseId(request.getCourseId() != null ? request.getCourseId() : 1L) // Default course
                        .moduleName(request.getModuleName() != null ? request.getModuleName() : "Exam")
                        .status(StudentProgress.Status.in_progress)
                        .build());

        // Update progress with exam results
        progress.setScore(request.getScore());
        progress.setUpdatedAt(LocalDateTime.now());

        if (request.getPassed() != null && request.getPassed()) {
            progress.setStatus(StudentProgress.Status.completed);
        } else if (request.getPassed() != null && !request.getPassed()) {
            progress.setStatus(StudentProgress.Status.failed);
        }

        progressRepository.save(progress);
    }

    @Autowired
    private com.endesha360.student_management_service.repository.StudentRepository studentRepository;

    public List<StudentProgressWithResultsDto> getMyComprehensiveProgress() {
        var principal = access.principal();
        return studentRepository.findByUserIdAndTenantCode(principal.userId(), principal.tenantCode())
                .map(student -> getComprehensiveProgress(student.getId())).orElseGet(List::of);
    }

    public List<StudentProgressWithResultsDto> getComprehensiveProgress(Long studentId) {
        var student = access.requireStudent(studentId);
        List<StudentProgress> progressList = progressRepository.findByStudentId(studentId);

        // Get test results from test service
        List<TestServiceClient.TestResultDto> testResults = getTestResults(student.getUserId());

        return progressList.stream()
                .map(progress -> {
                    // Filter test results relevant to this progress module
                    List<StudentProgressWithResultsDto.TestResultSummaryDto> relevantResults = testResults.stream()
                            .map(result -> StudentProgressWithResultsDto.TestResultSummaryDto.builder()
                                    .attemptId(result.attemptId)
                                    .startedAt(result.startedAt)
                                    .score(result.score)
                                    .totalQuestions(result.totalQuestions)
                                    .percentage(result.percentage)
                                    .status(result.status)
                                    .build())
                            .collect(Collectors.toList());

                    return StudentProgressWithResultsDto.builder()
                            .id(progress.getId())
                            .studentId(progress.getStudentId())
                            .courseId(progress.getCourseId())
                            .moduleName(progress.getModuleName())
                            .status(progress.getStatus().name())
                            .score(progress.getScore())
                            .updatedAt(progress.getUpdatedAt())
                            .testResults(relevantResults)
                            .build();
                })
                .collect(Collectors.toList());
    }

    private List<TestServiceClient.TestResultDto> getTestResults(Long studentId) {
        try {
            return testServiceClient.getStudentTestResults(studentId);
        } catch (Exception e) {
            // Handle service unavailable gracefully
            return List.of();
        }
    }
}
