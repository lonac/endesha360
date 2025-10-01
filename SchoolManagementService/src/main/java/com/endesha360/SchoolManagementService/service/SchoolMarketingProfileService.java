package com.endesha360.SchoolManagementService.service;

import com.endesha360.SchoolManagementService.entity.School;
import com.endesha360.SchoolManagementService.entity.SchoolMarketingProfile;
import com.endesha360.SchoolManagementService.repository.SchoolMarketingProfileRepository;
import com.endesha360.SchoolManagementService.repository.SchoolRepository;
import com.endesha360.SchoolManagementService.dto.SchoolMarketingProfileRequest;
import com.endesha360.SchoolManagementService.dto.SchoolMarketingProfileResponse;
import com.endesha360.SchoolManagementService.exception.ResourceNotFoundException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class SchoolMarketingProfileService {
    
    private static final Logger logger = LoggerFactory.getLogger(SchoolMarketingProfileService.class);
    
    @Autowired
    private SchoolMarketingProfileRepository marketingProfileRepository;
    
    @Autowired
    private SchoolRepository schoolRepository;
    
    /**
     * Create or update marketing profile for a school
     */
    public SchoolMarketingProfileResponse createOrUpdateMarketingProfile(
            SchoolMarketingProfileRequest request, String ownerUserId) {
        
        logger.info("Creating/updating marketing profile for owner: {}", ownerUserId);
        
        // Find the school owned by this user
        Optional<School> schoolOpt = schoolRepository.findByOwnerUserId(ownerUserId);
        if (schoolOpt.isEmpty()) {
            throw new ResourceNotFoundException("No school found for this owner");
        }
        
        School school = schoolOpt.get();
        
        // Find existing profile or create new one
        Optional<SchoolMarketingProfile> existingProfileOpt = 
            marketingProfileRepository.findBySchoolId(school.getId());
        
        SchoolMarketingProfile profile;
        if (existingProfileOpt.isPresent()) {
            profile = existingProfileOpt.get();
            logger.info("Updating existing marketing profile for school: {}", school.getId());
        } else {
            profile = new SchoolMarketingProfile(school);
            logger.info("Creating new marketing profile for school: {}", school.getId());
        }
        
        // Map request to entity - convert List<String> to String[] for arrays
        if (request.getCoursesOffered() != null) {
            profile.setCoursesOffered(request.getCoursesOffered().toArray(new String[0]));
        }
        if (request.getLicenseTypes() != null) {
            profile.setLicenseTypes(request.getLicenseTypes().toArray(new String[0]));
        }
        if (request.getSpecializations() != null) {
            profile.setSpecializations(request.getSpecializations().toArray(new String[0]));
        }
        
        profile.setCourseDurationWeeks(request.getCourseDurationWeeks());
        profile.setFleetSize(request.getFleetSize());
        profile.setHasSimulators(request.getHasSimulators());
        profile.setSimulatorCount(request.getSimulatorCount());
        profile.setTheoryRoomsCount(request.getTheoryRoomsCount());
        profile.setPracticalVehicles(request.getPracticalVehicles());
        profile.setParkingSpaces(request.getParkingSpaces());
        profile.setHasOnlineTheory(request.getHasOnlineTheory());
        profile.setOperatingHours(request.getOperatingHours());
        profile.setPricingInfo(request.getPricingInfo());
        
        if (request.getPaymentMethods() != null) {
            profile.setPaymentMethods(request.getPaymentMethods().toArray(new String[0]));
        }
        
        profile.setCancellationPolicy(request.getCancellationPolicy());
        profile.setLogoUrl(request.getLogoUrl());
        
        if (request.getGalleryImages() != null) {
            profile.setGalleryImages(request.getGalleryImages().toArray(new String[0]));
        }
        
        profile.setAchievements(request.getAchievements());
        profile.setSuccessRate(request.getSuccessRate());
        profile.setTotalGraduates(request.getTotalGraduates());
        profile.setYearsInOperation(request.getYearsInOperation());
        profile.setSocialMedia(request.getSocialMedia());
        profile.setWhatsappNumber(request.getWhatsappNumber());
        profile.setSecondaryPhone(request.getSecondaryPhone());
        
        if (request.getKeywords() != null) {
            profile.setKeywords(request.getKeywords().toArray(new String[0]));
        }
        if (request.getTargetAudience() != null) {
            profile.setTargetAudience(request.getTargetAudience().toArray(new String[0]));
        }
        if (request.getUniqueSellingPoints() != null) {
            profile.setUniqueSellingPoints(request.getUniqueSellingPoints().toArray(new String[0]));
        }
        
        // Calculate profile completion percentage
        profile.setProfileCompletionPercentage(calculateCompletionPercentage(profile));
        
        // Save the profile
        SchoolMarketingProfile savedProfile = marketingProfileRepository.save(profile);
        
        return mapToResponse(savedProfile);
    }
    
    /**
     * Get marketing profile by owner user ID
     */
    public SchoolMarketingProfileResponse getMarketingProfileByOwner(String ownerUserId) {
        logger.info("Getting marketing profile for owner: {}", ownerUserId);
        
        // Find the school owned by this user
        Optional<School> schoolOpt = schoolRepository.findByOwnerUserId(ownerUserId);
        if (schoolOpt.isEmpty()) {
            throw new ResourceNotFoundException("No school found for this owner");
        }
        
        School school = schoolOpt.get();
        
        // Find the marketing profile
        Optional<SchoolMarketingProfile> profileOpt = 
            marketingProfileRepository.findBySchoolId(school.getId());
        
        if (profileOpt.isEmpty()) {
            // Return empty profile response instead of throwing exception
            logger.info("No marketing profile found for school {}, returning empty profile", school.getId());
            return createEmptyProfileResponse(school);
        }
        
        return mapToResponse(profileOpt.get());
    }
    
    /**
     * Toggle profile visibility
     */
    public SchoolMarketingProfileResponse toggleProfileVisibility(String ownerUserId, boolean isPublic) {
        logger.info("Toggling profile visibility for owner: {} to: {}", ownerUserId, isPublic);
        
        // Find the school owned by this user
        Optional<School> schoolOpt = schoolRepository.findByOwnerUserId(ownerUserId);
        if (schoolOpt.isEmpty()) {
            throw new ResourceNotFoundException("No school found for this owner");
        }
        
        School school = schoolOpt.get();
        
        // Find the marketing profile
        Optional<SchoolMarketingProfile> profileOpt = 
            marketingProfileRepository.findBySchoolId(school.getId());
        
        if (profileOpt.isEmpty()) {
            throw new ResourceNotFoundException("No marketing profile found for this school");
        }
        
        SchoolMarketingProfile profile = profileOpt.get();
        profile.setIsPublic(isPublic);
        
        SchoolMarketingProfile savedProfile = marketingProfileRepository.save(profile);
        return mapToResponse(savedProfile);
    }
    
    /**
     * Get public school profiles for directory listing
     */
    public List<SchoolMarketingProfileResponse> getPublicSchoolProfiles() {
        logger.info("Getting public school profiles for directory");
        
        List<SchoolMarketingProfile> publicProfiles = 
            marketingProfileRepository.findPublicApprovedSchoolProfiles();
        
        return publicProfiles.stream()
            .map(this::mapToResponse)
            .collect(java.util.stream.Collectors.toList());
    }
    
    /**
     * Search schools by criteria
     */
    public List<SchoolMarketingProfileResponse> searchSchools(String city, String courseType, String licenseType) {
        logger.info("Searching schools - City: {}, Course: {}, License: {}", city, courseType, licenseType);
        
        List<SchoolMarketingProfile> matchingProfiles = 
            marketingProfileRepository.searchSchoolProfiles(city, courseType, licenseType);
        
        return matchingProfiles.stream()
            .map(this::mapToResponse)
            .collect(java.util.stream.Collectors.toList());
    }
    
    /**
     * Get public school profile by school ID
     */
    public SchoolMarketingProfileResponse getPublicSchoolProfile(Long schoolId) {
        logger.info("Getting public school profile for school ID: {}", schoolId);
        
        Optional<SchoolMarketingProfile> profileOpt = 
            marketingProfileRepository.findBySchoolId(schoolId);
        
        if (profileOpt.isEmpty()) {
            throw new ResourceNotFoundException("School marketing profile not found");
        }
        
        SchoolMarketingProfile profile = profileOpt.get();
        
        // Check if profile is public and school is approved
        if (!profile.getIsPublic() || !profile.getSchool().getIsApproved()) {
            throw new ResourceNotFoundException("School marketing profile not publicly available");
        }
        
        return mapToResponse(profile);
    }
    
    /**
     * Calculate profile completion percentage
     */
    private Integer calculateCompletionPercentage(SchoolMarketingProfile profile) {
        int totalFields = 10; // Based on important fields from frontend
        int completedFields = 0;
        
        if (profile.getCoursesOffered() != null && profile.getCoursesOffered().length > 0) completedFields++;
        if (profile.getLicenseTypes() != null && profile.getLicenseTypes().length > 0) completedFields++;
        if (profile.getFleetSize() != null && profile.getFleetSize() > 0) completedFields++;
        if (profile.getPricingInfo() != null && !profile.getPricingInfo().trim().isEmpty()) completedFields++;
        if (profile.getAchievements() != null && !profile.getAchievements().trim().isEmpty()) completedFields++;
        if (profile.getSuccessRate() != null && profile.getSuccessRate().compareTo(BigDecimal.ZERO) > 0) completedFields++;
        if (profile.getYearsInOperation() != null && profile.getYearsInOperation() > 0) completedFields++;
        if (profile.getOperatingHours() != null && !profile.getOperatingHours().isEmpty()) completedFields++;
        if (profile.getPaymentMethods() != null && profile.getPaymentMethods().length > 0) completedFields++;
        if (profile.getKeywords() != null && profile.getKeywords().length > 0) completedFields++;
        
        return Math.round((completedFields * 100.0f) / totalFields);
    }
    
    /**
     * Map entity to response DTO - convert String[] to List<String>
     */
    private SchoolMarketingProfileResponse mapToResponse(SchoolMarketingProfile profile) {
        SchoolMarketingProfileResponse response = new SchoolMarketingProfileResponse();
        
        response.setId(profile.getId());
        response.setSchoolId(profile.getSchoolId());
        // Get school name from the relationship
        response.setSchoolName(profile.getSchool() != null ? profile.getSchool().getName() : null);
        
        // Convert String[] to List<String> for arrays
        response.setCoursesOffered(profile.getCoursesOffered() != null ? 
            Arrays.asList(profile.getCoursesOffered()) : null);
        response.setLicenseTypes(profile.getLicenseTypes() != null ? 
            Arrays.asList(profile.getLicenseTypes()) : null);
        response.setSpecializations(profile.getSpecializations() != null ? 
            Arrays.asList(profile.getSpecializations()) : null);
            
        response.setCourseDurationWeeks(profile.getCourseDurationWeeks());
        response.setFleetSize(profile.getFleetSize());
        response.setHasSimulators(profile.getHasSimulators());
        response.setSimulatorCount(profile.getSimulatorCount());
        response.setTheoryRoomsCount(profile.getTheoryRoomsCount());
        response.setPracticalVehicles(profile.getPracticalVehicles());
        response.setParkingSpaces(profile.getParkingSpaces());
        response.setHasOnlineTheory(profile.getHasOnlineTheory());
        response.setOperatingHours(profile.getOperatingHours());
        response.setPricingInfo(profile.getPricingInfo());
        
        response.setPaymentMethods(profile.getPaymentMethods() != null ? 
            Arrays.asList(profile.getPaymentMethods()) : null);
            
        response.setCancellationPolicy(profile.getCancellationPolicy());
        response.setLogoUrl(profile.getLogoUrl());
        
        response.setGalleryImages(profile.getGalleryImages() != null ? 
            Arrays.asList(profile.getGalleryImages()) : null);
            
        response.setAchievements(profile.getAchievements());
        response.setSuccessRate(profile.getSuccessRate());
        response.setTotalGraduates(profile.getTotalGraduates());
        response.setYearsInOperation(profile.getYearsInOperation());
        response.setSocialMedia(profile.getSocialMedia());
        response.setWhatsappNumber(profile.getWhatsappNumber());
        response.setSecondaryPhone(profile.getSecondaryPhone());
        
        response.setKeywords(profile.getKeywords() != null ? 
            Arrays.asList(profile.getKeywords()) : null);
        response.setTargetAudience(profile.getTargetAudience() != null ? 
            Arrays.asList(profile.getTargetAudience()) : null);
        response.setUniqueSellingPoints(profile.getUniqueSellingPoints() != null ? 
            Arrays.asList(profile.getUniqueSellingPoints()) : null);
            
        response.setIsPublic(profile.getIsPublic());
        response.setProfileCompletionPercentage(profile.getProfileCompletionPercentage());
        response.setCreatedAt(profile.getCreatedAt());
        response.setUpdatedAt(profile.getUpdatedAt());
        
        return response;
    }
    
    /**
     * Create empty profile response for schools without marketing profile
     */
    private SchoolMarketingProfileResponse createEmptyProfileResponse(School school) {
        SchoolMarketingProfileResponse response = new SchoolMarketingProfileResponse();
        
        // Set basic school information
        response.setSchoolId(school.getId());
        response.setSchoolName(school.getName());
        
        // Set default values for new profile
        response.setIsPublic(false);
        response.setProfileCompletionPercentage(0);
        
        return response;
    }
}
