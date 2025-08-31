package com.endesha360.student_management_service.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "student_progress")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentProgress {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "student_id", nullable = false)
    private Long studentId;

    @Column(name = "course_id", nullable = false)
    private Long courseId;

    @Column(name = "module_name")
    private String moduleName;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private Status status = Status.in_progress;

    @Column(name = "score")
    private Double score;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public enum Status {
        not_started, in_progress, completed, failed
    }
}
