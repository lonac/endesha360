package com.endesha360.SchoolManagementService.security;

import com.endesha360.SchoolManagementService.util.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, 
                                    FilterChain filterChain) throws ServletException, IOException {
        
        if (logger.isInfoEnabled()) {
            logger.info("JWT Filter processing request: " + request.getMethod() + " " + request.getRequestURI());
        }
        
        final String authorizationHeader = request.getHeader("Authorization");
        
        if (logger.isInfoEnabled()) {
            logger.info("Authorization header in filter: " + (authorizationHeader != null ? "Present" : "Missing"));
        }
        
        String username = null;
        String jwt = null;
        
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            jwt = authorizationHeader.substring(7);
            if (logger.isInfoEnabled()) {
                logger.info("Received JWT token: " + jwt.substring(0, Math.min(50, jwt.length())) + "...");
            }
            try {
                username = jwtUtil.extractUsername(jwt);
                if (logger.isInfoEnabled()) {
                    logger.info("Extracted username from JWT: " + username);
                }
            } catch (Exception e) {
                logger.error("Error extracting username from JWT: " + e.getMessage());
                filterChain.doFilter(request, response);
                return;
            }
        } else {
            if (logger.isWarnEnabled()) {
                logger.warn("No valid Authorization header found. Header: " + authorizationHeader);
            }
        }
        
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            if (jwtUtil.validateToken(jwt, username)) {
                String role = jwtUtil.extractRole(jwt);
                String userId = jwtUtil.extractUserId(jwt);
                String tenantCode = jwtUtil.extractTenantCode(jwt);
                
                if (logger.isInfoEnabled()) {
                    logger.info("JWT Authentication - Username: " + username + ", Role: " + role + ", UserId: " + userId + ", TenantCode: " + tenantCode);
                }
                
                UsernamePasswordAuthenticationToken authToken = 
                    new UsernamePasswordAuthenticationToken(
                        username, 
                        null, 
                        Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + role))
                    );
                
                // Add user details to authentication
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                
                // Store additional JWT claims in request attributes
                request.setAttribute("userId", userId);
                request.setAttribute("role", role);
                request.setAttribute("tenantCode", tenantCode);
                
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }
        
        filterChain.doFilter(request, response);
    }
}
