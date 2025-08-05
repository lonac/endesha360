package com.endesha360.UserManagementService.controller;

import com.endesha360.UserManagementService.dto.request.SchoolOwnerRegistrationRequest;
import com.endesha360.UserManagementService.dto.response.UserResponse;
import com.endesha360.UserManagementService.service.SchoolOwnerService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/school-owners")
@Tag(name = "School Owner Registration", description = "School owner personal registration endpoints")
public class SchoolOwnerController {
    
    @Autowired
    private SchoolOwnerService schoolOwnerService;
    
    @PostMapping("/register")
    @Operation(summary = "School owner personal registration", 
               description = "Register as a school owner (personal account before school business registration)")
    public ResponseEntity<UserResponse> registerSchoolOwner(@Valid @RequestBody SchoolOwnerRegistrationRequest request) {
        UserResponse response = schoolOwnerService.registerSchoolOwner(request);
        return ResponseEntity.ok(response);
    }
}
