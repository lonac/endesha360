package com.endesha360.SystemAdminServices.dto;

import com.endesha360.SystemAdminServices.entity.SystemAdmin;
import java.time.LocalDateTime;
import java.util.Set;

public class SystemAdminResponse {
    
    private Long id;
    private String username;
    private String email;
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private SystemAdmin.AdminRole role;
    private SystemAdmin.AdminStatus status;
    private Set<SystemAdmin.Permission> permissions;
    private LocalDateTime createdAt;
    private LocalDateTime lastLogin;
    
    // Constructors
    public SystemAdminResponse() {}
    
    public SystemAdminResponse(SystemAdmin admin) {
        this.id = admin.getId();
        this.username = admin.getUsername();
        this.email = admin.getEmail();
        this.firstName = admin.getFirstName();
        this.lastName = admin.getLastName();
        this.phoneNumber = admin.getPhoneNumber();
        this.role = admin.getRole();
        this.status = admin.getStatus();
        this.permissions = admin.getPermissions();
        this.createdAt = admin.getCreatedAt();
        this.lastLogin = admin.getLastLogin();
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getUsername() {
        return username;
    }
    
    public void setUsername(String username) {
        this.username = username;
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public String getFirstName() {
        return firstName;
    }
    
    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }
    
    public String getLastName() {
        return lastName;
    }
    
    public void setLastName(String lastName) {
        this.lastName = lastName;
    }
    
    public String getPhoneNumber() {
        return phoneNumber;
    }
    
    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }
    
    public SystemAdmin.AdminRole getRole() {
        return role;
    }
    
    public void setRole(SystemAdmin.AdminRole role) {
        this.role = role;
    }
    
    public SystemAdmin.AdminStatus getStatus() {
        return status;
    }
    
    public void setStatus(SystemAdmin.AdminStatus status) {
        this.status = status;
    }
    
    public Set<SystemAdmin.Permission> getPermissions() {
        return permissions;
    }
    
    public void setPermissions(Set<SystemAdmin.Permission> permissions) {
        this.permissions = permissions;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getLastLogin() {
        return lastLogin;
    }
    
    public void setLastLogin(LocalDateTime lastLogin) {
        this.lastLogin = lastLogin;
    }
}
