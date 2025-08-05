package com.endesha360.UserManagementService.repository;

import com.endesha360.UserManagementService.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {
    
    Optional<Role> findByName(String name);
    
    Boolean existsByName(String name);
    
    List<Role> findByIsSystemRoleTrue();
    
    List<Role> findByIsSystemRoleFalse();
}
