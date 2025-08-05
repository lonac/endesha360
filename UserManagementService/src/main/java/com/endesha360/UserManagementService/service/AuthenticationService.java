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
            String username = jwtTokenService.getUsernameFromToken(token);
            return jwtTokenService.validateToken(token, username) && 
                   sessionService.isSessionValid(token);
        } catch (Exception e) {
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
