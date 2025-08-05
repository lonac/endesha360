package com.endesha360.UserManagementService.controller;

import com.endesha360.UserManagementService.dto.request.LoginRequest;
import com.endesha360.UserManagementService.dto.request.UserRegistrationRequest;
import com.endesha360.UserManagementService.dto.response.LoginResponse;
import com.endesha360.UserManagementService.dto.response.UserResponse;
import com.endesha360.UserManagementService.service.AuthenticationService;
import com.endesha360.UserManagementService.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Authentication", description = "Authentication and registration endpoints")
public class AuthController {
    
    @Autowired
    private AuthenticationService authenticationService;
    
    @Autowired
    private UserService userService;
    
    @PostMapping("/login")
    @Operation(summary = "User login", description = "Authenticate user and return JWT token")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest loginRequest, 
                                             HttpServletRequest request) {
        String ipAddress = getClientIpAddress(request);
        String userAgent = request.getHeader("User-Agent");
        
        LoginResponse response = authenticationService.authenticate(loginRequest, ipAddress, userAgent);
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/register")
    @Operation(summary = "User registration", description = "Register a new user")
    public ResponseEntity<UserResponse> register(@Valid @RequestBody UserRegistrationRequest request) {
        UserResponse response = userService.createUser(request);
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/logout")
    @Operation(summary = "User logout", description = "Logout user and invalidate session")
    public ResponseEntity<String> logout(HttpServletRequest request) {
        String token = getTokenFromRequest(request);
        if (token != null) {
            authenticationService.logout(token);
        }
        return ResponseEntity.ok("Logged out successfully");
    }
    
    @GetMapping("/validate")
    @Operation(summary = "Validate token", description = "Validate JWT token")
    public ResponseEntity<Boolean> validateToken(HttpServletRequest request) {
        String token = getTokenFromRequest(request);
        if (token != null) {
            boolean isValid = authenticationService.validateToken(token);
            return ResponseEntity.ok(isValid);
        }
        return ResponseEntity.ok(false);
    }
    
    @GetMapping("/me")
    @Operation(summary = "Get current user info", description = "Get current user information from token")
    public ResponseEntity<LoginResponse.UserInfo> getCurrentUser(HttpServletRequest request) {
        String token = getTokenFromRequest(request);
        if (token != null) {
            LoginResponse.UserInfo userInfo = authenticationService.getUserInfoFromToken(token);
            return ResponseEntity.ok(userInfo);
        }
        return ResponseEntity.notFound().build();
    }
    
    private String getClientIpAddress(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor == null || xForwardedFor.isEmpty()) {
            return request.getRemoteAddr();
        }
        return xForwardedFor.split(",")[0].trim();
    }
    
    private String getTokenFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}
