package com.endesha360.SystemAdminServices.service;

import com.endesha360.SystemAdminServices.dto.LoginRequest;
import com.endesha360.SystemAdminServices.dto.SystemAdminResponse;
import com.endesha360.SystemAdminServices.entity.SystemAdmin;
import com.endesha360.SystemAdminServices.repository.SystemAdminRepository;
import com.endesha360.SystemAdminServices.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class SystemAdminService {

    @Autowired
    private SystemAdminRepository systemAdminRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    public Map<String, Object> authenticate(LoginRequest loginRequest) {
        Optional<SystemAdmin> adminOpt = systemAdminRepository.findByUsername(loginRequest.getUsernameOrEmail());
        
        if (adminOpt.isEmpty()) {
            adminOpt = systemAdminRepository.findByEmail(loginRequest.getUsernameOrEmail());
        }

        if (adminOpt.isEmpty()) {
            throw new RuntimeException("Invalid credentials");
        }

        SystemAdmin admin = adminOpt.get();
        
        if (admin.getStatus() != SystemAdmin.AdminStatus.ACTIVE) {
            throw new RuntimeException("Account is not active");
        }

        if (!passwordEncoder.matches(loginRequest.getPassword(), admin.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        // Update last login
        admin.setLastLogin(LocalDateTime.now());
        systemAdminRepository.save(admin);

        // Generate JWT token
        String token = jwtUtil.generateToken(admin.getUsername(), admin.getId(), admin.getRole().toString());

        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("admin", new SystemAdminResponse(admin));
        response.put("message", "Login successful");

        return response;
    }

    public SystemAdminResponse createAdmin(SystemAdmin admin, String createdBy) {
        if (systemAdminRepository.existsByUsername(admin.getUsername())) {
            throw new RuntimeException("Username already exists");
        }

        if (systemAdminRepository.existsByEmail(admin.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        admin.setPassword(passwordEncoder.encode(admin.getPassword()));
        admin.setCreatedBy(createdBy);
        admin.setStatus(SystemAdmin.AdminStatus.ACTIVE);

        SystemAdmin savedAdmin = systemAdminRepository.save(admin);
        return new SystemAdminResponse(savedAdmin);
    }

    public List<SystemAdminResponse> getAllAdmins() {
        return systemAdminRepository.findAll()
                .stream()
                .map(SystemAdminResponse::new)
                .collect(Collectors.toList());
    }

    public List<SystemAdminResponse> getAdminsByStatus(SystemAdmin.AdminStatus status) {
        return systemAdminRepository.findByStatus(status)
                .stream()
                .map(SystemAdminResponse::new)
                .collect(Collectors.toList());
    }

    public List<SystemAdminResponse> getAdminsByRole(SystemAdmin.AdminRole role) {
        return systemAdminRepository.findByRole(role)
                .stream()
                .map(SystemAdminResponse::new)
                .collect(Collectors.toList());
    }

    public SystemAdminResponse getAdminById(Long id) {
        SystemAdmin admin = systemAdminRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Admin not found"));
        return new SystemAdminResponse(admin);
    }

    public SystemAdminResponse updateAdminStatus(Long adminId, SystemAdmin.AdminStatus status, String updatedBy) {
        SystemAdmin admin = systemAdminRepository.findById(adminId)
                .orElseThrow(() -> new RuntimeException("Admin not found"));
        
        admin.setStatus(status);
        SystemAdmin updatedAdmin = systemAdminRepository.save(admin);
        return new SystemAdminResponse(updatedAdmin);
    }

    public void deleteAdmin(Long adminId) {
        if (!systemAdminRepository.existsById(adminId)) {
            throw new RuntimeException("Admin not found");
        }
        systemAdminRepository.deleteById(adminId);
    }

    public List<SystemAdminResponse> searchAdmins(String searchTerm) {
        return systemAdminRepository.searchAdmins(searchTerm)
                .stream()
                .map(SystemAdminResponse::new)
                .collect(Collectors.toList());
    }
}
