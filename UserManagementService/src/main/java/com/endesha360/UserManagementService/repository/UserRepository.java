package com.endesha360.UserManagementService.repository;

import com.endesha360.UserManagementService.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    Optional<User> findByUsername(String username);
    
    Optional<User> findByEmail(String email);
    
    Optional<User> findByUsernameOrEmail(String username, String email);
    
    Boolean existsByUsername(String username);
    
    Boolean existsByEmail(String email);
    
    List<User> findByIsActiveTrue();
    
    @Query("SELECT u FROM User u JOIN u.tenantUsers tu WHERE tu.tenant.id = :tenantId AND tu.isActive = true")
    List<User> findActiveUsersByTenantId(@Param("tenantId") Long tenantId);
    
    @Query("SELECT u FROM User u JOIN u.tenantUsers tu JOIN tu.roles r WHERE tu.tenant.id = :tenantId AND r.name = :roleName AND tu.isActive = true")
    List<User> findUsersByTenantIdAndRole(@Param("tenantId") Long tenantId, @Param("roleName") String roleName);
    
    @Query("SELECT COUNT(u) FROM User u JOIN u.tenantUsers tu JOIN tu.roles r WHERE r.name = :roleName AND tu.isActive = true")
    Long countUsersByRole(@Param("roleName") String roleName);
}
