package com.endesha360.UserManagementService.config;

import com.endesha360.UserManagementService.entity.Role;
import com.endesha360.UserManagementService.entity.Tenant;
import com.endesha360.UserManagementService.repository.RoleRepository;
import com.endesha360.UserManagementService.repository.TenantRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements ApplicationRunner {
    
    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);
    
    @Autowired
    private TenantRepository tenantRepository;
    
    @Autowired
    private RoleRepository roleRepository;
    
    @Override
    public void run(ApplicationArguments args) throws Exception {
        logger.info("Initializing default data...");
        
        // Create default platform tenant
        createDefaultTenant();
        
        // Create default roles
        createDefaultRoles();
        
        logger.info("Default data initialization completed.");
    }
    
    private void createDefaultTenant() {
        if (tenantRepository.findByCode("PLATFORM").isEmpty()) {
            Tenant platformTenant = new Tenant();
            platformTenant.setName("Endesha360 Platform");
            platformTenant.setCode("PLATFORM");
            platformTenant.setIsActive(true);
            platformTenant.setDescription("Default platform tenant for school owners before school registration");
            
            tenantRepository.save(platformTenant);
            logger.info("Created default platform tenant: PLATFORM");
        } else {
            logger.info("Platform tenant already exists");
        }
    }
    
    private void createDefaultRoles() {
        String[] defaultRoles = {"ADMIN", "SCHOOL_OWNER", "INSTRUCTOR", "STUDENT"};
        
        for (String roleName : defaultRoles) {
            if (roleRepository.findByName(roleName).isEmpty()) {
                Role role = new Role();
                role.setName(roleName);
                role.setDescription(getRoleDescription(roleName));
                
                roleRepository.save(role);
                logger.info("Created default role: {}", roleName);
            }
        }
    }
    
    private String getRoleDescription(String roleName) {
        return switch (roleName) {
            case "ADMIN" -> "System administrator with full access";
            case "SCHOOL_OWNER" -> "School owner who can register and manage their driving school";
            case "INSTRUCTOR" -> "Driving instructor who can teach students";
            case "STUDENT" -> "Student learning to drive";
            default -> "Default role";
        };
    }
}
