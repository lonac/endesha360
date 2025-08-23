package com.endesha360.test_service.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity @Data @NoArgsConstructor @AllArgsConstructor @Builder
public class AttemptQuestion {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // For audit/reference
    private Long questionId;

    @Column(columnDefinition = "text")
    private String questionText;

    private String imageUrl;

    // Shuffled options (as delivered to frontend)
    @ElementCollection
    @CollectionTable(name = "attempt_question_options", joinColumns = @JoinColumn(name = "attempt_question_id"))
    @Column(name = "option_text", nullable = false)
    private List<String> optionOrder;

    // Server-only answer (NEVER returned to client)
    private String correctAnswer;

    // Student’s selection
    private String selectedOption;

    // Review flag
    private Boolean flagged;

    private Integer indexInExam;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "attempt_id")
    private TestAttempt attempt;
}

