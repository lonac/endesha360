package com.endesha360.SystemAdminServices.controller;

import com.endesha360.SystemAdminServices.dto.LoginRequest;
import com.endesha360.SystemAdminServices.dto.SystemAdminResponse;
import com.endesha360.SystemAdminServices.entity.SystemAdmin;
import com.endesha360.SystemAdminServices.service.SystemAdminService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
@Tag(name = "System Admin Management", description = "System administrator management endpoints")
public class SystemAdminController {

    @Autowired
    private SystemAdminService systemAdminService;

    @PostMapping("/login")
    @Operation(summary = "Admin login", description = "Authenticate system admin and return JWT token")
    public ResponseEntity<Map<String, Object>> login(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            Map<String, Object> response = systemAdminService.authenticate(loginRequest);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
        }
    }

    @PostMapping("/register")
    @Operation(summary = "Register new admin", description = "Register a new system administrator (Super Admin only)")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<Map<String, Object>> registerAdmin(@Valid @RequestBody SystemAdmin admin) {
        try {
            SystemAdminResponse createdAdmin = systemAdminService.createAdmin(admin, "SYSTEM");
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Admin registered successfully");
            response.put("admin", createdAdmin);
            
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }

    @GetMapping("/all")
    @Operation(summary = "Get all admins", description = "Retrieve all system administrators")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<Map<String, Object>> getAllAdmins() {
        try {
            List<SystemAdminResponse> admins = systemAdminService.getAllAdmins();
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("admins", admins);
            response.put("count", admins.size());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to fetch admins: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getAdminById(@PathVariable Long id) {
        try {
            SystemAdminResponse admin = systemAdminService.getAdminById(id);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("admin", admin);
            
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
        }
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<Map<String, Object>> getAdminsByStatus(@PathVariable String status) {
        try {
            SystemAdmin.AdminStatus adminStatus = SystemAdmin.AdminStatus.valueOf(status.toUpperCase());
            List<SystemAdminResponse> admins = systemAdminService.getAdminsByStatus(adminStatus);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("admins", admins);
            response.put("status", status);
            response.put("count", admins.size());
            
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Invalid status: " + status);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Map<String, Object>> updateAdminStatus(
            @PathVariable Long id, 
            @RequestParam String status,
            @RequestParam String updatedBy) {
        try {
            SystemAdmin.AdminStatus adminStatus = SystemAdmin.AdminStatus.valueOf(status.toUpperCase());
            SystemAdminResponse updatedAdmin = systemAdminService.updateAdminStatus(id, adminStatus, updatedBy);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Admin status updated successfully");
            response.put("admin", updatedAdmin);
            
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Invalid status: " + status);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        } catch (RuntimeException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteAdmin(@PathVariable Long id) {
        try {
            systemAdminService.deleteAdmin(id);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Admin deleted successfully");
            
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
        }
    }

    @GetMapping("/search")
    public ResponseEntity<Map<String, Object>> searchAdmins(@RequestParam String query) {
        try {
            List<SystemAdminResponse> admins = systemAdminService.searchAdmins(query);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("admins", admins);
            response.put("query", query);
            response.put("count", admins.size());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Search failed: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
}
