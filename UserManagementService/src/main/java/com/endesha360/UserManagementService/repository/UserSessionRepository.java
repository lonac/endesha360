package com.endesha360.UserManagementService.repository;

import com.endesha360.UserManagementService.entity.UserSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserSessionRepository extends JpaRepository<UserSession, Long> {
    
    Optional<UserSession> findBySessionToken(String sessionToken);
    
    List<UserSession> findByUserIdAndIsActiveTrue(Long userId);
    
    List<UserSession> findByUserIdAndTenantIdAndIsActiveTrue(Long userId, Long tenantId);
    
    @Query("SELECT s FROM UserSession s WHERE s.user.id = :userId AND s.isActive = true AND s.expiresAt > :now")
    List<UserSession> findActiveSessionsByUserId(@Param("userId") Long userId, @Param("now") LocalDateTime now);
    
    @Query("SELECT s FROM UserSession s WHERE s.sessionToken = :token AND s.isActive = true AND s.expiresAt > :now")
    Optional<UserSession> findValidSessionByToken(@Param("token") String token, @Param("now") LocalDateTime now);
    
    @Modifying
    @Query("UPDATE UserSession s SET s.isActive = false WHERE s.user.id = :userId")
    void deactivateAllUserSessions(@Param("userId") Long userId);
    
    @Modifying
    @Query("UPDATE UserSession s SET s.isActive = false WHERE s.expiresAt < :now")
    void deactivateExpiredSessions(@Param("now") LocalDateTime now);
    
    @Modifying
    @Query("UPDATE UserSession s SET s.lastAccessed = :now WHERE s.sessionToken = :token")
    void updateLastAccessed(@Param("token") String token, @Param("now") LocalDateTime now);
}
