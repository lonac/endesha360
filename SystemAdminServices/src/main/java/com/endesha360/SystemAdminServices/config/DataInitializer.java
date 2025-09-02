package com.endesha360.SystemAdminServices.config;

import com.endesha360.SystemAdminServices.entity.SystemAdmin;
import com.endesha360.SystemAdminServices.repository.SystemAdminRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.Set;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    @Autowired
    private SystemAdminRepository systemAdminRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Check if any admin exists
        if (systemAdminRepository.count() == 0) {
            logger.info("No admin users found. Creating default admin user...");
            
            SystemAdmin defaultAdmin = new SystemAdmin();
            defaultAdmin.setUsername("admin");
            defaultAdmin.setEmail("admin@endesha360.com");
            defaultAdmin.setPassword(passwordEncoder.encode("admin123"));
            defaultAdmin.setFirstName("System");
            defaultAdmin.setLastName("Administrator");
            defaultAdmin.setRole(SystemAdmin.AdminRole.SUPER_ADMIN);
            defaultAdmin.setStatus(SystemAdmin.AdminStatus.ACTIVE);
            
            // Add all permissions for super admin
            Set<SystemAdmin.Permission> permissions = createAllPermissions();
            defaultAdmin.setPermissions(permissions);
            
            systemAdminRepository.save(defaultAdmin);
            logger.info("Default admin user created successfully");
            logger.info("Username: admin");
            logger.info("Password: admin123");
            logger.info("Role: SUPER_ADMIN");
            logger.info("Permissions: {}", permissions);
        } else {
            logger.info("Admin users already exist. Checking if permissions need to be updated...");
            
            // Check for admin users without permissions and update them
            systemAdminRepository.findAll().forEach(admin -> {
                if (admin.getPermissions().isEmpty() && admin.getRole() == SystemAdmin.AdminRole.SUPER_ADMIN) {
                    logger.info("Updating permissions for admin user: {}", admin.getUsername());
                    Set<SystemAdmin.Permission> permissions = createAllPermissions();
                    admin.setPermissions(permissions);
                    systemAdminRepository.save(admin);
                    logger.info("Updated permissions for admin: {} with permissions: {}", admin.getUsername(), permissions);
                }
            });
        }
    }
    
    private Set<SystemAdmin.Permission> createAllPermissions() {
        Set<SystemAdmin.Permission> permissions = new HashSet<>();
        permissions.add(SystemAdmin.Permission.MANAGE_SCHOOLS);
        permissions.add(SystemAdmin.Permission.APPROVE_SCHOOLS);
        permissions.add(SystemAdmin.Permission.REJECT_SCHOOLS);
        permissions.add(SystemAdmin.Permission.VIEW_SCHOOLS);
        permissions.add(SystemAdmin.Permission.MANAGE_USERS);
        permissions.add(SystemAdmin.Permission.VIEW_REPORTS);
        permissions.add(SystemAdmin.Permission.MANAGE_SYSTEM_SETTINGS);
        permissions.add(SystemAdmin.Permission.AUDIT_LOGS);
        permissions.add(SystemAdmin.Permission.MANAGE_ADMINS);
        permissions.add(SystemAdmin.Permission.MANAGE_QUESTIONS);
        permissions.add(SystemAdmin.Permission.APPROVE_QUESTIONS);
        permissions.add(SystemAdmin.Permission.VIEW_QUESTIONS);
        permissions.add(SystemAdmin.Permission.BULK_UPLOAD_QUESTIONS);
        return permissions;
    }
}
