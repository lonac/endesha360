package com.endesha360.SystemAdminServices.security;

import com.endesha360.SystemAdminServices.util.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final Logger logger = LoggerFactory.getLogger(JwtAuthenticationFilter.class);

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, 
                                  FilterChain filterChain) throws ServletException, IOException {

        if (logger.isDebugEnabled()) {
            logger.debug("JWT Filter processing request: {} {}", request.getMethod(), request.getRequestURI());
        }

        String token = getTokenFromRequest(request);

        if (StringUtils.hasText(token)) {
            try {
                String username = jwtUtil.getUsernameFromToken(token);
                
                if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                    if (jwtUtil.validateToken(token, username)) {
                        Long adminId = jwtUtil.getAdminIdFromToken(token);
                        String role = jwtUtil.getRoleFromToken(token);
                        
                        if (logger.isDebugEnabled()) {
                            logger.debug("JWT Authentication - Username: {}, Role: {}, AdminId: {}", 
                                username, role, adminId);
                        }

                        // Create authentication token with admin role
                        UsernamePasswordAuthenticationToken authToken = 
                            new UsernamePasswordAuthenticationToken(
                                username, 
                                null, 
                                Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + role))
                            );
                        
                        authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                        
                        // Store admin info in request attributes
                        request.setAttribute("adminId", adminId);
                        request.setAttribute("adminUsername", username);
                        request.setAttribute("adminRole", role);
                        
                        SecurityContextHolder.getContext().setAuthentication(authToken);
                        
                        if (logger.isDebugEnabled()) {
                            logger.debug("Successfully authenticated admin: {}", username);
                        }
                    } else {
                        logger.warn("Invalid JWT token for username: {}", username);
                    }
                }
            } catch (Exception e) {
                logger.error("Cannot set admin authentication: {}", e.getMessage());
            }
        }

        filterChain.doFilter(request, response);
    }

    private String getTokenFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7).trim();
        }
        return null;
    }
}
