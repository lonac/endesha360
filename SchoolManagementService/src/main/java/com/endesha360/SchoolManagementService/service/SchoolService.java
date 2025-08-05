package com.endesha360.SchoolManagementService.service;

import com.endesha360.SchoolManagementService.dto.SchoolRegistrationRequest;
import com.endesha360.SchoolManagementService.dto.SchoolRegistrationResponse;
import com.endesha360.SchoolManagementService.entity.School;
import com.endesha360.SchoolManagementService.exception.SchoolAlreadyExistsException;
import com.endesha360.SchoolManagementService.exception.SchoolNotFoundException;
import com.endesha360.SchoolManagementService.exception.UnauthorizedAccessException;
import com.endesha360.SchoolManagementService.repository.SchoolRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@Transactional
public class SchoolService {
    
    private static final Logger logger = LoggerFactory.getLogger(SchoolService.class);
    
    @Autowired
    private SchoolRepository schoolRepository;
    
    /**
     * Register a new school - Step 2 of the registration flow
     * This method is called after the school owner has already registered personally in UserManagementService
     */
    public SchoolRegistrationResponse registerSchool(SchoolRegistrationRequest request, String ownerUserId) {
        logger.info("Starting school registration for owner: {}", ownerUserId);
        
        // Validate that the user doesn't already have a school
        if (schoolRepository.existsByOwnerUserId(ownerUserId)) {
            throw new SchoolAlreadyExistsException("User already has a registered school");
        }
        
        // Validate unique constraints
        if (schoolRepository.existsByRegistrationNumber(request.getRegistrationNumber())) {
            throw new SchoolAlreadyExistsException("School with registration number " + request.getRegistrationNumber() + " already exists");
        }
        
        if (schoolRepository.existsByEmail(request.getEmail())) {
            throw new SchoolAlreadyExistsException("School with email " + request.getEmail() + " already exists");
        }
        
        // Generate unique tenant code for the school
        String tenantCode = generateUniqueTenantCode(request.getName());
        
        // Create school entity
        School school = new School(
            request.getName(),
            request.getRegistrationNumber(),
            request.getEmail(),
            request.getPhone(),
            request.getAddress(),
            tenantCode,
            ownerUserId
        );
        
        // Set optional fields
        school.setCity(request.getCity());
        school.setRegion(request.getRegion());
        school.setPostalCode(request.getPostalCode());
        school.setCountry(request.getCountry());
        school.setWebsite(request.getWebsite());
        school.setDescription(request.getDescription());
        
        // School starts as active but not approved
        school.setIsActive(true);
        school.setIsApproved(false);
        
        // Save school
        School savedSchool = schoolRepository.save(school);
        logger.info("School registered successfully with ID: {} and tenant code: {}", savedSchool.getId(), tenantCode);
        
        // Create response
        SchoolRegistrationResponse response = new SchoolRegistrationResponse();
        response.setId(savedSchool.getId());
        response.setName(savedSchool.getName());
        response.setRegistrationNumber(savedSchool.getRegistrationNumber());
        response.setEmail(savedSchool.getEmail());
        response.setPhone(savedSchool.getPhone());
        response.setAddress(savedSchool.getAddress());
        response.setCity(savedSchool.getCity());
        response.setRegion(savedSchool.getRegion());
        response.setTenantCode(savedSchool.getTenantCode());
        response.setIsActive(savedSchool.getIsActive());
        response.setIsApproved(savedSchool.getIsApproved());
        response.setCreatedAt(savedSchool.getCreatedAt());
        response.setMessage("School registered successfully. Waiting for admin approval.");
        
        return response;
    }
    
    /**
     * Get school by owner user ID
     */
    public Optional<School> getSchoolByOwner(String ownerUserId) {
        return schoolRepository.findByOwnerUserId(ownerUserId);
    }
    
    /**
     * Get school by tenant code
     */
    public Optional<School> getSchoolByTenantCode(String tenantCode) {
        return schoolRepository.findByTenantCode(tenantCode);
    }
    
    /**
     * Approve a school (admin only)
     */
    public void approveSchool(Long schoolId) {
        School school = schoolRepository.findById(schoolId)
                .orElseThrow(() -> new SchoolNotFoundException("School not found with ID: " + schoolId));
        
        school.setIsApproved(true);
        schoolRepository.save(school);
        logger.info("School approved: {}", schoolId);
    }
    
    /**
     * Get all schools pending approval
     */
    public List<School> getPendingApprovalSchools() {
        return schoolRepository.findByIsApproved(false);
    }
    
    /**
     * Get all active and approved schools
     */
    public List<School> getActiveSchools() {
        return schoolRepository.findActiveAndApprovedSchools();
    }
    
    /**
     * Update school information (owner only)
     */
    public School updateSchool(Long schoolId, SchoolRegistrationRequest request, String ownerUserId) {
        School school = schoolRepository.findById(schoolId)
                .orElseThrow(() -> new SchoolNotFoundException("School not found with ID: " + schoolId));
        
        // Verify ownership
        if (!school.getOwnerUserId().equals(ownerUserId)) {
            throw new UnauthorizedAccessException("You are not authorized to update this school");
        }
        
        // Update fields
        school.setName(request.getName());
        school.setEmail(request.getEmail());
        school.setPhone(request.getPhone());
        school.setAddress(request.getAddress());
        school.setCity(request.getCity());
        school.setRegion(request.getRegion());
        school.setPostalCode(request.getPostalCode());
        school.setCountry(request.getCountry());
        school.setWebsite(request.getWebsite());
        school.setDescription(request.getDescription());
        
        return schoolRepository.save(school);
    }
    
    /**
     * Generate unique tenant code for school
     */
    private String generateUniqueTenantCode(String schoolName) {
        // Create base code from school name
        String baseCode = schoolName.replaceAll("[^a-zA-Z0-9]", "")
                                  .toUpperCase()
                                  .substring(0, Math.min(schoolName.length(), 8));
        
        String tenantCode = baseCode;
        int counter = 1;
        
        // Ensure uniqueness
        while (schoolRepository.existsByTenantCode(tenantCode)) {
            tenantCode = baseCode + counter;
            counter++;
        }
        
        return tenantCode;
    }
    
    /**
     * Get school statistics
     */
    public SchoolStats getSchoolStats() {
        long totalSchools = schoolRepository.count();
        long activeSchools = schoolRepository.countActiveSchools();
        long pendingApproval = schoolRepository.countPendingApprovalSchools();
        
        return new SchoolStats(totalSchools, activeSchools, pendingApproval);
    }
    
    /**
     * School statistics DTO
     */
    public static class SchoolStats {
        private long totalSchools;
        private long activeSchools;
        private long pendingApproval;
        
        public SchoolStats(long totalSchools, long activeSchools, long pendingApproval) {
            this.totalSchools = totalSchools;
            this.activeSchools = activeSchools;
            this.pendingApproval = pendingApproval;
        }
        
        // Getters
        public long getTotalSchools() { return totalSchools; }
        public long getActiveSchools() { return activeSchools; }
        public long getPendingApproval() { return pendingApproval; }
    }
}
