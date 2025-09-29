package com.endesha360.UserManagementService.controller;

import com.endesha360.UserManagementService.dto.request.TenantCreationRequest;
import com.endesha360.UserManagementService.dto.response.TenantResponse;
import com.endesha360.UserManagementService.entity.Tenant;
import com.endesha360.UserManagementService.service.TenantService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/tenants")
@Tag(name = "Tenant Management", description = "Internal APIs for managing tenants - used by other microservices")
public class TenantController {
    
    private static final Logger logger = LoggerFactory.getLogger(TenantController.class);
    
    @Autowired
    private TenantService tenantService;
    
    /**
     * Create a new tenant (for internal service communication)
     */
    @PostMapping("/create")
    @Operation(summary = "Create tenant", description = "Internal API for creating tenant when school is approved")
    public ResponseEntity<TenantResponse> createTenant(@Valid @RequestBody TenantCreationRequest request) {
        try {
            logger.info("Creating tenant: {}", request);
            
            Tenant tenant = tenantService.createTenant(
                request.getName(), 
                request.getCode(), 
                request.getDescription()
            );
            
            TenantResponse response = convertToTenantResponse(tenant);
            logger.info("Tenant created successfully: {}", response.getCode());
            
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            logger.error("Error creating tenant: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Check if tenant exists by code
     */
    @GetMapping("/exists/{code}")
    @Operation(summary = "Check tenant existence", description = "Internal API to check if tenant exists")
    public ResponseEntity<Boolean> tenantExists(
            @Parameter(description = "Tenant code to check")
            @PathVariable String code) {
        try {
            boolean exists = tenantService.tenantExists(code);
            logger.info("Tenant existence check: code={}, exists={}", code, exists);
            return ResponseEntity.ok(exists);
        } catch (Exception e) {
            logger.error("Error checking tenant existence: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Get tenant by code
     */
    @GetMapping("/code/{code}")
    @Operation(summary = "Get tenant by code", description = "Internal API to get tenant details by code")
    public ResponseEntity<TenantResponse> getTenantByCode(
            @Parameter(description = "Tenant code")
            @PathVariable String code) {
        try {
            Optional<Tenant> tenant = tenantService.getTenantByCode(code);
            
            if (tenant.isPresent()) {
                TenantResponse response = convertToTenantResponse(tenant.get());
                return ResponseEntity.ok(response);
            } else {
                logger.warn("Tenant not found: {}", code);
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            logger.error("Error getting tenant by code: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Activate tenant
     */
    @PutMapping("/{code}/activate")
    @Operation(summary = "Activate tenant", description = "Internal API to activate tenant")
    public ResponseEntity<String> activateTenant(
            @Parameter(description = "Tenant code to activate")
            @PathVariable String code) {
        try {
            tenantService.activateTenant(code);
            logger.info("Tenant activated: {}", code);
            return ResponseEntity.ok("Tenant activated successfully");
        } catch (Exception e) {
            logger.error("Error activating tenant: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error activating tenant: " + e.getMessage());
        }
    }
    
    /**
     * Deactivate tenant
     */
    @PutMapping("/{code}/deactivate")
    @Operation(summary = "Deactivate tenant", description = "Internal API to deactivate tenant")
    public ResponseEntity<String> deactivateTenant(
            @Parameter(description = "Tenant code to deactivate")
            @PathVariable String code) {
        try {
            tenantService.deactivateTenant(code);
            logger.info("Tenant deactivated: {}", code);
            return ResponseEntity.ok("Tenant deactivated successfully");
        } catch (Exception e) {
            logger.error("Error deactivating tenant: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error deactivating tenant: " + e.getMessage());
        }
    }
    
    /**
     * Convert Tenant entity to TenantResponse
     */
    private TenantResponse convertToTenantResponse(Tenant tenant) {
        return new TenantResponse(
            tenant.getId(),
            tenant.getName(),
            tenant.getCode(),
            tenant.getDescription(),
            tenant.getIsActive(),
            tenant.getCreatedAt(),
            tenant.getUpdatedAt()
        );
    }
}
