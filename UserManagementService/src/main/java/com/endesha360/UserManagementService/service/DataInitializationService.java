package com.endesha360.UserManagementService.service;

import com.endesha360.UserManagementService.entity.Permission;
import com.endesha360.UserManagementService.entity.Role;
import com.endesha360.UserManagementService.entity.Tenant;
import com.endesha360.UserManagementService.repository.PermissionRepository;
import com.endesha360.UserManagementService.repository.RoleRepository;
import com.endesha360.UserManagementService.repository.TenantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;

@Service
@Transactional
public class DataInitializationService implements ApplicationRunner {
    
    @Autowired
    private RoleRepository roleRepository;
    
    @Autowired
    private PermissionRepository permissionRepository;
    
    @Autowired
    private TenantRepository tenantRepository;
    
    @Override
    public void run(ApplicationArguments args) throws Exception {
        initializeDefaultPermissions();
        initializeDefaultRoles();
        initializeDefaultTenant();
    }
    
    private void initializeDefaultPermissions() {
        List<Permission> defaultPermissions = Arrays.asList(
            // User Management Permissions
            new Permission("USER_READ", "Read user information", "USER", "READ"),
            new Permission("USER_WRITE", "Create and update users", "USER", "WRITE"),
            new Permission("USER_DELETE", "Delete users", "USER", "DELETE"),
            new Permission("USER_PROFILE_UPDATE", "Update own profile", "USER", "PROFILE_UPDATE"),
            
            // Role Management Permissions
            new Permission("ROLE_READ", "Read roles", "ROLE", "READ"),
            new Permission("ROLE_WRITE", "Create and update roles", "ROLE", "WRITE"),
            new Permission("ROLE_DELETE", "Delete roles", "ROLE", "DELETE"),
            
            // Session Management Permissions
            new Permission("SESSION_READ", "Read sessions", "SESSION", "READ"),
            new Permission("SESSION_MANAGE", "Manage sessions", "SESSION", "MANAGE"),
            
            // Tenant Management Permissions
            new Permission("TENANT_READ", "Read tenant information", "TENANT", "READ"),
            new Permission("TENANT_WRITE", "Update tenant settings", "TENANT", "WRITE"),
            
            // Admin Permissions
            new Permission("ADMIN_FULL_ACCESS", "Full administrative access", "ADMIN", "FULL_ACCESS")
        );
        
        for (Permission permission : defaultPermissions) {
            if (!permissionRepository.existsByName(permission.getName())) {
                permissionRepository.save(permission);
            }
        }
    }
    
    private void initializeDefaultRoles() {
        // Admin Role - Full access
        if (!roleRepository.existsByName("ADMIN")) {
            Role adminRole = new Role("ADMIN", "System Administrator", true);
            adminRole = roleRepository.save(adminRole);
            
            // Add all permissions to admin
            List<Permission> allPermissions = permissionRepository.findAll();
            for (Permission permission : allPermissions) {
                adminRole.addPermission(permission);
            }
            roleRepository.save(adminRole);
        }
        
        // Instructor Role - Can manage students and view data
        if (!roleRepository.existsByName("INSTRUCTOR")) {
            Role instructorRole = new Role("INSTRUCTOR", "Driving Instructor", true);
            instructorRole = roleRepository.save(instructorRole);
            
            // Add specific permissions for instructors
            List<String> instructorPermissions = Arrays.asList(
                "USER_READ", "USER_PROFILE_UPDATE", "SESSION_READ"
            );
            
            for (String permName : instructorPermissions) {
                permissionRepository.findByName(permName)
                    .ifPresent(instructorRole::addPermission);
            }
            roleRepository.save(instructorRole);
        }
        
        // Student Role - Basic access
        if (!roleRepository.existsByName("STUDENT")) {
            Role studentRole = new Role("STUDENT", "Driving Student", true);
            studentRole = roleRepository.save(studentRole);
            
            // Add basic permissions for students
            List<String> studentPermissions = Arrays.asList(
                "USER_PROFILE_UPDATE"
            );
            
            for (String permName : studentPermissions) {
                permissionRepository.findByName(permName)
                    .ifPresent(studentRole::addPermission);
            }
            roleRepository.save(studentRole);
        }
    }
    
    private void initializeDefaultTenant() {
        // Create a default tenant for testing
        if (!tenantRepository.existsByCode("DEFAULT")) {
            Tenant defaultTenant = new Tenant(
                "Default Driving School",
                "DEFAULT",
                "Default tenant for testing and development"
            );
            tenantRepository.save(defaultTenant);
        }
    }
}
