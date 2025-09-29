package com.endesha360.UserManagementService.service;

import com.endesha360.UserManagementService.dto.response.ActivityResponse;
import com.endesha360.UserManagementService.entity.Activity;
import com.endesha360.UserManagementService.repository.ActivityRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ActivityService {
    
    private static final Logger logger = LoggerFactory.getLogger(ActivityService.class);
    
    @Autowired
    private ActivityRepository activityRepository;
    
    /**
     * Log a new activity
     */
    public void logActivity(String activityType, String description, String tenantCode, String userId) {
        logActivity(activityType, description, tenantCode, userId, null);
    }
    
    /**
     * Log a new activity with metadata
     */
    public void logActivity(String activityType, String description, String tenantCode, String userId, String metadata) {
        try {
            Activity activity = new Activity(activityType, description, tenantCode, userId, metadata);
            activityRepository.save(activity);
            logger.info("Activity logged: {} for tenant: {} user: {}", activityType, tenantCode, userId);
        } catch (Exception e) {
            logger.error("Failed to log activity: {} for tenant: {} user: {}: {}", 
                        activityType, tenantCode, userId, e.getMessage(), e);
        }
    }
    
    /**
     * Get recent activities for a tenant
     */
    public List<ActivityResponse> getRecentActivities(String tenantCode, int limit) {
        try {
            Pageable pageable = PageRequest.of(0, limit);
            List<Activity> activities = activityRepository.findByTenantCodeOrderByCreatedAtDesc(tenantCode, pageable);
            
            return activities.stream()
                    .map(this::convertToActivityResponse)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            logger.error("Failed to get recent activities for tenant: {}: {}", tenantCode, e.getMessage(), e);
            return List.of();
        }
    }
    
    /**
     * Get activities by type for a tenant
     */
    public List<ActivityResponse> getActivitiesByType(String tenantCode, String activityType, int limit) {
        try {
            Pageable pageable = PageRequest.of(0, limit);
            List<Activity> activities = activityRepository.findByTenantCodeAndActivityTypeOrderByCreatedAtDesc(
                    tenantCode, activityType, pageable);
            
            return activities.stream()
                    .map(this::convertToActivityResponse)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            logger.error("Failed to get activities by type {} for tenant: {}: {}", 
                        activityType, tenantCode, e.getMessage(), e);
            return List.of();
        }
    }
    
    /**
     * Get activities within a date range
     */
    public List<ActivityResponse> getActivitiesInDateRange(String tenantCode, LocalDateTime startDate, 
                                                          LocalDateTime endDate, int limit) {
        try {
            Pageable pageable = PageRequest.of(0, limit);
            List<Activity> activities = activityRepository.findByTenantCodeAndDateRange(
                    tenantCode, startDate, endDate, pageable);
            
            return activities.stream()
                    .map(this::convertToActivityResponse)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            logger.error("Failed to get activities in date range for tenant: {}: {}", 
                        tenantCode, e.getMessage(), e);
            return List.of();
        }
    }
    
    /**
     * Get activity count by tenant
     */
    public long getActivityCount(String tenantCode) {
        try {
            return activityRepository.countByTenantCode(tenantCode);
        } catch (Exception e) {
            logger.error("Failed to get activity count for tenant: {}: {}", tenantCode, e.getMessage(), e);
            return 0;
        }
    }
    
    /**
     * Convert Activity entity to ActivityResponse DTO
     */
    private ActivityResponse convertToActivityResponse(Activity activity) {
        return new ActivityResponse(
                activity.getId(),
                activity.getActivityType(),
                activity.getDescription(),
                activity.getUserId(),
                activity.getMetadata(),
                activity.getCreatedAt()
        );
    }
}
