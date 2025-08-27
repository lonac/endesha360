//(for test-service - INCLUDES answer)
package com.endesha360.questions_service.dto;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class InternalQuestionDto {
    private Long id;
    private Long categoryId;
    private String categoryName;
    private String questionText;
    private String imageUrl;
    private List<String> options;
    private String correctAnswer;
    private Long levelId;
    private String levelName;
}
