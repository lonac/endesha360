package com.endesha360.SchoolManagementService.repository;

import com.endesha360.SchoolManagementService.entity.School;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SchoolRepository extends JpaRepository<School, Long> {
    
    Optional<School> findByRegistrationNumber(String registrationNumber);
    
    Optional<School> findByEmail(String email);
    
    Optional<School> findByTenantCode(String tenantCode);
    
    Optional<School> findByOwnerUserId(String ownerUserId);
    
    List<School> findByIsActive(Boolean isActive);
    
    List<School> findByIsApproved(Boolean isApproved);
    
    @Query("SELECT s FROM School s WHERE s.isActive = true AND s.isApproved = true")
    List<School> findActiveAndApprovedSchools();
    
    @Query("SELECT s FROM School s WHERE s.ownerUserId = :ownerUserId AND s.isActive = true")
    Optional<School> findActiveSchoolByOwner(@Param("ownerUserId") String ownerUserId);
    
    @Query("SELECT COUNT(s) FROM School s WHERE s.isActive = true")
    Long countActiveSchools();
    
    @Query("SELECT COUNT(s) FROM School s WHERE s.isApproved = false AND s.isActive = true")
    Long countPendingApprovalSchools();
    
    boolean existsByRegistrationNumber(String registrationNumber);
    
    boolean existsByEmail(String email);
    
    boolean existsByTenantCode(String tenantCode);
    
    boolean existsByOwnerUserId(String ownerUserId);
}
