package com.endesha360.questions_service.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "question_levels")
@Data
@NoArgsConstructor
public class QuestionLevel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;  // "Simple", "Medium", "Hard"
}
