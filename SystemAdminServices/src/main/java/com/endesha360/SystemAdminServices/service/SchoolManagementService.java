package com.endesha360.SystemAdminServices.service;

import com.endesha360.SystemAdminServices.dto.SchoolApprovalRequest;
import com.endesha360.SystemAdminServices.dto.SchoolDTO;
import com.endesha360.SystemAdminServices.entity.SchoolApprovalAction;
import com.endesha360.SystemAdminServices.repository.SchoolApprovalActionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class SchoolManagementService {

    @Autowired
    private SchoolApprovalActionRepository approvalActionRepository;

    private final RestTemplate restTemplate = new RestTemplate();
    private final String SCHOOL_SERVICE_URL = "http://localhost:8082/api/schools";

    public List<SchoolDTO> getPendingSchools() {
        try {
            ResponseEntity<SchoolDTO[]> response = restTemplate.getForEntity(
                SCHOOL_SERVICE_URL + "/pending", SchoolDTO[].class);
            return List.of(response.getBody());
        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch pending schools: " + e.getMessage());
        }
    }

    public List<SchoolDTO> getAllSchools() {
        try {
            ResponseEntity<SchoolDTO[]> response = restTemplate.getForEntity(
                SCHOOL_SERVICE_URL + "/all", SchoolDTO[].class);
            return List.of(response.getBody());
        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch all schools: " + e.getMessage());
        }
    }

    public SchoolDTO getSchoolById(Long schoolId) {
        try {
            ResponseEntity<SchoolDTO> response = restTemplate.getForEntity(
                SCHOOL_SERVICE_URL + "/" + schoolId, SchoolDTO.class);
            return response.getBody();
        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch school: " + e.getMessage());
        }
    }

    public Map<String, Object> approveSchool(SchoolApprovalRequest request, Long adminId, String adminUsername) {
        try {
            // Get school details first
            SchoolDTO school = getSchoolById(request.getSchoolId());
            
            HttpHeaders headers = new HttpHeaders();
            headers.set("Content-Type", "application/json");
            
            String endpoint;
            HttpEntity<?> entity;
            
            if ("APPROVE".equals(request.getAction())) {
                // For approval, no body needed
                endpoint = SCHOOL_SERVICE_URL + "/" + request.getSchoolId() + "/approve";
                entity = new HttpEntity<>(headers);
            } else if ("REJECT".equals(request.getAction())) {
                // For rejection, send rejection reason in body
                Map<String, String> rejectionData = new HashMap<>();
                rejectionData.put("rejectionReason", request.getComments());
                endpoint = SCHOOL_SERVICE_URL + "/" + request.getSchoolId() + "/reject";
                entity = new HttpEntity<>(rejectionData, headers);
            } else {
                throw new IllegalArgumentException("Invalid action: " + request.getAction());
            }

            // Call School Management Service
            ResponseEntity<String> response = restTemplate.exchange(
                endpoint, 
                HttpMethod.PUT, 
                entity, 
                String.class
            );

            // Record the action in our database
            SchoolApprovalAction.ActionType actionType = "APPROVE".equals(request.getAction()) 
                ? SchoolApprovalAction.ActionType.APPROVED 
                : SchoolApprovalAction.ActionType.REJECTED;

            // Handle ownerId - try to get from ownerId field, if null try ownerUserId, if still null use school ID
            Long schoolOwnerId = school.getOwnerId();
            if (schoolOwnerId == null && school.getOwnerUserId() != null) {
                try {
                    // Try to parse ownerUserId as Long if it's numeric
                    schoolOwnerId = Long.parseLong(school.getOwnerUserId());
                } catch (NumberFormatException e) {
                    // If ownerUserId is not numeric, use school ID as fallback
                    schoolOwnerId = school.getId();
                }
            } else if (schoolOwnerId == null) {
                // Use school ID as fallback to satisfy the not-null constraint
                schoolOwnerId = school.getId();
            }

            SchoolApprovalAction action = new SchoolApprovalAction(
                request.getSchoolId(),
                school.getName(),
                schoolOwnerId,  // Use the processed owner ID
                adminId,
                adminUsername,
                actionType
            );
            action.setComments(request.getComments());
            action.setSchoolData(convertSchoolToJson(school));

            approvalActionRepository.save(action);

            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("message", "School " + request.getAction().toLowerCase() + "d successfully");
            result.put("schoolId", request.getSchoolId());
            result.put("action", request.getAction());

            return result;

        } catch (Exception e) {
            throw new RuntimeException("Failed to process school approval: " + e.getMessage());
        }
    }

    public List<SchoolApprovalAction> getApprovalHistory(Long schoolId) {
        return approvalActionRepository.findBySchoolIdOrderByActionTimestampDesc(schoolId);
    }

    public List<SchoolApprovalAction> getAdminActions(Long adminId) {
        return approvalActionRepository.findByAdminIdOrderByActionTimestampDesc(adminId);
    }

    public Map<String, Object> getApprovalStatistics(Long adminId) {
        Map<String, Object> stats = new HashMap<>();
        
        Long approvedCount = approvalActionRepository.countByAdminIdAndActionType(
            adminId, SchoolApprovalAction.ActionType.APPROVED);
        Long rejectedCount = approvalActionRepository.countByAdminIdAndActionType(
            adminId, SchoolApprovalAction.ActionType.REJECTED);
        
        stats.put("approvedCount", approvedCount);
        stats.put("rejectedCount", rejectedCount);
        stats.put("totalActions", approvedCount + rejectedCount);
        
        return stats;
    }

    private String convertSchoolToJson(SchoolDTO school) {
        // Simple JSON conversion - in production, use ObjectMapper
        return String.format(
            "{\"id\":%d,\"name\":\"%s\",\"email\":\"%s\",\"address\":\"%s\",\"status\":\"%s\"}",
            school.getId(), school.getName(), school.getEmail(), 
            school.getAddress(), school.getApprovalStatus()
        );
    }
}
