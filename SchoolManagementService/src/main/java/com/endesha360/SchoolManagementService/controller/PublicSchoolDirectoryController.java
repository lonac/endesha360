package com.endesha360.SchoolManagementService.controller;

import com.endesha360.SchoolManagementService.dto.SchoolMarketingProfileResponse;
import com.endesha360.SchoolManagementService.service.SchoolMarketingProfileService;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import java.util.List;

@RestController
@RequestMapping("/api/schools/marketing/public")
@CrossOrigin(origins = "*")
public class PublicSchoolDirectoryController {

    private final SchoolMarketingProfileService profileService;

    public PublicSchoolDirectoryController(SchoolMarketingProfileService profileService) {
        this.profileService = profileService;
    }

    @GetMapping("/directory")
    public ResponseEntity<List<SchoolMarketingProfileResponse>> getPublicDirectory() {
        try {
            List<SchoolMarketingProfileResponse> profiles = profileService.getPublicProfiles();
            return ResponseEntity.ok(profiles);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
