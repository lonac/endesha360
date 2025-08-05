package com.endesha360.UserManagementService.controller;

import com.endesha360.UserManagementService.dto.request.UserRegistrationRequest;
import com.endesha360.UserManagementService.dto.response.UserResponse;
import com.endesha360.UserManagementService.security.TenantContext;
import com.endesha360.UserManagementService.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "User Management", description = "User profile and management endpoints")
public class UserController {
    
    @Autowired
    private UserService userService;
    
    @GetMapping("/profile")
    @Operation(summary = "Get user profile", description = "Get current user's profile")
    public ResponseEntity<UserResponse> getProfile() {
        Long userId = TenantContext.getCurrentUserId();
        String tenantCode = TenantContext.getCurrentTenant();
        
        UserResponse response = userService.getUserById(userId, tenantCode);
        return ResponseEntity.ok(response);
    }
    
    @PutMapping("/profile")
    @Operation(summary = "Update user profile", description = "Update current user's profile")
    public ResponseEntity<UserResponse> updateProfile(@Valid @RequestBody UserRegistrationRequest request) {
        Long userId = TenantContext.getCurrentUserId();
        String tenantCode = TenantContext.getCurrentTenant();
        
        UserResponse response = userService.updateUserProfile(userId, tenantCode, request);
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/change-password")
    @Operation(summary = "Change password", description = "Change current user's password")
    public ResponseEntity<String> changePassword(@RequestBody ChangePasswordRequest request) {
        Long userId = TenantContext.getCurrentUserId();
        
        userService.changePassword(userId, request.getCurrentPassword(), request.getNewPassword());
        return ResponseEntity.ok("Password changed successfully");
    }
    
    @GetMapping("/{userId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('INSTRUCTOR')")
    @Operation(summary = "Get user by ID", description = "Get user details by ID (Admin/Instructor only)")
    public ResponseEntity<UserResponse> getUserById(@PathVariable Long userId) {
        String tenantCode = TenantContext.getCurrentTenant();
        
        UserResponse response = userService.getUserById(userId, tenantCode);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('INSTRUCTOR')")
    @Operation(summary = "Get all users", description = "Get all users in tenant (Admin/Instructor only)")
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        String tenantCode = TenantContext.getCurrentTenant();
        
        List<UserResponse> users = userService.getUsersByTenant(tenantCode);
        return ResponseEntity.ok(users);
    }
    
    @GetMapping("/role/{roleName}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get users by role", description = "Get users by role (Admin only)")
    public ResponseEntity<List<UserResponse>> getUsersByRole(@PathVariable String roleName) {
        String tenantCode = TenantContext.getCurrentTenant();
        
        List<UserResponse> users = userService.getUsersByRole(tenantCode, roleName);
        return ResponseEntity.ok(users);
    }
    
    @PostMapping("/{userId}/deactivate")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Deactivate user", description = "Deactivate a user (Admin only)")
    public ResponseEntity<String> deactivateUser(@PathVariable Long userId) {
        String tenantCode = TenantContext.getCurrentTenant();
        
        userService.deactivateUser(userId, tenantCode);
        return ResponseEntity.ok("User deactivated successfully");
    }
    
    // Inner class for change password request
    public static class ChangePasswordRequest {
        private String currentPassword;
        private String newPassword;
        
        public String getCurrentPassword() { return currentPassword; }
        public void setCurrentPassword(String currentPassword) { this.currentPassword = currentPassword; }
        
        public String getNewPassword() { return newPassword; }
        public void setNewPassword(String newPassword) { this.newPassword = newPassword; }
    }
}
