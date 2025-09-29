package com.endesha360.UserManagementService.dto.response;

import java.time.LocalDateTime;

public class ActivityResponse {
    
    private Long id;
    private String activityType;
    private String description;
    private String userId;
    private String metadata;
    private LocalDateTime createdAt;
    private String icon; // Frontend icon name
    
    // Constructors
    public ActivityResponse() {}
    
    public ActivityResponse(Long id, String activityType, String description, String userId, 
                           String metadata, LocalDateTime createdAt) {
        this.id = id;
        this.activityType = activityType;
        this.description = description;
        this.userId = userId;
        this.metadata = metadata;
        this.createdAt = createdAt;
        this.icon = getIconForActivityType(activityType);
    }
    
    // Helper method to get icon based on activity type
    private String getIconForActivityType(String activityType) {
        switch (activityType) {
            case "STUDENT_REGISTRATION":
                return "UserPlus";
            case "INSTRUCTOR_REGISTRATION":
                return "UserCheck";
            case "STUDENT_ACTIVITY":
                return "BookOpen";
            case "INSTRUCTOR_ACTIVITY":
                return "Users";
            case "SCHOOL_UPDATE":
                return "Edit";
            case "SCHOOL_APPROVED":
                return "CheckCircle";
            case "SCHOOL_REJECTED":
                return "XCircle";
            case "SYSTEM":
                return "Shield";
            default:
                return "Activity";
        }
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
        this.icon = getIconForActivityType(activityType);
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
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
    
    public String getIcon() {
        return icon;
    }
    
    public void setIcon(String icon) {
        this.icon = icon;
    }
}
