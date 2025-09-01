package com.endesha360.student_management_service.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data @Builder
public class StudentProgressWithResultsDto {
    private Long id;
    private Long studentId;
    private Long courseId;
    private String moduleName;
    private String status;
    private Double score;
    private LocalDateTime updatedAt;
    private List<TestResultSummaryDto> testResults;

    @Data @Builder
    public static class TestResultSummaryDto {
        private String attemptId;
        private String startedAt;
        private Integer score;
        private Integer totalQuestions;
        private Double percentage;
        private String status;
    }
}
