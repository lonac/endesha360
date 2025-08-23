package com.endesha360.test_service.dto;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data @Builder
public class TestQuestionDto {
    private Integer index;
    private Long questionId;
    private String questionText;
    private String imageUrl;
    private List<String> options; // shuffled
    private Boolean flagged;
}

