package com.endesha360.UserManagementService.service;

import com.endesha360.UserManagementService.entity.User;
import com.endesha360.UserManagementService.entity.Tenant;
import com.endesha360.UserManagementService.entity.TenantUser;
import com.endesha360.UserManagementService.entity.Role;
import com.endesha360.UserManagementService.repository.UserRepository;
import com.endesha360.UserManagementService.repository.TenantRepository;
import com.endesha360.UserManagementService.repository.TenantUserRepository;
import com.endesha360.UserManagementService.repository.RoleRepository;
import com.endesha360.UserManagementService.dto.request.UserRegistrationRequest;
import com.endesha360.UserManagementService.dto.response.UserResponse;
import com.endesha360.UserManagementService.exception.UserAlreadyExistsException;
import com.endesha360.UserManagementService.exception.TenantNotFoundException;
import com.endesha360.UserManagementService.exception.UserNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@Transactional
public class UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private TenantRepository tenantRepository;
    
    @Autowired
    private TenantUserRepository tenantUserRepository;
    
    @Autowired
    private RoleRepository roleRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    public UserResponse createUser(UserRegistrationRequest request) {
        // Check if user already exists
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new UserAlreadyExistsException("Username already exists: " + request.getUsername());
        }
        
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new UserAlreadyExistsException("Email already exists: " + request.getEmail());
        }
        
        // Find tenant
        Tenant tenant = tenantRepository.findByCode(request.getTenantCode())
                .orElseThrow(() -> new TenantNotFoundException("Tenant not found: " + request.getTenantCode()));
        
        // Create user
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setPhoneNumber(request.getPhoneNumber());
        user.setIsActive(true);
        user.setIsEmailVerified(false);
        
        user = userRepository.save(user);
        
        // Create tenant-user relationship
        TenantUser tenantUser = new TenantUser(tenant, user);
        
        // Assign default role (Student)
        Optional<Role> defaultRole = roleRepository.findByName("STUDENT");
        if (defaultRole.isPresent()) {
            tenantUser.addRole(defaultRole.get());
        }
        
        tenantUserRepository.save(tenantUser);
        
        return convertToUserResponse(user, tenant.getCode());
    }
    
    public UserResponse getUserById(Long userId, String tenantCode) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found: " + userId));
        
        return convertToUserResponse(user, tenantCode);
    }
    
    public UserResponse getUserByUsername(String username, String tenantCode) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException("User not found: " + username));
        
        return convertToUserResponse(user, tenantCode);
    }
    
    public UserResponse updateUserProfile(Long userId, String tenantCode, UserRegistrationRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found: " + userId));
        
        // Update user fields
        if (request.getFirstName() != null) {
            user.setFirstName(request.getFirstName());
        }
        if (request.getLastName() != null) {
            user.setLastName(request.getLastName());
        }
        if (request.getPhoneNumber() != null) {
            user.setPhoneNumber(request.getPhoneNumber());
        }
        if (request.getEmail() != null && !request.getEmail().equals(user.getEmail())) {
            if (userRepository.existsByEmail(request.getEmail())) {
                throw new UserAlreadyExistsException("Email already exists: " + request.getEmail());
            }
            user.setEmail(request.getEmail());
            user.setIsEmailVerified(false);
        }
        
        user = userRepository.save(user);
        return convertToUserResponse(user, tenantCode);
    }
    
    public void changePassword(Long userId, String currentPassword, String newPassword) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found: " + userId));
        
        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            throw new IllegalArgumentException("Current password is incorrect");
        }
        
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }
    
    public void deactivateUser(Long userId, String tenantCode) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found: " + userId));
        
        user.setIsActive(false);
        userRepository.save(user);
    }
    
    public List<UserResponse> getUsersByTenant(String tenantCode) {
        Tenant tenant = tenantRepository.findByCode(tenantCode)
                .orElseThrow(() -> new TenantNotFoundException("Tenant not found: " + tenantCode));
        
        List<User> users = userRepository.findActiveUsersByTenantId(tenant.getId());
        return users.stream()
                .map(user -> convertToUserResponse(user, tenantCode))
                .collect(Collectors.toList());
    }
    
    public List<UserResponse> getUsersByRole(String tenantCode, String roleName) {
        Tenant tenant = tenantRepository.findByCode(tenantCode)
                .orElseThrow(() -> new TenantNotFoundException("Tenant not found: " + tenantCode));
        
        List<User> users = userRepository.findUsersByTenantIdAndRole(tenant.getId(), roleName);
        return users.stream()
                .map(user -> convertToUserResponse(user, tenantCode))
                .collect(Collectors.toList());
    }
    
    private UserResponse convertToUserResponse(User user, String tenantCode) {
        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setUsername(user.getUsername());
        response.setEmail(user.getEmail());
        response.setFirstName(user.getFirstName());
        response.setLastName(user.getLastName());
        response.setPhoneNumber(user.getPhoneNumber());
        response.setIsActive(user.getIsActive());
        response.setIsEmailVerified(user.getIsEmailVerified());
        response.setLastLogin(user.getLastLogin());
        response.setCreatedAt(user.getCreatedAt());
        
        // Get roles and permissions for this tenant
        Tenant tenant = tenantRepository.findByCode(tenantCode).orElse(null);
        if (tenant != null) {
            Optional<TenantUser> tenantUser = tenantUserRepository.findActiveTenantUser(user.getId(), tenant.getId());
            if (tenantUser.isPresent()) {
                Set<String> roles = tenantUser.get().getRoles().stream()
                        .map(Role::getName)
                        .collect(Collectors.toSet());
                response.setRoles(roles);
                
                Set<String> permissions = tenantUser.get().getRoles().stream()
                        .flatMap(role -> role.getPermissions().stream())
                        .map(permission -> permission.getName())
                        .collect(Collectors.toSet());
                response.setPermissions(permissions);
            }
        }
        
        return response;
    }

    public java.util.Map<String, Object> getUserStatistics() {
        java.util.Map<String, Object> statistics = new java.util.HashMap<>();

        try {
            // Get total users across all tenants
            long totalUsers = userRepository.count();

            // Get users by role (this is a simplified approach - you might need to adjust based on your actual data model)
            long studentsCount = userRepository.countUsersByRole("STUDENT");
            long instructorsCount = userRepository.countUsersByRole("INSTRUCTOR");
            long adminsCount = userRepository.countUsersByRole("ADMIN");

            statistics.put("totalUsers", totalUsers);
            statistics.put("studentsCount", studentsCount);
            statistics.put("instructorsCount", instructorsCount);
            statistics.put("adminsCount", adminsCount);

        } catch (Exception e) {
            // Return default values if there's an error
            statistics.put("totalUsers", 0L);
            statistics.put("studentsCount", 0L);
            statistics.put("instructorsCount", 0L);
            statistics.put("adminsCount", 0L);
        }

        return statistics;
    }
}
