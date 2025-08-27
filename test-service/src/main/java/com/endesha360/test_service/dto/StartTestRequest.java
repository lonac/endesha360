package com.endesha360.test_service.dto;

import lombok.Data;

@Data
public class StartTestRequest {
    private Long studentId;
    private Integer count;             // e.g., 40
    private Integer durationSeconds;   // e.g., 2400 (40 min)
    private Long categoryId;           // optional
    private Long levelId;              // optional
}

