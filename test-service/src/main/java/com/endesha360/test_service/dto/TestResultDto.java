package com.endesha360.test_service.dto;

import lombok.Builder;
import lombok.Data;

import java.time.Instant;

@Data @Builder
public class TestResultDto {
    private String attemptId;
    private Long studentId;
    private Instant startedAt;
    private Instant endsAt;
    private Integer durationSeconds;
    private Integer totalQuestions;
    private Integer score;
    private Double percentage;
    private String status;
    private Integer tabSwitches;
    private Integer focusLosses;
    private Integer fullscreenExits;
}
