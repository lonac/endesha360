package com.endesha360.UserManagementService.service;

import com.endesha360.UserManagementService.entity.User;
import com.endesha360.UserManagementService.entity.Tenant;
import com.endesha360.UserManagementService.entity.TenantUser;
import com.endesha360.UserManagementService.entity.UserSession;
import com.endesha360.UserManagementService.repository.UserRepository;
import com.endesha360.UserManagementService.repository.TenantRepository;
import com.endesha360.UserManagementService.repository.TenantUserRepository;
import com.endesha360.UserManagementService.dto.request.LoginRequest;
import com.endesha360.UserManagementService.dto.response.LoginResponse;
import com.endesha360.UserManagementService.exception.AuthenticationException;
import com.endesha360.UserManagementService.exception.TenantNotFoundException;
import com.endesha360.UserManagementService.exception.UserNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@Transactional
public class AuthenticationService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private TenantRepository tenantRepository;
    
    @Autowired
    private TenantUserRepository tenantUserRepository;
    
    @Autowired
    private SessionService sessionService;
    
    @Autowired
    private JwtTokenService jwtTokenService;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private ActivityService activityService;
    
    /**
     * Detect which tenant a user belongs to based on their email/username
     * This is needed for dynamic tenant login
     */
    public String detectUserTenant(String usernameOrEmail) {
        try {
            // Find user by username or email
            User user = userRepository.findByUsernameOrEmail(usernameOrEmail, usernameOrEmail)
                    .orElseThrow(() -> new UserNotFoundException("User not found: " + usernameOrEmail));
            
            // Find all tenant-user relationships for this user
            java.util.List<TenantUser> userTenants = tenantUserRepository.findByUserId(user.getId());
            
            if (userTenants.isEmpty()) {
                throw new RuntimeException("User is not associated with any tenant");
            }
            
            // For now, return the first tenant (users should typically belong to one tenant)
            // In future, we might need to handle multiple tenants
            String tenantCode = userTenants.get(0).getTenant().getCode();
            
            // Log which tenant was detected
            System.out.println("Detected tenant for user " + usernameOrEmail + ": " + tenantCode);
            
            return tenantCode;
        } catch (Exception e) {
            // If we can't detect tenant, default to PLATFORM for backward compatibility
            System.err.println("Could not detect tenant for user " + usernameOrEmail + ", defaulting to PLATFORM: " + e.getMessage());
            return "PLATFORM";
        }
    }
    
    public LoginResponse authenticate(LoginRequest loginRequest, String ipAddress, String userAgent) {
        // Find tenant
        Tenant tenant = tenantRepository.findByCode(loginRequest.getTenantCode())
                .orElseThrow(() -> new TenantNotFoundException("Tenant not found: " + loginRequest.getTenantCode()));
        
        // Find user by username or email
        User user = userRepository.findByUsernameOrEmail(
                loginRequest.getUsernameOrEmail(),
                loginRequest.getUsernameOrEmail()
        ).orElseThrow(() -> new UserNotFoundException("User not found: " + loginRequest.getUsernameOrEmail()));
        
        // Check if user is active
        if (!user.getIsActive()) {
            throw new AuthenticationException("User account is deactivated");
        }
        
        // Verify password
        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            throw new AuthenticationException("Invalid credentials");
        }
        
        // Check if user belongs to this tenant
        Optional<TenantUser> tenantUser = tenantUserRepository.findActiveTenantUser(user.getId(), tenant.getId());
        if (tenantUser.isEmpty()) {
            throw new AuthenticationException("User does not belong to this tenant");
        }
        
        // Get user roles and permissions for this tenant
        Set<String> roles = tenantUser.get().getRoles().stream()
                .map(role -> role.getName())
                .collect(Collectors.toSet());
        
        Set<String> permissions = tenantUser.get().getRoles().stream()
                .flatMap(role -> role.getPermissions().stream())
                .map(permission -> permission.getName())
                .collect(Collectors.toSet());
        
        // Generate JWT token
        String accessToken = jwtTokenService.generateToken(
                user.getUsername(),
                user.getId(),
                tenant.getCode(),
                roles,
                permissions
        );
        
        // Create session
        sessionService.createSession(user, tenant, accessToken, ipAddress, userAgent);
        
        // Update last login
        user.setLastLogin(LocalDateTime.now());
        userRepository.save(user);
        
        // Log meaningful login activities (exclude school owners to avoid noise)
        if (roles.contains("STUDENT")) {
            // Only log first login of the day to avoid spam
            java.time.LocalDate today = java.time.LocalDate.now();
            java.time.LocalDate lastLoginDate = user.getLastLogin() != null ? 
                user.getLastLogin().toLocalDate() : null;
            
            if (lastLoginDate == null || !lastLoginDate.equals(today)) {
                activityService.logActivity(
                    "STUDENT_ACTIVITY",
                    String.format("📖 Student %s %s started learning session", 
                        user.getFirstName(), user.getLastName()),
                    tenant.getCode(),
                    user.getId().toString()
                );
            }
        } else if (roles.contains("INSTRUCTOR")) {
            activityService.logActivity(
                "INSTRUCTOR_ACTIVITY",
                String.format("👨‍🏫 Instructor %s %s is now active", 
                    user.getFirstName(), user.getLastName()),
                tenant.getCode(),
                user.getId().toString()
            );
        }
        
        // Create response
        LoginResponse.UserInfo userInfo = new LoginResponse.UserInfo(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName()
        );
        userInfo.setRoles(roles);
        userInfo.setPermissions(permissions);
        userInfo.setLastLogin(user.getLastLogin());
        
        return new LoginResponse(
                accessToken,
                jwtTokenService.getExpirationTime(),
                userInfo,
                tenant.getCode()
        );
    }
    
    public void logout(String token) {
        sessionService.invalidateSession(token);
    }
    
    public boolean validateToken(String token) {
        try {
            org.slf4j.Logger logger = org.slf4j.LoggerFactory.getLogger(AuthenticationService.class);
            logger.debug("Validating token in AuthenticationService: {}", token);
            String username = jwtTokenService.getUsernameFromToken(token);
            boolean jwtValid = jwtTokenService.validateToken(token, username);
            boolean sessionValid = sessionService.isSessionValid(token);
            logger.debug("JWT valid: {}, Session valid: {}", jwtValid, sessionValid);
            return jwtValid && sessionValid;
        } catch (Exception e) {
            org.slf4j.Logger logger = org.slf4j.LoggerFactory.getLogger(AuthenticationService.class);
            logger.error("Exception during token validation", e);
            return false;
        }
    }
    
    public LoginResponse.UserInfo getUserInfoFromToken(String token) {
        String username = jwtTokenService.getUsernameFromToken(token);
        Long userId = jwtTokenService.getUserIdFromToken(token);
        String tenantCode = jwtTokenService.getTenantCodeFromToken(token);
        Set<String> roles = jwtTokenService.getRolesFromToken(token);
        Set<String> permissions = jwtTokenService.getPermissionsFromToken(token);
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found: " + userId));
        
        LoginResponse.UserInfo userInfo = new LoginResponse.UserInfo(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName()
        );
        userInfo.setRoles(roles);
        userInfo.setPermissions(permissions);
        userInfo.setLastLogin(user.getLastLogin());
        
        return userInfo;
    }
}
