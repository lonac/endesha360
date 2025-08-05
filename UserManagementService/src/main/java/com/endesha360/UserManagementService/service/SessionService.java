package com.endesha360.UserManagementService.service;

import com.endesha360.UserManagementService.entity.User;
import com.endesha360.UserManagementService.entity.Tenant;
import com.endesha360.UserManagementService.entity.UserSession;
import com.endesha360.UserManagementService.repository.UserSessionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@Transactional
public class SessionService {
    
    @Autowired
    private UserSessionRepository sessionRepository;
    
    @Value("${app.jwt.expiration:86400}")
    private int sessionExpirationInSeconds;
    
    public UserSession createSession(User user, Tenant tenant, String token, String ipAddress, String userAgent) {
        // Deactivate existing sessions for this user-tenant combination (optional: for single session per tenant)
        // sessionRepository.deactivateAllUserSessions(user.getId());
        
        LocalDateTime expiresAt = LocalDateTime.now().plusSeconds(sessionExpirationInSeconds);
        
        UserSession session = new UserSession(
                token,
                user,
                tenant,
                ipAddress,
                userAgent,
                expiresAt
        );
        
        return sessionRepository.save(session);
    }
    
    public Optional<UserSession> getSessionByToken(String token) {
        return sessionRepository.findBySessionToken(token);
    }
    
    public boolean isSessionValid(String token) {
        Optional<UserSession> session = sessionRepository.findValidSessionByToken(token, LocalDateTime.now());
        return session.isPresent() && session.get().getIsActive();
    }
    
    public void invalidateSession(String token) {
        Optional<UserSession> session = sessionRepository.findBySessionToken(token);
        if (session.isPresent()) {
            UserSession userSession = session.get();
            userSession.setIsActive(false);
            sessionRepository.save(userSession);
        }
    }
    
    public void invalidateAllUserSessions(Long userId) {
        sessionRepository.deactivateAllUserSessions(userId);
    }
    
    public List<UserSession> getActiveUserSessions(Long userId) {
        return sessionRepository.findActiveSessionsByUserId(userId, LocalDateTime.now());
    }
    
    public List<UserSession> getUserSessionsForTenant(Long userId, Long tenantId) {
        return sessionRepository.findByUserIdAndTenantIdAndIsActiveTrue(userId, tenantId);
    }
    
    public void updateSessionActivity(String token) {
        sessionRepository.updateLastAccessed(token, LocalDateTime.now());
    }
    
    @Scheduled(fixedRate = 3600000) // Run every hour
    public void cleanupExpiredSessions() {
        sessionRepository.deactivateExpiredSessions(LocalDateTime.now());
    }
    
    public void extendSession(String token, int additionalSeconds) {
        Optional<UserSession> session = sessionRepository.findBySessionToken(token);
        if (session.isPresent() && session.get().getIsActive()) {
            UserSession userSession = session.get();
            userSession.setExpiresAt(userSession.getExpiresAt().plusSeconds(additionalSeconds));
            sessionRepository.save(userSession);
        }
    }
    
    public int getActiveSessionCount(Long userId) {
        return getActiveUserSessions(userId).size();
    }
}
