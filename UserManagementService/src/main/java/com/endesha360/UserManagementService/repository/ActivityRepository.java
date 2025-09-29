package com.endesha360.UserManagementService.repository;

import com.endesha360.UserManagementService.entity.Activity;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ActivityRepository extends JpaRepository<Activity, Long> {
    
    /**
     * Find activities by tenant code, ordered by creation date (most recent first)
     */
    List<Activity> findByTenantCodeOrderByCreatedAtDesc(String tenantCode, Pageable pageable);
    
    /**
     * Find activities by tenant code and activity type
     */
    List<Activity> findByTenantCodeAndActivityTypeOrderByCreatedAtDesc(String tenantCode, String activityType, Pageable pageable);
    
    /**
     * Find activities by tenant code within a date range
     */
    @Query("SELECT a FROM Activity a WHERE a.tenantCode = :tenantCode AND a.createdAt >= :startDate AND a.createdAt <= :endDate ORDER BY a.createdAt DESC")
    List<Activity> findByTenantCodeAndDateRange(@Param("tenantCode") String tenantCode, 
                                               @Param("startDate") LocalDateTime startDate, 
                                               @Param("endDate") LocalDateTime endDate, 
                                               Pageable pageable);
    
    /**
     * Count activities by tenant code
     */
    long countByTenantCode(String tenantCode);
    
    /**
     * Count activities by tenant code and activity type
     */
    long countByTenantCodeAndActivityType(String tenantCode, String activityType);
}
