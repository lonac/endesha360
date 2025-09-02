package com.endesha360.SystemAdminServices.controller;

import com.endesha360.SystemAdminServices.dto.SchoolApprovalRequest;
import com.endesha360.SystemAdminServices.dto.SchoolDTO;
import com.endesha360.SystemAdminServices.entity.SchoolApprovalAction;
import com.endesha360.SystemAdminServices.service.SchoolManagementService;
import com.endesha360.SystemAdminServices.util.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/schools")
@CrossOrigin(origins = "*")
public class SchoolApprovalController {

    @Autowired
    private SchoolManagementService schoolManagementService;

    @Autowired
    private JwtUtil jwtUtil;

    // New endpoint: GET /api/schools?status=...
        @GetMapping("")
        @org.springframework.security.access.prepost.PreAuthorize("hasAuthority('VIEW_SCHOOLS')")
        public ResponseEntity<Map<String, Object>> getSchoolsByStatus(@RequestParam(value = "status", required = false) String status) {
        try {
            List<SchoolDTO> schools;
            if (status == null || status.isEmpty()) {
                schools = schoolManagementService.getAllSchools();
            } else if (status.equalsIgnoreCase("PENDING")) {
                schools = schoolManagementService.getPendingSchools();
            } else if (status.equalsIgnoreCase("APPROVED")) {
                schools = schoolManagementService.getApprovedSchools();
            } else if (status.equalsIgnoreCase("REJECTED")) {
                schools = schoolManagementService.getRejectedSchools();
            } else {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("success", false);
                errorResponse.put("message", "Unsupported status: " + status);
                return ResponseEntity.badRequest().body(errorResponse);
            }
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("schools", schools);
            response.put("count", schools.size());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to fetch schools: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @GetMapping("/pending")
    @org.springframework.security.access.prepost.PreAuthorize("hasAuthority('VIEW_SCHOOLS')")
    public ResponseEntity<Map<String, Object>> getPendingSchools() {
        try {
            List<SchoolDTO> pendingSchools = schoolManagementService.getPendingSchools();
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("schools", pendingSchools);
            response.put("count", pendingSchools.size());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to fetch pending schools: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @GetMapping("/all")
    public ResponseEntity<Map<String, Object>> getAllSchools() {
        try {
            List<SchoolDTO> schools = schoolManagementService.getAllSchools();
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("schools", schools);
            response.put("count", schools.size());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to fetch schools: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @GetMapping("/{schoolId}")
    public ResponseEntity<Map<String, Object>> getSchoolById(@PathVariable Long schoolId) {
        try {
            SchoolDTO school = schoolManagementService.getSchoolById(schoolId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("school", school);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to fetch school: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
        }
    }

    @PutMapping("/approve")
    public ResponseEntity<Map<String, Object>> approveRejectSchool(
            @Valid @RequestBody SchoolApprovalRequest request,
            HttpServletRequest httpRequest) {
        try {
            // Extract admin info from JWT token
            String authHeader = httpRequest.getHeader("Authorization");
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("success", false);
                errorResponse.put("message", "Authorization token required");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
            }

            String token = authHeader.substring(7);
            Long adminId = jwtUtil.getAdminIdFromToken(token);
            String adminUsername = jwtUtil.getUsernameFromToken(token);

            Map<String, Object> result = schoolManagementService.approveSchool(request, adminId, adminUsername);
            
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to process approval: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @GetMapping("/{schoolId}/history")
    public ResponseEntity<Map<String, Object>> getSchoolApprovalHistory(@PathVariable Long schoolId) {
        try {
            List<SchoolApprovalAction> history = schoolManagementService.getApprovalHistory(schoolId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("history", history);
            response.put("schoolId", schoolId);
            response.put("count", history.size());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to fetch approval history: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @GetMapping("/admin/{adminId}/actions")
    public ResponseEntity<Map<String, Object>> getAdminActions(@PathVariable Long adminId) {
        try {
            List<SchoolApprovalAction> actions = schoolManagementService.getAdminActions(adminId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("actions", actions);
            response.put("adminId", adminId);
            response.put("count", actions.size());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to fetch admin actions: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @GetMapping("/admin/{adminId}/statistics")
    public ResponseEntity<Map<String, Object>> getAdminStatistics(@PathVariable Long adminId) {
        try {
            Map<String, Object> stats = schoolManagementService.getApprovalStatistics(adminId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("statistics", stats);
            response.put("adminId", adminId);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to fetch statistics: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
}
