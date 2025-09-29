package com.endesha360.UserManagementService.repository;

import com.endesha360.UserManagementService.entity.TenantUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TenantUserRepository extends JpaRepository<TenantUser, Long> {
    
    Optional<TenantUser> findByTenantIdAndUserId(Long tenantId, Long userId);
    
    List<TenantUser> findByTenantIdAndIsActiveTrue(Long tenantId);
    
    List<TenantUser> findByUserIdAndIsActiveTrue(Long userId);
    
    List<TenantUser> findByUserId(Long userId);
    
    @Query("SELECT tu FROM TenantUser tu JOIN tu.roles r WHERE tu.tenant.id = :tenantId AND r.name = :roleName AND tu.isActive = true")
    List<TenantUser> findByTenantIdAndRoleName(@Param("tenantId") Long tenantId, @Param("roleName") String roleName);
    
    @Query("SELECT tu FROM TenantUser tu WHERE tu.user.id = :userId AND tu.tenant.id = :tenantId AND tu.isActive = true")
    Optional<TenantUser> findActiveTenantUser(@Param("userId") Long userId, @Param("tenantId") Long tenantId);
    
    Boolean existsByTenantIdAndUserIdAndIsActiveTrue(Long tenantId, Long userId);
    
    @Query("SELECT COUNT(tu) FROM TenantUser tu JOIN tu.roles r WHERE tu.tenant.id = :tenantId AND r = :role AND tu.isActive = true")
    long countByTenantIdAndRoles(@Param("tenantId") Long tenantId, @Param("role") com.endesha360.UserManagementService.entity.Role role);
}
