package com.endesha360.SystemAdminServices.service;

import com.endesha360.SystemAdminServices.client.SchoolManagementClient;
import com.endesha360.SystemAdminServices.client.UserManagementClient;
import com.endesha360.SystemAdminServices.dto.QuestionStatisticsDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
public class DashboardService {

    private static final Logger logger = LoggerFactory.getLogger(DashboardService.class);

    @Autowired
    private QuestionManagementService questionManagementService;

    @Autowired
    private SchoolManagementClient schoolManagementClient;

    @Autowired
    private UserManagementClient userManagementClient;

    @Autowired
    private FinancialService financialService;

    public Map<String, Object> getDashboardData() {
        return getDashboardData(null);
    }

    public Map<String, Object> getDashboardData(String token) {
        Map<String, Object> dashboardData = new HashMap<>();
        try {
            // Get school statistics
            Map<String, Object> schoolStats = getSchoolStatistics(token);
            dashboardData.put("schools", schoolStats);

            // Get user statistics
            Map<String, Object> userStats = getUserStatistics(token);
            dashboardData.put("users", userStats);

            // Get financial statistics
            Map<String, Object> financialStats = getFinancialStatistics();
            dashboardData.put("financial", financialStats);

            // Get question statistics
            QuestionStatisticsDTO questionStats = questionManagementService.getQuestionStatistics();
            dashboardData.put("questions", Map.of(
                "totalQuestions", questionStats.getTotalQuestions(),
                "totalCategories", questionStats.getTotalCategories(),
                "questionsThisMonth", questionStats.getQuestionsThisMonth(),
                "averageQuestionsPerCategory", questionStats.getAverageQuestionsPerCategory()
            ));

            // Get system health
            Map<String, Object> systemHealth = getSystemHealth();
            dashboardData.put("system", systemHealth);

            // Get recent activities
            List<Map<String, Object>> recentActivities = getRecentActivities(5);
            dashboardData.put("recentActivities", recentActivities);

        } catch (Exception e) {
            logger.error("Error aggregating dashboard data: ", e);
            dashboardData.put("error", "Some data could not be loaded: " + e.getMessage());
        }
        return dashboardData;
    }

    public Map<String, Object> getSchoolStatistics() {
        return getSchoolStatistics(null);
    }
    public Map<String, Object> getSchoolStatistics(String token) {
        var schoolStats = schoolManagementClient.getSchoolStatistics(token);
        return Map.of(
            "total", schoolStats.getTotalSchools(),
            "active", schoolStats.getActiveSchools(),
            "pending", schoolStats.getPendingApproval(),
            "suspended", 0L // TODO: Add suspended schools count
        );
    }

    public Map<String, Object> getUserStatistics() {
        return getUserStatistics(null);
    }
    public Map<String, Object> getUserStatistics(String token) {
        var userStats = userManagementClient.getUserStatistics(token);
        return Map.of(
            "total", userStats.getTotalUsers(),
            "students", userStats.getStudentsCount(),
            "instructors", userStats.getInstructorsCount(),
            "admins", userStats.getAdminsCount()
        );
    }

    public Map<String, Object> getFinancialStatistics() {
    // Only return real data from FinancialService
    return financialService.getFinancialStatistics();
    }

    public Map<String, Object> getSystemHealth() {
        // TODO: Implement actual system health monitoring
        // For now, return mock data
        return Map.of(
            "status", "Good",
            "uptime", "99.9%",
            "activeServices", 5,
            "totalServices", 6,
            "lastChecked", LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME)
        );
    }

    public List<Map<String, Object>> getRecentActivities(int limit) {
        List<Map<String, Object>> activities = new ArrayList<>();

        try {
            // Try to get real activities from various services
            // For now, create mock activities based on recent data

            // Add school-related activities
            var schoolStats = getSchoolStatistics();
            if ((Long) schoolStats.get("pending") > 0) {
                activities.add(Map.of(
                    "id", "school_pending_" + System.currentTimeMillis(),
                    "type", "school_registration",
                    "message", "New schools pending approval",
                    "time", LocalDateTime.now().minusHours(2).format(DateTimeFormatter.ISO_LOCAL_DATE_TIME),
                    "icon", "School"
                ));
            }

            // Add question-related activities
            var questionStats = questionManagementService.getQuestionStatistics();
            if (questionStats.getQuestionsThisMonth() > 0) {
                activities.add(Map.of(
                    "id", "questions_added_" + System.currentTimeMillis(),
                    "type", "question_management",
                    "message", questionStats.getQuestionsThisMonth() + " questions added this month",
                    "time", LocalDateTime.now().minusHours(4).format(DateTimeFormatter.ISO_LOCAL_DATE_TIME),
                    "icon", "HelpCircle"
                ));
            }

            // Add mock activities for demonstration
            activities.add(Map.of(
                "id", "system_backup_" + System.currentTimeMillis(),
                "type", "system",
                "message", "System backup completed successfully",
                "time", LocalDateTime.now().minusHours(6).format(DateTimeFormatter.ISO_LOCAL_DATE_TIME),
                "icon", "Shield"
            ));

            activities.add(Map.of(
                "id", "payment_received_" + System.currentTimeMillis(),
                "type", "payment",
                "message", "Payment received from school",
                "time", LocalDateTime.now().minusHours(8).format(DateTimeFormatter.ISO_LOCAL_DATE_TIME),
                "icon", "DollarSign"
            ));

        } catch (Exception e) {
            logger.warn("Could not fetch recent activities: ", e);
            // Return mock activities as fallback
            activities = Arrays.asList(
                Map.of(
                    "id", "mock1",
                    "type", "school_registration",
                    "message", "New school registered",
                    "time", LocalDateTime.now().minusHours(2).format(DateTimeFormatter.ISO_LOCAL_DATE_TIME),
                    "icon", "School"
                ),
                Map.of(
                    "id", "mock2",
                    "type", "payment",
                    "message", "Payment received",
                    "time", LocalDateTime.now().minusHours(4).format(DateTimeFormatter.ISO_LOCAL_DATE_TIME),
                    "icon", "DollarSign"
                )
            );
        }

        // Sort by time (most recent first) and limit results
        activities.sort((a, b) -> ((String) b.get("time")).compareTo((String) a.get("time")));
        return activities.subList(0, Math.min(activities.size(), limit));
    }
}
