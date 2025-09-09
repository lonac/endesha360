package com.endesha360.UserManagementService.controller;

import com.endesha360.UserManagementService.service.UserService;
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
@RequestMapping("/api/users")
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "User Statistics", description = "User statistics and analytics endpoints")
public class UserStatisticsController {

    private static final Logger logger = LoggerFactory.getLogger(UserStatisticsController.class);

    @Autowired
    private UserService userService;

    @GetMapping("/admin/statistics")
    @Operation(summary = "Get user statistics", description = "Retrieve comprehensive user statistics for admin dashboard")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getUserStatistics() {
        try {
            Map<String, Object> statistics = userService.getUserStatistics();

            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("message", "User statistics retrieved successfully");
            result.put("data", statistics);

            return ResponseEntity.ok(result);
        } catch (Exception e) {
            logger.error("Error fetching user statistics: ", e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to fetch user statistics: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
}
