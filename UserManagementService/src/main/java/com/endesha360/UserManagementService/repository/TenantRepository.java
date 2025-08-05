package com.endesha360.UserManagementService.repository;

import com.endesha360.UserManagementService.entity.Tenant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TenantRepository extends JpaRepository<Tenant, Long> {
    
    Optional<Tenant> findByCode(String code);
    
    Optional<Tenant> findByName(String name);
    
    Boolean existsByCode(String code);
    
    Boolean existsByName(String name);
    
    List<Tenant> findByIsActiveTrue();
}
