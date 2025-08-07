package com.endesha360.SystemAdminServices.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import jakarta.servlet.http.HttpServletRequest;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/debug")
public class DebugController {

    @GetMapping("/auth")
    public ResponseEntity<Map<String, Object>> debugAuth(HttpServletRequest request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        
        Map<String, Object> response = new HashMap<>();
        response.put("isAuthenticated", auth != null && auth.isAuthenticated());
        response.put("principal", auth != null ? auth.getPrincipal() : null);
        response.put("authorities", auth != null ? auth.getAuthorities() : null);
        response.put("adminId", request.getAttribute("adminId"));
        response.put("adminUsername", request.getAttribute("adminUsername"));
        response.put("adminRole", request.getAttribute("adminRole"));
        
        return ResponseEntity.ok(response);
    }
}
