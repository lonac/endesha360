package com.endesha360.SchoolManagementService.dto;

import java.time.LocalDateTime;

public class SchoolRegistrationResponse {
    
    private Long id;
    private String name;
    private String registrationNumber;
    private String email;
    private String phone;
    private String address;
    private String city;
    private String region;
    private String tenantCode;
    private Boolean isActive;
    private Boolean isApproved;
    private LocalDateTime createdAt;
    private String message;
    
    // Constructors
    public SchoolRegistrationResponse() {}
    
    public SchoolRegistrationResponse(Long id, String name, String tenantCode, 
                                    Boolean isApproved, String message) {
        this.id = id;
        this.name = name;
        this.tenantCode = tenantCode;
        this.isApproved = isApproved;
        this.message = message;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public String getRegistrationNumber() {
        return registrationNumber;
    }
    
    public void setRegistrationNumber(String registrationNumber) {
        this.registrationNumber = registrationNumber;
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public String getPhone() {
        return phone;
    }
    
    public void setPhone(String phone) {
        this.phone = phone;
    }
    
    public String getAddress() {
        return address;
    }
    
    public void setAddress(String address) {
        this.address = address;
    }
    
    public String getCity() {
        return city;
    }
    
    public void setCity(String city) {
        this.city = city;
    }
    
    public String getRegion() {
        return region;
    }
    
    public void setRegion(String region) {
        this.region = region;
    }
    
    public String getTenantCode() {
        return tenantCode;
    }
    
    public void setTenantCode(String tenantCode) {
        this.tenantCode = tenantCode;
    }
    
    public Boolean getIsActive() {
        return isActive;
    }
    
    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }
    
    public Boolean getIsApproved() {
        return isApproved;
    }
    
    public void setIsApproved(Boolean isApproved) {
        this.isApproved = isApproved;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public String getMessage() {
        return message;
    }
    
    public void setMessage(String message) {
        this.message = message;
    }
    
    @Override
    public String toString() {
        return "SchoolRegistrationResponse{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", tenantCode='" + tenantCode + '\'' +
                ", isApproved=" + isApproved +
                ", message='" + message + '\'' +
                '}';
    }
}
