package com.endesha360.SchoolManagementService.controller;

import com.endesha360.SchoolManagementService.util.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/debug")
public class ComprehensiveDebugController {
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @GetMapping("/comprehensive-test")
    public ResponseEntity<Map<String, Object>> comprehensiveJwtTest(HttpServletRequest request) {
        Map<String, Object> result = new HashMap<>();
        
        // 1. Check Authorization header
        String authHeader = request.getHeader("Authorization");
        result.put("1_authHeader_present", authHeader != null);
        result.put("1_authHeader_raw", authHeader);
        
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            result.put("error", "No valid Authorization header");
            return ResponseEntity.ok(result);
        }
        
        // 2. Extract token
        String token = authHeader.substring(7).trim();
        result.put("2_token_length", token.length());
        result.put("2_token_preview", token.substring(0, Math.min(50, token.length())) + "...");
        
        // 3. Test JWT parsing
        try {
            String username = jwtUtil.extractUsername(token);
            result.put("3_username_extracted", username);
            
            String userId = jwtUtil.extractUserId(token);
            result.put("3_userId_extracted", userId);
            
            String role = jwtUtil.extractRole(token);
            result.put("3_role_extracted", role);
            
            String tenantCode = jwtUtil.extractTenantCode(token);
            result.put("3_tenantCode_extracted", tenantCode);
            
            // 4. Test token validation
            boolean isValid = jwtUtil.validateToken(token, username);
            result.put("4_token_valid", isValid);
            
        } catch (Exception e) {
            result.put("3_jwt_parsing_error", e.getMessage());
            result.put("3_jwt_error_class", e.getClass().getSimpleName());
        }
        
        // 5. Check Spring Security context
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null) {
            result.put("5_authenticated", auth.isAuthenticated());
            result.put("5_principal", auth.getPrincipal());
            result.put("5_authorities", auth.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(java.util.stream.Collectors.toList()));
        } else {
            result.put("5_authentication", "null");
        }
        
        // 6. Check request attributes
        result.put("6_userId_attribute", request.getAttribute("userId"));
        result.put("6_role_attribute", request.getAttribute("role"));
        result.put("6_tenantCode_attribute", request.getAttribute("tenantCode"));
        
        return ResponseEntity.ok(result);
    }
}
