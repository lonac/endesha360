package com.endesha360.UserManagementService.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "activities")
public class Activity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "activity_type", nullable = false)
    private String activityType;
    
    @Column(name = "description", nullable = false)
    private String description;
    
    @Column(name = "tenant_code", nullable = false)
    private String tenantCode;
    
    @Column(name = "user_id")
    private String userId;
    
    @Column(name = "metadata", columnDefinition = "TEXT")
    private String metadata; // JSON string for additional data
    
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
    
    // Constructors
    public Activity() {}
    
    public Activity(String activityType, String description, String tenantCode, String userId) {
        this.activityType = activityType;
        this.description = description;
        this.tenantCode = tenantCode;
        this.userId = userId;
        this.createdAt = LocalDateTime.now();
    }
    
    public Activity(String activityType, String description, String tenantCode, String userId, String metadata) {
        this.activityType = activityType;
        this.description = description;
        this.tenantCode = tenantCode;
        this.userId = userId;
        this.metadata = metadata;
        this.createdAt = LocalDateTime.now();
    }
    
    // Getters and setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getActivityType() {
        return activityType;
    }
    
    public void setActivityType(String activityType) {
        this.activityType = activityType;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public String getTenantCode() {
        return tenantCode;
    }
    
    public void setTenantCode(String tenantCode) {
        this.tenantCode = tenantCode;
    }
    
    public String getUserId() {
        return userId;
    }
    
    public void setUserId(String userId) {
        this.userId = userId;
    }
    
    public String getMetadata() {
        return metadata;
    }
    
    public void setMetadata(String metadata) {
        this.metadata = metadata;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
