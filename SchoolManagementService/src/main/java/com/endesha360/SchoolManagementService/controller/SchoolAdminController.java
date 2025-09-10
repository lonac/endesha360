package com.endesha360.SchoolManagementService.controller;

import com.endesha360.SchoolManagementService.entity.School;
import com.endesha360.SchoolManagementService.service.SchoolService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/schools/admin")
@Tag(name = "School Admin", description = "Admin APIs for managing schools")
@PreAuthorize("hasRole('ADMIN')")
public class SchoolAdminController {
    
    private static final Logger logger = LoggerFactory.getLogger(SchoolAdminController.class);
    
    @Autowired
    private SchoolService schoolService;
    
    @GetMapping("/pending")
    @Operation(summary = "Get schools pending approval")
        public ResponseEntity<List<com.endesha360.SchoolManagementService.dto.SchoolDTO>> getPendingApprovalSchools() {
            List<School> schools = schoolService.getPendingApprovalSchools();
            List<com.endesha360.SchoolManagementService.dto.SchoolDTO> dtos = schoolService.mapSchoolsToDTOs(schools);
            return ResponseEntity.ok(dtos);
    }
    
    @GetMapping("/active")
    @Operation(summary = "Get all active and approved schools")
        public ResponseEntity<List<com.endesha360.SchoolManagementService.dto.SchoolDTO>> getActiveSchools() {
            List<School> schools = schoolService.getActiveSchools();
            List<com.endesha360.SchoolManagementService.dto.SchoolDTO> dtos = schoolService.mapSchoolsToDTOs(schools);
            return ResponseEntity.ok(dtos);
    }
    
    @PostMapping("/{schoolId}/approve")
    @Operation(summary = "Approve a school")
    public ResponseEntity<String> approveSchool(@PathVariable Long schoolId) {
        try {
            schoolService.approveSchool(schoolId);
            logger.info("School approved by admin: {}", schoolId);
            return ResponseEntity.ok("School approved successfully");
        } catch (Exception e) {
            logger.error("Error approving school {}: {}", schoolId, e.getMessage());
            return ResponseEntity.badRequest().body("Error approving school: " + e.getMessage());
        }
    }
    
    @GetMapping("/stats")
    @Operation(summary = "Get school statistics")
    public ResponseEntity<SchoolService.SchoolStats> getSchoolStats() {
        SchoolService.SchoolStats stats = schoolService.getSchoolStats();
        return ResponseEntity.ok(stats);
    }
}
