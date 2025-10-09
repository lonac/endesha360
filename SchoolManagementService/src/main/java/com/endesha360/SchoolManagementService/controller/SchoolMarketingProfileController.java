package com.endesha360.SchoolManagementService.controller;

import com.endesha360.SchoolManagementService.dto.*;
import com.endesha360.SchoolManagementService.service.SchoolMarketingProfileService;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

@RestController
@RequestMapping("/api/schools/{schoolId}/marketing-profile")
@CrossOrigin(origins = "*")
public class SchoolMarketingProfileController {

    private final SchoolMarketingProfileService profileService;

    public SchoolMarketingProfileController(SchoolMarketingProfileService profileService) {
        this.profileService = profileService;
    }

    @GetMapping
    public ResponseEntity<?> getProfile(@PathVariable Long schoolId) {
        try {
            SchoolMarketingProfileResponse profile = profileService.getProfile(schoolId);
            return ResponseEntity.ok(profile);
        } catch (RuntimeException e) {
            if (e.getMessage() != null && e.getMessage().contains("Marketing profile not found")) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Marketing profile not found");
            }
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Unexpected error");
        }
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
