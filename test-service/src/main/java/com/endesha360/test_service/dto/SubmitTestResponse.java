package com.endesha360.test_service.dto;

import lombok.Builder;
import lombok.Data;

@Data @Builder
public class SubmitTestResponse {
    private String attemptId;
    private Integer score;
    private Integer totalQuestions;
    private Double percentage;
    private String status; // SUBMITTED or EXPIRED
}
