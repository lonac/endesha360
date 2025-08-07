package com.endesha360.SystemAdminServices.repository;

import com.endesha360.SystemAdminServices.entity.SystemAdmin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SystemAdminRepository extends JpaRepository<SystemAdmin, Long> {
    
    Optional<SystemAdmin> findByUsername(String username);
    
    Optional<SystemAdmin> findByEmail(String email);
    
    boolean existsByUsername(String username);
    
    boolean existsByEmail(String email);
    
    List<SystemAdmin> findByStatus(SystemAdmin.AdminStatus status);
    
    List<SystemAdmin> findByRole(SystemAdmin.AdminRole role);
    
    @Query("SELECT sa FROM SystemAdmin sa WHERE sa.status = :status AND sa.role = :role")
    List<SystemAdmin> findByStatusAndRole(@Param("status") SystemAdmin.AdminStatus status, 
                                         @Param("role") SystemAdmin.AdminRole role);
    
    @Query("SELECT sa FROM SystemAdmin sa WHERE sa.firstName LIKE %:searchTerm% OR sa.lastName LIKE %:searchTerm% OR sa.username LIKE %:searchTerm% OR sa.email LIKE %:searchTerm%")
    List<SystemAdmin> searchAdmins(@Param("searchTerm") String searchTerm);
}
