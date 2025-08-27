// QuestionCreateRequest.java
package com.endesha360.questions_service.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import java.util.List;

@Data
public class QuestionCreateRequest {
    @NotNull
    private Long categoryId;

    @NotNull
    private Long levelId;

    @NotBlank
    private String questionText;

    // optional imageUrl when using direct URL approach
    private String imageUrl;

    @Size(min = 2, message = "At least 2 options are required")
    private List<@NotBlank String> options;

    @NotBlank
    private String correctAnswer; // must be one of options
}
