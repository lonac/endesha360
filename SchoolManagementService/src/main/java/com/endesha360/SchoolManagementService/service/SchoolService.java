package com.endesha360.SchoolManagementService.service;

import com.endesha360.SchoolManagementService.client.UserManagementClient;
import com.endesha360.SchoolManagementService.dto.SchoolRegistrationRequest;
import com.endesha360.SchoolManagementService.dto.SchoolRegistrationResponse;
import com.endesha360.SchoolManagementService.dto.TenantCreationRequest;
import com.endesha360.SchoolManagementService.dto.TenantResponse;
import com.endesha360.SchoolManagementService.entity.School;
import com.endesha360.SchoolManagementService.exception.SchoolAlreadyExistsException;
import com.endesha360.SchoolManagementService.exception.SchoolNotFoundException;
import com.endesha360.SchoolManagementService.exception.UnauthorizedAccessException;
import com.endesha360.SchoolManagementService.repository.SchoolRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@Transactional
public class SchoolService {
    // Helper to map School entities to SchoolDTOs with approvalStatus
    public List<com.endesha360.SchoolManagementService.dto.SchoolDTO> mapSchoolsToDTOs(List<School> schools) {
        List<com.endesha360.SchoolManagementService.dto.SchoolDTO> dtos = new java.util.ArrayList<>();
        for (School school : schools) {
            com.endesha360.SchoolManagementService.dto.SchoolDTO dto = new com.endesha360.SchoolManagementService.dto.SchoolDTO();
            dto.setId(school.getId());
            dto.setName(school.getName());
            dto.setDescription(school.getDescription());
            dto.setAddress(school.getAddress());
            dto.setCity(school.getCity());
            dto.setRegion(school.getRegion());
            dto.setPostalCode(school.getPostalCode());
            dto.setCountry(school.getCountry());
            dto.setPhoneNumber(school.getPhone());
            dto.setEmail(school.getEmail());
            dto.setWebsite(school.getWebsite());
            dto.setLicenseNumber(null); // Set if available
            dto.setTenantCode(school.getTenantCode());
            dto.setOwnerId(null); // Set if available
            dto.setOwnerUserId(school.getOwnerUserId());
            dto.setOwnerName(null); // Set if available
            dto.setOwnerEmail(null); // Set if available
            // Set approvalStatus
            if (Boolean.TRUE.equals(school.getIsApproved()) && Boolean.TRUE.equals(school.getIsActive())) {
                dto.setApprovalStatus("APPROVED");
            } else if (Boolean.FALSE.equals(school.getIsApproved()) && Boolean.FALSE.equals(school.getIsActive())) {
                dto.setApprovalStatus("REJECTED");
            } else {
                dto.setApprovalStatus("PENDING");
            }
            dtos.add(dto);
        }
        return dtos;
    }
    /**
     * Get all approved schools
     */
    public List<School> getApprovedSchools() {
        return schoolRepository.findByIsApproved(true);
    }

    /**
     * Get all rejected schools (not approved and not active)
     */
    public List<School> getRejectedSchools() {
        // Assuming rejected means isApproved = false and isActive = false
        return schoolRepository.findAll().stream()
            .filter(s -> Boolean.FALSE.equals(s.getIsApproved()) && Boolean.FALSE.equals(s.getIsActive()))
            .toList();
    }
    
    private static final Logger logger = LoggerFactory.getLogger(SchoolService.class);
    
    @Autowired
    private SchoolRepository schoolRepository;
    
    @Autowired
    private UserManagementClient userManagementClient;
    
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
        
        logger.info("Starting school approval process: schoolId={}, tenantCode={}", schoolId, school.getTenantCode());
        
        try {
            // Step 1: Check if tenant already exists in UserManagementService
            ResponseEntity<Boolean> existsResponse = userManagementClient.tenantExists(school.getTenantCode());
            boolean tenantExists = existsResponse.getBody() != null && existsResponse.getBody();
            
            if (!tenantExists) {
                // Step 2: Create tenant in UserManagementService using Feign client
                String tenantDescription = "Tenant for " + school.getName() + " driving school";
                TenantCreationRequest tenantRequest = new TenantCreationRequest(
                    school.getName(), 
                    school.getTenantCode(), 
                    tenantDescription
                );
                
                ResponseEntity<TenantResponse> createResponse = userManagementClient.createTenant(tenantRequest);
                
                if (!createResponse.getStatusCode().is2xxSuccessful()) {
                    throw new RuntimeException("Failed to create tenant in UserManagementService: " + school.getTenantCode() + 
                                             " - HTTP Status: " + createResponse.getStatusCode());
                }
                
                logger.info("Tenant created successfully in UserManagementService: {}", school.getTenantCode());
            } else {
                logger.info("Tenant already exists in UserManagementService: {}", school.getTenantCode());
                
                // Ensure tenant is activated
                ResponseEntity<String> activateResponse = userManagementClient.activateTenant(school.getTenantCode());
                if (!activateResponse.getStatusCode().is2xxSuccessful()) {
                    logger.warn("Failed to activate existing tenant: {} - HTTP Status: {}", 
                               school.getTenantCode(), activateResponse.getStatusCode());
                }
            }
            
            // Step 3: Approve the school
            school.setIsApproved(true);
            schoolRepository.save(school);
            
            logger.info("School approved successfully: schoolId={}, tenantCode={}", schoolId, school.getTenantCode());
            
        } catch (Exception e) {
            logger.error("Error during school approval: schoolId={}, tenantCode={}, error={}", 
                        schoolId, school.getTenantCode(), e.getMessage(), e);
            
            // Rollback: ensure school remains unapproved if tenant creation failed
            school.setIsApproved(false);
            schoolRepository.save(school);
            
            throw new RuntimeException("School approval failed: " + e.getMessage(), e);
        }
    }
    
    /**
     * Get all schools pending approval
     */
    public List<School> getPendingApprovalSchools() {
        return schoolRepository.findPendingApprovalSchools();
    }
    
        /**
     * Get schools that are active and approved
     */
    public List<School> getActiveSchools() {
        return schoolRepository.findActiveAndApprovedSchools();
    }

    /**
     * Get all schools regardless of status
     */
    public List<School> getAllSchools() {
        return schoolRepository.findAll();
    }

    /**
     * Get school by ID
     */
    public Optional<School> getSchoolById(Long schoolId) {
        return schoolRepository.findById(schoolId);
    }

    /**
     * Reject a school
     */
    public void rejectSchool(Long schoolId, String rejectionReason) {
        School school = schoolRepository.findById(schoolId)
                .orElseThrow(() -> new SchoolNotFoundException("School not found with id: " + schoolId));
        
        logger.info("Starting school rejection process: schoolId={}, tenantCode={}", schoolId, school.getTenantCode());
        
        try {
            // Step 1: Deactivate tenant in UserManagementService if it exists
            ResponseEntity<Boolean> existsResponse = userManagementClient.tenantExists(school.getTenantCode());
            boolean tenantExists = existsResponse.getBody() != null && existsResponse.getBody();
            
            if (tenantExists) {
                ResponseEntity<String> deactivateResponse = userManagementClient.deactivateTenant(school.getTenantCode());
                
                if (!deactivateResponse.getStatusCode().is2xxSuccessful()) {
                    logger.warn("Failed to deactivate tenant in UserManagementService: {} - HTTP Status: {}", 
                               school.getTenantCode(), deactivateResponse.getStatusCode());
                    // Continue with school rejection even if tenant deactivation fails
                } else {
                    logger.info("Tenant deactivated in UserManagementService: {}", school.getTenantCode());
                }
            } else {
                logger.info("Tenant does not exist in UserManagementService: {}", school.getTenantCode());
            }
            
            // Step 2: Reject the school
            school.setIsApproved(false);
            school.setIsActive(false);
            if (rejectionReason != null && !rejectionReason.isEmpty()) {
                school.setRejectionReason(rejectionReason);
            }
            schoolRepository.save(school);
            
            logger.info("School rejected successfully: schoolId={}, tenantCode={}, reason={}", 
                       schoolId, school.getTenantCode(), rejectionReason);
            
        } catch (Exception e) {
            logger.error("Error during school rejection: schoolId={}, tenantCode={}, error={}", 
                        schoolId, school.getTenantCode(), e.getMessage(), e);
            
            // Continue with school rejection even if tenant deactivation fails
            school.setIsApproved(false);
            school.setIsActive(false);
            if (rejectionReason != null && !rejectionReason.isEmpty()) {
                school.setRejectionReason(rejectionReason);
            }
            schoolRepository.save(school);
            
            logger.info("School rejected (with tenant deactivation warning): {} - Reason: {}", schoolId, rejectionReason);
        }
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
    long rejectedSchools = schoolRepository.countRejectedSchools();
    return new SchoolStats(totalSchools, activeSchools, pendingApproval, rejectedSchools);
    }
    
    /**
     * School statistics DTO
     */
    public static class SchoolStats {
        private long totalSchools;
        private long activeSchools;
        private long pendingApproval;
        private long rejectedSchools;

        public SchoolStats(long totalSchools, long activeSchools, long pendingApproval, long rejectedSchools) {
            this.totalSchools = totalSchools;
            this.activeSchools = activeSchools;
            this.pendingApproval = pendingApproval;
            this.rejectedSchools = rejectedSchools;
        }

        // Getters
        public long getTotalSchools() { return totalSchools; }
        public long getActiveSchools() { return activeSchools; }
        public long getPendingApproval() { return pendingApproval; }
        public long getRejectedSchools() { return rejectedSchools; }
    }
}
