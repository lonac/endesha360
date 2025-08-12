package com.endesha360.StudentManagementService.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "student_progress")
public class StudentProgress {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;
    
    @Column(name = "course_id", nullable = false)
    private Long courseId; // Reference to Course Management Service
    
    @Column(name = "module_name", nullable = false)
    private String moduleName;
    
    @Column(name = "completion_percentage")
    private Double completionPercentage = 0.0;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private ProgressStatus status = ProgressStatus.IN_PROGRESS;
    
    @Column(name = "hours_completed")
    private Integer hoursCompleted = 0;
    
    @Column(name = "total_hours_required")
    private Integer totalHoursRequired;
    
    @Column(name = "instructor_id")
    private Long instructorId;
    
    @Column(name = "notes", length = 1000)
    private String notes;
    
    @Column(name = "last_session_date")
    private LocalDateTime lastSessionDate;
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @CreationTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // Constructors, getters, and setters
    public StudentProgress() {}
    
    public StudentProgress(Student student, Long courseId, String moduleName) {
        this.student = student;
        this.courseId = courseId;
        this.moduleName = moduleName;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Student getStudent() { return student; }
    public void setStudent(Student student) { this.student = student; }
    
    public Long getCourseId() { return courseId; }
    public void setCourseId(Long courseId) { this.courseId = courseId; }
    
    public String getModuleName() { return moduleName; }
    public void setModuleName(String moduleName) { this.moduleName = moduleName; }
    
    public Double getCompletionPercentage() { return completionPercentage; }
    public void setCompletionPercentage(Double completionPercentage) { this.completionPercentage = completionPercentage; }
    
    public ProgressStatus getStatus() { return status; }
    public void setStatus(ProgressStatus status) { this.status = status; }
    
    public Integer getHoursCompleted() { return hoursCompleted; }
    public void setHoursCompleted(Integer hoursCompleted) { this.hoursCompleted = hoursCompleted; }
    
    public Integer getTotalHoursRequired() { return totalHoursRequired; }
    public void setTotalHoursRequired(Integer totalHoursRequired) { this.totalHoursRequired = totalHoursRequired; }
    
    public Long getInstructorId() { return instructorId; }
    public void setInstructorId(Long instructorId) { this.instructorId = instructorId; }
    
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    
    public LocalDateTime getLastSessionDate() { return lastSessionDate; }
    public void setLastSessionDate(LocalDateTime lastSessionDate) { this.lastSessionDate = lastSessionDate; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}

enum ProgressStatus {
    NOT_STARTED, IN_PROGRESS, COMPLETED, PAUSED, FAILED
}