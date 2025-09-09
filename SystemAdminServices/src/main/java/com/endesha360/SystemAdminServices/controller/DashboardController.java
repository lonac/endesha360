package com.endesha360.SystemAdminServices.controller;

import com.endesha360.SystemAdminServices.service.DashboardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
@Tag(name = "Dashboard Management", description = "System admin dashboard endpoints")
@SecurityRequirement(name = "bearerAuth")
public class DashboardController {

    private static final Logger logger = LoggerFactory.getLogger(DashboardController.class);

    @Autowired
    private DashboardService dashboardService;

    @GetMapping("/dashboard")
    @Operation(summary = "Get comprehensive dashboard data", description = "Retrieve all dashboard statistics and data")
    @PreAuthorize("hasAuthority('VIEW_REPORTS') or hasAuthority('MANAGE_SYSTEM_SETTINGS')")
    public ResponseEntity<Map<String, Object>> getDashboardData() {
        try {
            String authHeader = null;
            if (org.springframework.web.context.request.RequestContextHolder.getRequestAttributes() instanceof org.springframework.web.context.request.ServletRequestAttributes attrs) {
                authHeader = attrs.getRequest().getHeader("Authorization");
            }
            String token = null;
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                token = authHeader.substring(7);
            }
            Map<String, Object> dashboardData = dashboardService.getDashboardData(token);

            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("message", "Dashboard data retrieved successfully");
            result.put("data", dashboardData);

            return ResponseEntity.ok(result);
        } catch (Exception e) {
            logger.error("Error fetching dashboard data: ", e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to fetch dashboard data: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @GetMapping("/activities/recent")
    @Operation(summary = "Get recent activities", description = "Retrieve recent system activities")
    @PreAuthorize("hasAuthority('VIEW_REPORTS') or hasAuthority('AUDIT_LOGS')")
    public ResponseEntity<Map<String, Object>> getRecentActivities(
            @RequestParam(defaultValue = "10") int limit) {
        try {
            var activities = dashboardService.getRecentActivities(limit);

            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("message", "Recent activities retrieved successfully");
            result.put("data", activities);

            return ResponseEntity.ok(result);
        } catch (Exception e) {
            logger.error("Error fetching recent activities: ", e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to fetch recent activities: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @GetMapping("/system/health")
    @Operation(summary = "Get system health status", description = "Retrieve system health and status information")
    @PreAuthorize("hasAuthority('VIEW_REPORTS') or hasAuthority('MANAGE_SYSTEM_SETTINGS')")
    public ResponseEntity<Map<String, Object>> getSystemHealth() {
        try {
            Map<String, Object> healthData = dashboardService.getSystemHealth();

            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("message", "System health retrieved successfully");
            result.put("data", healthData);

            return ResponseEntity.ok(result);
        } catch (Exception e) {
            logger.error("Error fetching system health: ", e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to fetch system health: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @GetMapping("/financial/statistics")
    @Operation(summary = "Get financial statistics", description = "Retrieve financial data and statistics")
    @PreAuthorize("hasAuthority('VIEW_REPORTS')")
    public ResponseEntity<Map<String, Object>> getFinancialStatistics() {
        try {
            Map<String, Object> financialData = dashboardService.getFinancialStatistics();

            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("message", "Financial statistics retrieved successfully");
            result.put("data", financialData);

            return ResponseEntity.ok(result);
        } catch (Exception e) {
            logger.error("Error fetching financial statistics: ", e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to fetch financial statistics: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
}
