package com.endesha360.SchoolManagementService.service;

import com.endesha360.SchoolManagementService.dto.*;
import com.endesha360.SchoolManagementService.entity.*;
import com.endesha360.SchoolManagementService.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class SchoolMarketingProfileService {

    private final SchoolRepository schoolRepository;
    private final SchoolMarketingProfileRepository profileRepository;

    public SchoolMarketingProfileService(SchoolRepository schoolRepository,
                                         SchoolMarketingProfileRepository profileRepository) {
        this.schoolRepository = schoolRepository;
        this.profileRepository = profileRepository;
    }

    public SchoolMarketingProfileResponse getProfile(Long schoolId) {
        var profile = profileRepository.findBySchoolId(schoolId)
                .orElseThrow(() -> new RuntimeException("Marketing profile not found"));
        return toResponse(profile);
    }

    public SchoolMarketingProfileResponse saveProfile(Long schoolId, SchoolMarketingProfileRequest req) {
        School school = schoolRepository.findById(schoolId)
                .orElseThrow(() -> new RuntimeException("School not found"));

        SchoolMarketingProfile profile = profileRepository.findBySchoolId(schoolId)
                .orElse(new SchoolMarketingProfile());
        profile.setSchool(school);

        // Copy fields
        profile.setCoursesOffered(req.getCoursesOffered());
        profile.setLicenseTypes(req.getLicenseTypes());
        profile.setSpecializations(req.getSpecializations());
        profile.setCourseDurationWeeks(req.getCourseDurationWeeks());

        profile.setFleetSize(req.getFleetSize());
        profile.setHasSimulators(req.getHasSimulators());
        profile.setSimulatorCount(req.getSimulatorCount());
        profile.setTheoryRoomsCount(req.getTheoryRoomsCount());
        profile.setParkingSpaces(req.getParkingSpaces());
        profile.setHasOnlineTheory(req.getHasOnlineTheory());
        profile.setPracticalVehicles(req.getPracticalVehicles());

        profile.setPricingInfo(req.getPricingInfo());
        profile.setPaymentMethods(req.getPaymentMethods());
        profile.setCancellationPolicy(req.getCancellationPolicy());
        profile.setOperatingHours(req.getOperatingHours());

        profile.setLogoUrl(req.getLogoUrl());
        profile.setGalleryImages(req.getGalleryImages());
        profile.setAchievements(req.getAchievements());
        profile.setSuccessRate(req.getSuccessRate());
        profile.setTotalGraduates(req.getTotalGraduates());
        profile.setYearsInOperation(req.getYearsInOperation());
        profile.setKeywords(req.getKeywords());
        profile.setTargetAudience(req.getTargetAudience());
        profile.setUniqueSellingPoints(req.getUniqueSellingPoints());

        profile.setWhatsappNumber(req.getWhatsappNumber());
        profile.setSecondaryPhone(req.getSecondaryPhone());
        profile.setPreferredContactMethods(req.getPreferredContactMethods());
        profile.setSocialMedia(req.getSocialMedia());

        profileRepository.save(profile);
        return toResponse(profile);
    }

    public SchoolMarketingProfileResponse toggleVisibility(Long schoolId, boolean isPublic) {
        var profile = profileRepository.findBySchoolId(schoolId)
                .orElseThrow(() -> new RuntimeException("Profile not found"));
        profile.setPublic(isPublic);
        profileRepository.save(profile);
        return toResponse(profile);
    }

    private SchoolMarketingProfileResponse toResponse(SchoolMarketingProfile p) {
        var res = new SchoolMarketingProfileResponse();
        res.setId(p.getId());
        res.setSchoolId(p.getSchool().getId());
        res.setIsPublic(p.getPublic());
        
        // Courses & Services
        res.setCoursesOffered(p.getCoursesOffered());
        res.setLicenseTypes(p.getLicenseTypes());
        res.setSpecializations(p.getSpecializations());
        res.setCourseDurationWeeks(p.getCourseDurationWeeks());
        
        // Facilities
        res.setFleetSize(p.getFleetSize());
        res.setHasSimulators(p.getHasSimulators());
        res.setSimulatorCount(p.getSimulatorCount());
        res.setTheoryRoomsCount(p.getTheoryRoomsCount());
        res.setParkingSpaces(p.getParkingSpaces());
        res.setHasOnlineTheory(p.getHasOnlineTheory());
        res.setPracticalVehicles(p.getPracticalVehicles());
        
        // Business Info
        res.setPricingInfo(p.getPricingInfo());
        res.setPaymentMethods(p.getPaymentMethods());
        res.setCancellationPolicy(p.getCancellationPolicy());
        res.setOperatingHours(p.getOperatingHours());
        
        // Marketing Content
        res.setLogoUrl(p.getLogoUrl());
        res.setGalleryImages(p.getGalleryImages());
        res.setAchievements(p.getAchievements());
        res.setSuccessRate(p.getSuccessRate());
        res.setTotalGraduates(p.getTotalGraduates());
        res.setYearsInOperation(p.getYearsInOperation());
        res.setKeywords(p.getKeywords());
        res.setTargetAudience(p.getTargetAudience());
        res.setUniqueSellingPoints(p.getUniqueSellingPoints());
        
        // Contact & Social
        res.setWhatsappNumber(p.getWhatsappNumber());
        res.setSecondaryPhone(p.getSecondaryPhone());
        res.setPreferredContactMethods(p.getPreferredContactMethods());
        res.setSocialMedia(p.getSocialMedia());
        
        // Meta
        res.setCreatedAt(p.getCreatedAt());
        res.setUpdatedAt(p.getUpdatedAt());
        res.setProfileCompletionPercentage(calculateCompletion(p));
        return res;
    }

    private int calculateCompletion(SchoolMarketingProfile p) {
        int total = 10;
        int done = 0;
        if (p.getCoursesOffered() != null && !p.getCoursesOffered().isEmpty()) done++;
        if (p.getLicenseTypes() != null && !p.getLicenseTypes().isEmpty()) done++;
        if (p.getFleetSize() != null) done++;
        if (p.getPricingInfo() != null && !p.getPricingInfo().isEmpty()) done++;
        if (p.getAchievements() != null && !p.getAchievements().isEmpty()) done++;
        if (p.getSuccessRate() != null) done++;
        if (p.getYearsInOperation() != null) done++;
        if (p.getOperatingHours() != null && !p.getOperatingHours().isEmpty()) done++;
        if (p.getPaymentMethods() != null && !p.getPaymentMethods().isEmpty()) done++;
        if (p.getKeywords() != null && !p.getKeywords().isEmpty()) done++;
        return (int) Math.round((done / (double) total) * 100);
    }

    // Get all public profiles for directory
    public java.util.List<SchoolMarketingProfileResponse> getPublicProfiles() {
        return profileRepository.findByIsPublic(true).stream()
                .map(this::toResponse)
                .collect(java.util.stream.Collectors.toList());
    }
}
