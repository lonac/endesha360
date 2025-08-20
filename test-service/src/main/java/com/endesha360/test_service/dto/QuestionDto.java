package com.endesha360.test_service.dto;

import lombok.Data;

@Data
public class QuestionDto {
    private Long id;
    private String questionText;
    private String correctAnswer;
}
