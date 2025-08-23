package com.endesha360.questions_service.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Entity @Table(name="questions")
@Data @NoArgsConstructor
public class Question {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne @JoinColumn(name = "category_id", nullable = false)
    private QuestionCategory questionCategory;

    @NotBlank
    @Column(columnDefinition = "text")
    private String questionText;

    // Optional image (traffic sign, diagram, etc.)
    private String imageUrl;

    @ElementCollection
    @CollectionTable(name = "question_options", joinColumns = @JoinColumn(name = "question_id"))
    @Column(name = "option_text", nullable = false)
    private List<String> options;

    @NotBlank
    private String correctAnswer;
}
