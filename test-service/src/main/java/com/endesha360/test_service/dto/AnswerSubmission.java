package com.endesha360.test_service.dto;

import lombok.Data;

@Data
public class AnswerSubmission {
    private Long questionId;
    private String studentAnswer;
}
