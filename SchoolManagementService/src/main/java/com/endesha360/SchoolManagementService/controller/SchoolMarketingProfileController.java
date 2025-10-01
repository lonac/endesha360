package com.endesha360.SchoolManagementService.controller;

import com.endesha360.SchoolManagementService.dto.SchoolMarketingProfileRequest;
import com.endesha360.SchoolManagementService.dto.SchoolMarketingProfileResponse;
import com.endesha360.SchoolManagementService.service.SchoolMarketingProfileService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;

@RestController
@RequestMapping("/api/schools/marketing")
@Tag(name = "School Marketing Profile", description = "APIs for managing school marketing profiles")
public class SchoolMarketingProfileController {
    
    private static final Logger logger = LoggerFactory.getLogger(SchoolMarketingProfileController.class);
    
    @Autowired
    private SchoolMarketingProfileService marketingProfileService;
    
    @PostMapping("/profile")
    @Operation(summary = "Create or update school marketing profile")
    @PreAuthorize("hasRole('SCHOOL_OWNER')")
    public ResponseEntity<SchoolMarketingProfileResponse> createOrUpdateProfile(
            @Valid @RequestBody SchoolMarketingProfileRequest request,
            HttpServletRequest httpRequest) {
        
        String ownerUserId = (String) httpRequest.getAttribute("userId");
        String role = (String) httpRequest.getAttribute("role");
        
        logger.info("Marketing profile save request - UserId: {}, Role: {}", ownerUserId, role);
        
        if (ownerUserId == null) {
            logger.error("UserId is null in request attributes");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        
        try {
            SchoolMarketingProfileResponse response = 
                marketingProfileService.createOrUpdateMarketingProfile(request, ownerUserId);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error saving marketing profile for owner {}: {}", ownerUserId, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/profile")
    @Operation(summary = "Get my school marketing profile")
    @PreAuthorize("hasRole('SCHOOL_OWNER')")
    public ResponseEntity<SchoolMarketingProfileResponse> getMyProfile(HttpServletRequest httpRequest) {
        String ownerUserId = (String) httpRequest.getAttribute("userId");
        if (ownerUserId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        
        try {
            SchoolMarketingProfileResponse response = 
                marketingProfileService.getMarketingProfileByOwner(ownerUserId);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @PutMapping("/profile/visibility")
    @Operation(summary = "Toggle profile public visibility")
    @PreAuthorize("hasRole('SCHOOL_OWNER')")
    public ResponseEntity<SchoolMarketingProfileResponse> toggleVisibility(
            @RequestParam boolean isPublic,
            HttpServletRequest httpRequest) {
        
        String ownerUserId = (String) httpRequest.getAttribute("userId");
        if (ownerUserId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        
        try {
            SchoolMarketingProfileResponse response = 
                marketingProfileService.toggleProfileVisibility(ownerUserId, isPublic);
            
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // Public endpoints (no authentication required) - For students to browse schools
    @GetMapping("/public/directory")
    @Operation(summary = "Get public school directory", description = "Browse all public school marketing profiles")
    public ResponseEntity<List<SchoolMarketingProfileResponse>> getPublicSchoolDirectory() {
        try {
            List<SchoolMarketingProfileResponse> schools = marketingProfileService.getPublicSchoolProfiles();
            return ResponseEntity.ok(schools);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/public/search")
    @Operation(summary = "Search schools by criteria", description = "Search public school profiles by location and courses")
    public ResponseEntity<List<SchoolMarketingProfileResponse>> searchSchools(
            @Parameter(description = "Filter by city") @RequestParam(required = false) String city,
            @Parameter(description = "Filter by course type") @RequestParam(required = false) String courseType,
            @Parameter(description = "Filter by license type") @RequestParam(required = false) String licenseType) {
        
        try {
            List<SchoolMarketingProfileResponse> schools = 
                marketingProfileService.searchSchools(city, courseType, licenseType);
            
            return ResponseEntity.ok(schools);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/public/profile/{schoolId}")
    @Operation(summary = "Get public school profile", description = "View detailed public school marketing profile")
    public ResponseEntity<SchoolMarketingProfileResponse> getPublicSchoolProfile(
            @Parameter(description = "School ID") @PathVariable Long schoolId) {
        
        try {
            SchoolMarketingProfileResponse profile = marketingProfileService.getPublicSchoolProfile(schoolId);
            return ResponseEntity.ok(profile);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
}
