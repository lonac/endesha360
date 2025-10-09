package com.endesha360.SchoolManagementService.controller;

import com.endesha360.SchoolManagementService.dto.*;
import com.endesha360.SchoolManagementService.service.SchoolMarketingProfileService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/schools/{schoolId}/marketing-profile")
@CrossOrigin(origins = "*")
public class SchoolMarketingProfileController {

    private final SchoolMarketingProfileService profileService;

    public SchoolMarketingProfileController(SchoolMarketingProfileService profileService) {
        this.profileService = profileService;
    }

    @GetMapping
    public SchoolMarketingProfileResponse getProfile(@PathVariable Long schoolId) {
        return profileService.getProfile(schoolId);
    }

    @PostMapping
    public SchoolMarketingProfileResponse saveProfile(@PathVariable Long schoolId,
                                                      @RequestBody SchoolMarketingProfileRequest request) {
        return profileService.saveProfile(schoolId, request);
    }

    @PatchMapping("/visibility")
    public SchoolMarketingProfileResponse toggleVisibility(
            @PathVariable Long schoolId,
            @RequestParam boolean isPublic) {
        return profileService.toggleVisibility(schoolId, isPublic);
    }
}
