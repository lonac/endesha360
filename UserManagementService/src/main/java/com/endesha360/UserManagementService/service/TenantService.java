package com.endesha360.UserManagementService.service;

import com.endesha360.UserManagementService.entity.Tenant;
import com.endesha360.UserManagementService.repository.TenantRepository;
import com.endesha360.UserManagementService.exception.TenantNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@Transactional
public class TenantService {
    
    private static final Logger logger = LoggerFactory.getLogger(TenantService.class);
    
    @Autowired
    private TenantRepository tenantRepository;
    
    /**
     * Create a new tenant for school
     */
    public Tenant createTenant(String name, String code, String description) {
        logger.info("Creating tenant: code={}, name={}", code, name);
        
        // Check if tenant already exists
        Optional<Tenant> existingTenant = tenantRepository.findByCode(code);
        if (existingTenant.isPresent()) {
            logger.info("Tenant already exists: {}", code);
            return existingTenant.get();
        }
        
        // Create new tenant
        Tenant tenant = new Tenant(name, code, description);
        tenant.setIsActive(true);
        
        Tenant savedTenant = tenantRepository.save(tenant);
        logger.info("Tenant created successfully: id={}, code={}", savedTenant.getId(), savedTenant.getCode());
        
        return savedTenant;
    }
    
    /**
     * Get tenant by code
     */
    public Optional<Tenant> getTenantByCode(String code) {
        return tenantRepository.findByCode(code);
    }
    
    /**
     * Check if tenant exists by code
     */
    public boolean tenantExists(String code) {
        return tenantRepository.findByCode(code).isPresent();
    }
    
    /**
     * Activate tenant
     */
    public void activateTenant(String code) {
        Tenant tenant = tenantRepository.findByCode(code)
                .orElseThrow(() -> new TenantNotFoundException("Tenant not found: " + code));
        
        tenant.setIsActive(true);
        tenantRepository.save(tenant);
        logger.info("Tenant activated: {}", code);
    }
    
    /**
     * Deactivate tenant
     */
    public void deactivateTenant(String code) {
        Tenant tenant = tenantRepository.findByCode(code)
                .orElseThrow(() -> new TenantNotFoundException("Tenant not found: " + code));
        
        tenant.setIsActive(false);
        tenantRepository.save(tenant);
        logger.info("Tenant deactivated: {}", code);
    }
}
