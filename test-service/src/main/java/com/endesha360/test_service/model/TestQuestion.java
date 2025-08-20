package com.endesha360.test_service.model;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TestQuestion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long questionId;
    private String questionText;
    private String correctAnswer;
    private String studentAnswer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mock_test_id")
    private Test mockTest;
}
