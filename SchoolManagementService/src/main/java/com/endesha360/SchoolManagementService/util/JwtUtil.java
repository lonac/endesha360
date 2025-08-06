package com.endesha360.SchoolManagementService.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.List;
import java.util.Set;

@Component
public class JwtUtil {
    
    @Value("${app.jwt.secret}")
    private String secret;
    
    @Value("${app.jwt.expiration}")
    private Long expiration;
    
    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(secret.getBytes());
    }
    
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }
    
    public String extractUserId(String token) {
        // UserManagementService stores userId as Long, we need to convert to String
        Long userIdLong = extractClaim(token, claims -> claims.get("userId", Long.class));
        return userIdLong != null ? userIdLong.toString() : null;
    }
    
    public String extractRole(String token) {
        // UserManagementService stores roles as Set<String>, but JWT parsing returns it as List
        Object rolesObj = extractClaim(token, claims -> claims.get("roles"));
        if (rolesObj instanceof List) {
            @SuppressWarnings("unchecked")
            List<String> rolesList = (List<String>) rolesObj;
            return rolesList != null && !rolesList.isEmpty() ? rolesList.get(0) : null;
        } else if (rolesObj instanceof Set) {
            @SuppressWarnings("unchecked")
            Set<String> rolesSet = (Set<String>) rolesObj;
            return rolesSet != null && !rolesSet.isEmpty() ? rolesSet.iterator().next() : null;
        }
        return null;
    }
    
    public String extractTenantCode(String token) {
        return extractClaim(token, claims -> claims.get("tenantCode", String.class));
    }
    
    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }
    
    public <T> T extractClaim(String token, java.util.function.Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }
    
    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
    
    public Boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }
    
    public Boolean validateToken(String token, String username) {
        final String tokenUsername = extractUsername(token);
        return (tokenUsername.equals(username) && !isTokenExpired(token));
    }
}
