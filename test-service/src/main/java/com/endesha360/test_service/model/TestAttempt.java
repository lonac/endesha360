package com.endesha360.test_service.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.List;

@Entity @Data @NoArgsConstructor @AllArgsConstructor @Builder
public class TestAttempt {
    @Id @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    private Long studentId;
    private Instant startedAt;
    private Instant endsAt;
    private Integer durationSeconds;
    private Integer totalQuestions;

    private Integer score; // null until submitted/expired
    @Enumerated(EnumType.STRING)
    private Status status; // CREATED, ACTIVE, SUBMITTED, EXPIRED

    // Integrity
    private String ipAddress;
    private String userAgent;
    private Integer tabSwitches;
    private Integer focusLosses;
    private Integer fullscreenExits;

    @OneToMany(mappedBy = "attempt", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private List<AttemptQuestion> questions;

    public enum Status { CREATED, ACTIVE, SUBMITTED, EXPIRED }
}

