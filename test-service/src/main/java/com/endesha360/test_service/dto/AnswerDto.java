package com.endesha360.test_service.dto;

import lombok.Data;

@Data
public class AnswerDto {
    private Long questionId;
    private String selectedOption;
}
