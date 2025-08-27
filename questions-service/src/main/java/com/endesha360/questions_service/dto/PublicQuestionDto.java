//(for frontend - NO answers)
package com.endesha360.questions_service.dto;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class PublicQuestionDto {
    private Long id;
    private Long categoryId;
    private String categoryName;
    private String questionText;
    private String imageUrl;
    private List<String> options; // shuffled on test-service side
    private Long levelId;
    private String levelName;
}
