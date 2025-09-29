package com.endesha360.UserManagementService.controller;

import com.endesha360.UserManagementService.dto.request.SchoolOwnerRegistrationRequest;
import com.endesha360.UserManagementService.dto.response.UserResponse;
import com.endesha360.UserManagementService.dto.response.ActivityResponse;
import com.endesha360.UserManagementService.service.SchoolOwnerService;
import com.endesha360.UserManagementService.service.JwtTokenService;
import com.endesha360.UserManagementService.service.ActivityService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/school-owners")
@Tag(name = "School Owner Registration", description = "School owner personal registration endpoints")
public class SchoolOwnerController {
    
    @Autowired
    private SchoolOwnerService schoolOwnerService;
    
    @Autowired
    private JwtTokenService jwtTokenService;
    
    @Autowired
    private ActivityService activityService;
    
    @PostMapping("/register")
    @Operation(summary = "School owner personal registration", 
               description = "Register as a school owner (personal account before school business registration)")
    public ResponseEntity<UserResponse> registerSchoolOwner(@Valid @RequestBody SchoolOwnerRegistrationRequest request) {
        UserResponse response = schoolOwnerService.registerSchoolOwner(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/student-count")
    @Operation(summary = "Get student count for school owner", 
               description = "Returns the number of students registered under the school owner's school tenant")
    public ResponseEntity<Map<String, Object>> getStudentCount(@RequestHeader("Authorization") String authHeader) {
        try {
            // Extract token from Authorization header
            String token = authHeader.substring(7); // Remove "Bearer " prefix
            Long userId = jwtTokenService.getUserIdFromToken(token);
            
            // Get student count by school owner's school tenant (not user's tenant)
            long studentCount = schoolOwnerService.getStudentCountBySchoolOwner(userId.toString());
            
            return ResponseEntity.ok(Map.of(
                "count", studentCount,
                "userId", userId
            ));
        } catch (Exception e) {
            return ResponseEntity.ok(Map.of("count", 0));
        }
    }

    @GetMapping("/recent-activities")
    @Operation(summary = "Get recent activities for school owner", 
               description = "Returns recent activities from the school owner's school tenant")
    public ResponseEntity<Map<String, Object>> getRecentActivities(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam(defaultValue = "10") int limit) {
        try {
            // Extract token from Authorization header
            String token = authHeader.substring(7); // Remove "Bearer " prefix
            Long userId = jwtTokenService.getUserIdFromToken(token);
            
            // For now, use hardcoded tenant code - should be replaced with dynamic lookup
            String schoolTenantCode = "SAFEDRIV"; // This should be fetched from school service
            
            // Get recent activities for the school's tenant
            List<ActivityResponse> activities = activityService.getRecentActivities(schoolTenantCode, limit);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "activities", activities,
                "count", activities.size()
            ));
        } catch (Exception e) {
            return ResponseEntity.ok(Map.of(
                "success", false,
                "activities", List.of(),
                "count", 0,
                "error", e.getMessage()
            ));
        }
    }
}
