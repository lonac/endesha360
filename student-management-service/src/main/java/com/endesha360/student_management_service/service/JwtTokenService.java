package com.endesha360.student_management_service.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import java.util.function.Function;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class JwtTokenService {
    private static final Logger logger = LoggerFactory.getLogger(JwtTokenService.class);

    @Value("${app.jwt.secret:mySecretKey}")
    private String jwtSecret;

    @Value("${app.jwt.expiration:86400}")
    private int jwtExpirationInMs;

    private SecretKey getSigningKey() {
        logger.debug("Using JWT secret: {}", jwtSecret);
        return Keys.hmacShaKeyFor(jwtSecret.getBytes());
    }

    public String generateToken(String username, Long userId, String tenantCode, Set<String> roles, Set<String> permissions) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", userId);
        claims.put("tenantCode", tenantCode);
        claims.put("roles", roles);
        claims.put("permissions", permissions);
        return createToken(claims, username);
    }

    private String createToken(Map<String, Object> claims, String subject) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpirationInMs * 1000L);
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public String getUsernameFromToken(String token) {
        return getClaimFromToken(token, Claims::getSubject);
    }

    public Date getExpirationDateFromToken(String token) {
        return getClaimFromToken(token, Claims::getExpiration);
    }

    public Long getUserIdFromToken(String token) {
        Claims claims = getAllClaimsFromToken(token);
        return claims.get("userId", Long.class);
    }

    public String getTenantCodeFromToken(String token) {
        Claims claims = getAllClaimsFromToken(token);
        return claims.get("tenantCode", String.class);
    }

    @SuppressWarnings("unchecked")
    public Set<String> getRolesFromToken(String token) {
        Claims claims = getAllClaimsFromToken(token);
        return Set.copyOf((Set<String>) claims.get("roles"));
    }

    @SuppressWarnings("unchecked")
    public Set<String> getPermissionsFromToken(String token) {
        Claims claims = getAllClaimsFromToken(token);
        return Set.copyOf((Set<String>) claims.get("permissions"));
    }

    public <T> T getClaimFromToken(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = getAllClaimsFromToken(token);
        return claimsResolver.apply(claims);
    }

    private Claims getAllClaimsFromToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    private Boolean isTokenExpired(String token) {
        final Date expiration = getExpirationDateFromToken(token);
        return expiration.before(new Date());
    }

    public Boolean validateToken(String token, String username) {
        try {
            final String usernameFromToken = getUsernameFromToken(token);
            return (usernameFromToken.equals(username) && !isTokenExpired(token));
        } catch (Exception e) {
            logger.error("Token validation failed: {}", e.getMessage());
            return false;
        }
    }
}
