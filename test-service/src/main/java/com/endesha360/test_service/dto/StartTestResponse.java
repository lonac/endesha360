package com.endesha360.test_service.dto;

import lombok.Builder;
import lombok.Data;

import java.time.Instant;
import java.util.List;

@Data @Builder
public class StartTestResponse {
    private String attemptId;
    private Instant startedAt;
    private Instant endsAt;
    private Integer durationSeconds;
    private List<TestQuestionDto> questions; // full exam view
}

