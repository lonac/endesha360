package com.endesha360.SystemAdminServices.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "school_approval_actions")
public class SchoolApprovalAction {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "school_id", nullable = false)
    private Long schoolId;
    
    @Column(name = "school_name", nullable = false)
    private String schoolName;
    
    @Column(name = "school_owner_id", nullable = false)
    private Long schoolOwnerId;
    
    @Column(name = "admin_id", nullable = false)
    private Long adminId;
    
    @Column(name = "admin_username", nullable = false)
    private String adminUsername;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ActionType actionType;
    
    @Column(name = "comments", columnDefinition = "TEXT")
    private String comments;
    
    @Column(name = "action_timestamp", nullable = false)
    private LocalDateTime actionTimestamp;
    
    @Column(name = "school_data", columnDefinition = "TEXT")
    private String schoolData; // JSON representation of school details at time of action
    
    @PrePersist
    protected void onCreate() {
        actionTimestamp = LocalDateTime.now();
    }
    
    // Constructors
    public SchoolApprovalAction() {}
    
    public SchoolApprovalAction(Long schoolId, String schoolName, Long schoolOwnerId, 
                              Long adminId, String adminUsername, ActionType actionType) {
        this.schoolId = schoolId;
        this.schoolName = schoolName;
        this.schoolOwnerId = schoolOwnerId;
        this.adminId = adminId;
        this.adminUsername = adminUsername;
        this.actionType = actionType;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public Long getSchoolId() {
        return schoolId;
    }
    
    public void setSchoolId(Long schoolId) {
        this.schoolId = schoolId;
    }
    
    public String getSchoolName() {
        return schoolName;
    }
    
    public void setSchoolName(String schoolName) {
        this.schoolName = schoolName;
    }
    
    public Long getSchoolOwnerId() {
        return schoolOwnerId;
    }
    
    public void setSchoolOwnerId(Long schoolOwnerId) {
        this.schoolOwnerId = schoolOwnerId;
    }
    
    public Long getAdminId() {
        return adminId;
    }
    
    public void setAdminId(Long adminId) {
        this.adminId = adminId;
    }
    
    public String getAdminUsername() {
        return adminUsername;
    }
    
    public void setAdminUsername(String adminUsername) {
        this.adminUsername = adminUsername;
    }
    
    public ActionType getActionType() {
        return actionType;
    }
    
    public void setActionType(ActionType actionType) {
        this.actionType = actionType;
    }
    
    public String getComments() {
        return comments;
    }
    
    public void setComments(String comments) {
        this.comments = comments;
    }
    
    public LocalDateTime getActionTimestamp() {
        return actionTimestamp;
    }
    
    public void setActionTimestamp(LocalDateTime actionTimestamp) {
        this.actionTimestamp = actionTimestamp;
    }
    
    public String getSchoolData() {
        return schoolData;
    }
    
    public void setSchoolData(String schoolData) {
        this.schoolData = schoolData;
    }
    
    public enum ActionType {
        APPROVED,
        REJECTED,
        SUSPENDED,
        REACTIVATED,
        PENDING_REVIEW
    }
}
