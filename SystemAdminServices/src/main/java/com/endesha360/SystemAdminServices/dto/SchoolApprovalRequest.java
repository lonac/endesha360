package com.endesha360.SystemAdminServices.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class SchoolApprovalRequest {
    
    @NotNull(message = "School ID is required")
    private Long schoolId;
    
    @NotBlank(message = "Action is required")
    private String action; // "APPROVE" or "REJECT"
    
    private String comments;
    
    // Constructors
    public SchoolApprovalRequest() {}
    
    public SchoolApprovalRequest(Long schoolId, String action, String comments) {
        this.schoolId = schoolId;
        this.action = action;
        this.comments = comments;
    }
    
    // Getters and Setters
    public Long getSchoolId() {
        return schoolId;
    }
    
    public void setSchoolId(Long schoolId) {
        this.schoolId = schoolId;
    }
    
    public String getAction() {
        return action;
    }
    
    public void setAction(String action) {
        this.action = action;
    }
    
    public String getComments() {
        return comments;
    }
    
    public void setComments(String comments) {
        this.comments = comments;
    }
}
