package com.endesha360.UserManagementService.security;

import com.endesha360.UserManagementService.service.JwtTokenService;
import com.endesha360.UserManagementService.service.SessionService;
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
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    
    @Autowired
    private JwtTokenService jwtTokenService;
    
    @Autowired
    private SessionService sessionService;
    
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, 
                                  FilterChain filterChain) throws ServletException, IOException {
        
        String token = getTokenFromRequest(request);
        
        if (StringUtils.hasText(token)) {
            try {
                // Validate token and session
                if (jwtTokenService.validateToken(token, jwtTokenService.getUsernameFromToken(token)) &&
                    sessionService.isSessionValid(token)) {
                    
                    String username = jwtTokenService.getUsernameFromToken(token);
                    Long userId = jwtTokenService.getUserIdFromToken(token);
                    String tenantCode = jwtTokenService.getTenantCodeFromToken(token);
                    Set<String> roles = jwtTokenService.getRolesFromToken(token);
                    Set<String> permissions = jwtTokenService.getPermissionsFromToken(token);
                    
            // Always add ROLE_<role> for each role, including SUPER_ADMIN
            List<SimpleGrantedAuthority> authorities = roles.stream()
                .map(role -> new SimpleGrantedAuthority("ROLE_" + role))
                .collect(Collectors.toList());
            // Add permissions as authorities
            authorities.addAll(permissions.stream()
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toList()));
                    
                    // Create authentication token
                    UsernamePasswordAuthenticationToken authentication = 
                            new UsernamePasswordAuthenticationToken(username, null, authorities);
                    authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    
                    // Set tenant context
                    TenantContext.setCurrentTenant(tenantCode);
                    TenantContext.setCurrentUserId(userId);
                    
                    // Update session activity
                    sessionService.updateSessionActivity(token);
                    
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                }
            } catch (Exception e) {
                logger.error("Cannot set user authentication: {}", e);
            }
        }
        
        filterChain.doFilter(request, response);
    }
    
    private String getTokenFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}
