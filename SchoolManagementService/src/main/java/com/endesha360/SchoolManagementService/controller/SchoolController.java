package com.endesha360.SchoolManagementService.controller;

import com.endesha360.SchoolManagementService.dto.SchoolRegistrationRequest;
import com.endesha360.SchoolManagementService.dto.SchoolRegistrationResponse;
import com.endesha360.SchoolManagementService.entity.School;
import com.endesha360.SchoolManagementService.service.SchoolService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/schools")
@Tag(name = "School Management", description = "APIs for managing driving schools")
public class SchoolController {
    
    private static final Logger logger = LoggerFactory.getLogger(SchoolController.class);
    
    @Autowired
    private SchoolService schoolService;
    
    @PostMapping("/register")
    @Operation(summary = "Register a new driving school", 
               description = "Step 2 of registration: School owner registers their driving school business")
    @PreAuthorize("hasRole('SCHOOL_OWNER')")
    public ResponseEntity<SchoolRegistrationResponse> registerSchool(
            @Valid @RequestBody SchoolRegistrationRequest request,
            HttpServletRequest httpRequest) {
        
        logger.info("School registration request received for: {}", request.getName());
        
        // Extract user ID from JWT token (set by JwtAuthenticationFilter)
        String ownerUserId = (String) httpRequest.getAttribute("userId");
        
        if (ownerUserId == null) {
            logger.error("User ID not found in request attributes");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        
        try {
            SchoolRegistrationResponse response = schoolService.registerSchool(request, ownerUserId);
            logger.info("School registered successfully: {}", response.getName());
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
            
        } catch (Exception e) {
            logger.error("Error registering school: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }
    
    @GetMapping("/my-school")
    @Operation(summary = "Get school owned by current user")
    @PreAuthorize("hasRole('SCHOOL_OWNER')")
    public ResponseEntity<School> getMySchool(HttpServletRequest httpRequest) {
        
        String ownerUserId = (String) httpRequest.getAttribute("userId");
        
        if (ownerUserId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        
        Optional<School> school = schoolService.getSchoolByOwner(ownerUserId);
        
        if (school.isPresent()) {
            return ResponseEntity.ok(school.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    @PutMapping("/my-school")
    @Operation(summary = "Update school information")
    @PreAuthorize("hasRole('SCHOOL_OWNER')")
    public ResponseEntity<School> updateMySchool(
            @Valid @RequestBody SchoolRegistrationRequest request,
            HttpServletRequest httpRequest) {
        
        String ownerUserId = (String) httpRequest.getAttribute("userId");
        
        if (ownerUserId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        
        try {
            // First get the school to get its ID
            Optional<School> existingSchool = schoolService.getSchoolByOwner(ownerUserId);
            
            if (existingSchool.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            School updatedSchool = schoolService.updateSchool(existingSchool.get().getId(), request, ownerUserId);
            return ResponseEntity.ok(updatedSchool);
            
        } catch (Exception e) {
            logger.error("Error updating school: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }
    
    @GetMapping("/tenant/{tenantCode}")
    @Operation(summary = "Get school by tenant code", description = "Internal API for other services")
    public ResponseEntity<School> getSchoolByTenantCode(
            @Parameter(description = "Tenant code of the school")
            @PathVariable String tenantCode) {
        
        Optional<School> school = schoolService.getSchoolByTenantCode(tenantCode);
        
        if (school.isPresent()) {
            return ResponseEntity.ok(school.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
