package com.endesha360.test_service.dto;

import lombok.Data;

import java.util.List;

@Data
public class SubmitTestRequest {
    private List<AnswerDto> answers;           // [{questionId, selectedOption}]
    private List<Long> flaggedQuestionIds;     // optional
}


