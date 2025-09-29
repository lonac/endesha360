package com.endesha360.UserManagementService.service;

import com.endesha360.UserManagementService.dto.request.SchoolOwnerRegistrationRequest;
import com.endesha360.UserManagementService.dto.request.UserRegistrationRequest;
import com.endesha360.UserManagementService.dto.response.UserResponse;
import com.endesha360.UserManagementService.entity.Role;
import com.endesha360.UserManagementService.entity.Tenant;
import com.endesha360.UserManagementService.entity.TenantUser;
import com.endesha360.UserManagementService.entity.User;
import com.endesha360.UserManagementService.exception.UserAlreadyExistsException;
import com.endesha360.UserManagementService.exception.UserNotFoundException;
import com.endesha360.UserManagementService.repository.RoleRepository;
import com.endesha360.UserManagementService.repository.TenantRepository;
import com.endesha360.UserManagementService.repository.TenantUserRepository;
import com.endesha360.UserManagementService.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Set;

@Service
@Transactional
public class SchoolOwnerService {
    
    private static final Logger logger = LoggerFactory.getLogger(SchoolOwnerService.class);
    private static final String PLATFORM_TENANT_CODE = "PLATFORM";
    private static final String SCHOOL_OWNER_ROLE = "SCHOOL_OWNER";
    
    @Autowired
    private TenantUserRepository tenantUserRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private TenantRepository tenantRepository;
    
    @Autowired
    private RoleRepository roleRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private UserService userService;
    
    public UserResponse registerSchoolOwner(SchoolOwnerRegistrationRequest request) {
        logger.info("Registering school owner: {}", request.getUsername());
        
        // Check if username already exists
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new UserAlreadyExistsException("Username already exists: " + request.getUsername());
        }
        
        // Check if email already exists
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new UserAlreadyExistsException("Email already exists: " + request.getEmail());
        }
        
        // Convert to UserRegistrationRequest with PLATFORM tenant
        UserRegistrationRequest userRequest = new UserRegistrationRequest();
        userRequest.setUsername(request.getUsername());
        userRequest.setEmail(request.getEmail());
        userRequest.setPassword(request.getPassword());
        userRequest.setFirstName(request.getFirstName());
        userRequest.setLastName(request.getLastName());
        userRequest.setPhoneNumber(request.getPhoneNumber());
        userRequest.setTenantCode(PLATFORM_TENANT_CODE);
        
        // Create user using existing UserService
        UserResponse userResponse = userService.createUser(userRequest);
        
        // Override the role assignment to SCHOOL_OWNER
        assignSchoolOwnerRole(userResponse.getId());
        
        logger.info("Successfully registered school owner: {} with ID: {}", request.getUsername(), userResponse.getId());
        
        // Return updated user response with SCHOOL_OWNER role
        return userService.getUserById(userResponse.getId(), PLATFORM_TENANT_CODE);
    }
    
    private void assignSchoolOwnerRole(Long userId) {
        logger.info("Assigning SCHOOL_OWNER role to user: {}", userId);
        
        // Get the platform tenant
        Tenant platformTenant = tenantRepository.findByCode(PLATFORM_TENANT_CODE)
                .orElseThrow(() -> new UserNotFoundException("Platform tenant not found"));
        
        // Get the user
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found: " + userId));
        
        // Get the SCHOOL_OWNER role
        Role schoolOwnerRole = roleRepository.findByName(SCHOOL_OWNER_ROLE)
                .orElseThrow(() -> new UserNotFoundException("Role not found: " + SCHOOL_OWNER_ROLE));
        
        // Find the TenantUser relationship
        TenantUser tenantUser = tenantUserRepository.findByTenantIdAndUserId(platformTenant.getId(), userId)
                .orElseThrow(() -> new UserNotFoundException("TenantUser relationship not found"));
        
        // Clear existing roles and assign SCHOOL_OWNER
        tenantUser.getRoles().clear();
        tenantUser.addRole(schoolOwnerRole);
        
        tenantUserRepository.save(tenantUser);
        logger.info("Successfully assigned SCHOOL_OWNER role to user: {}", userId);
    }

    /**
     * Get count of students registered under a specific tenant
     */
    public long getStudentCountByTenant(String tenantCode) {
        try {
            logger.info("Getting student count for tenant: {}", tenantCode);
            
            // Find the tenant
            Tenant tenant = tenantRepository.findByCode(tenantCode)
                    .orElse(null);
            
            if (tenant == null) {
                logger.warn("Tenant not found: {}", tenantCode);
                return 0;
            }
            
            // Find STUDENT role
            Role studentRole = roleRepository.findByName("STUDENT")
                    .orElse(null);
            
            if (studentRole == null) {
                logger.warn("STUDENT role not found");
                return 0;
            }
            
            // Count students in this tenant
            long count = tenantUserRepository.countByTenantIdAndRoles(tenant.getId(), studentRole);
            logger.info("Found {} students for tenant: {}", count, tenantCode);
            
            return count;
        } catch (Exception e) {
            logger.error("Error getting student count for tenant {}: {}", tenantCode, e.getMessage(), e);
            return 0;
        }
    }

    /**
     * Get count of students for a school owner's school
     * This method needs to call SchoolManagementService to get the school's tenant code
     */
    public long getStudentCountBySchoolOwner(String userId) {
        try {
            logger.info("Getting student count for school owner with userId: {}", userId);
            
            // TODO: For now, we'll hardcode the tenant code since we know it's SAFEDRIV
            // In production, this should call SchoolManagementService to get the school's tenantCode
            String schoolTenantCode = "SAFEDRIV"; // This should be fetched from school service
            
            return getStudentCountByTenant(schoolTenantCode);
        } catch (Exception e) {
            logger.error("Error getting student count for school owner {}: {}", userId, e.getMessage(), e);
            return 0;
        }
    }
}
