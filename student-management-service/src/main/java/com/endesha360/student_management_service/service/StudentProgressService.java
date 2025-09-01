package com.endesha360.student_management_service.service;

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

    public StudentProgress saveProgress(StudentProgress progress) {
        return progressRepository.save(progress);
    }

    public List<StudentProgress> getProgressByStudentId(Long studentId) {
        return progressRepository.findByStudentId(studentId);
    }

    public List<StudentProgress> getProgressByCourseId(Long courseId) {
        return progressRepository.findByCourseId(courseId);
    }

    public Optional<StudentProgress> getProgressById(Long id) {
        return progressRepository.findById(id);
    }

    public void deleteProgress(Long id) {
        progressRepository.deleteById(id);
    }

    public void updateProgressAfterExam(ExamResultUpdateRequest request) {
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

    public List<StudentProgressWithResultsDto> getComprehensiveProgress(Long studentId) {
        List<StudentProgress> progressList = progressRepository.findByStudentId(studentId);
        
        // Get test results from test service
        List<TestServiceClient.TestResultDto> testResults = getTestResults(studentId);

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
