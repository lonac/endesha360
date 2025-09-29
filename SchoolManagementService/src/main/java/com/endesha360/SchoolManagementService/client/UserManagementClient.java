package com.endesha360.SchoolManagementService.client;

import com.endesha360.SchoolManagementService.dto.TenantCreationRequest;
import com.endesha360.SchoolManagementService.dto.TenantResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@FeignClient(name = "user-management-service", path = "/api/tenants")
public interface UserManagementClient {

    @PostMapping("/create")
    ResponseEntity<TenantResponse> createTenant(@RequestBody TenantCreationRequest request);

    @GetMapping("/exists/{code}")
    ResponseEntity<Boolean> tenantExists(@PathVariable("code") String code);

    @GetMapping("/code/{code}")
    ResponseEntity<TenantResponse> getTenantByCode(@PathVariable("code") String code);

    @PutMapping("/{code}/activate")
    ResponseEntity<String> activateTenant(@PathVariable("code") String code);

    @PutMapping("/{code}/deactivate")
    ResponseEntity<String> deactivateTenant(@PathVariable("code") String code);
}
