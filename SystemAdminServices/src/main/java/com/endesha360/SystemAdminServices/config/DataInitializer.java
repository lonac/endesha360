package com.endesha360.SystemAdminServices.config;

import com.endesha360.SystemAdminServices.entity.SystemAdmin;
import com.endesha360.SystemAdminServices.repository.SystemAdminRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

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
            
            systemAdminRepository.save(defaultAdmin);
            logger.info("Default admin user created successfully");
            logger.info("Username: admin");
            logger.info("Password: admin123");
            logger.info("Role: SUPER_ADMIN");
        } else {
            logger.info("Admin users already exist. Skipping default admin creation.");
        }
    }
}
