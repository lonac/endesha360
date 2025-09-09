package com.endesha360.SystemAdminServices.client;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class UserManagementClient {

    private static final Logger logger = LoggerFactory.getLogger(UserManagementClient.class);

    @Value("${user.management.service.url:http://localhost:8081}")
    private String userServiceUrl;

    private final RestTemplate restTemplate;

    public UserManagementClient() {
        this.restTemplate = new RestTemplate();
    }

    public UserStats getUserStatistics() {
        return getUserStatistics(null);
    }
    public UserStats getUserStatistics(String token) {
        try {
            String url = userServiceUrl + "/api/users/admin/statistics";
            logger.info("Fetching user statistics from: {}", url);

            org.springframework.http.HttpHeaders headers = new org.springframework.http.HttpHeaders();
            if (token != null) {
                headers.set("Authorization", "Bearer " + token);
            }
            org.springframework.http.HttpEntity<Void> entity = new org.springframework.http.HttpEntity<>(headers);
            ResponseEntity<UserStats> response = restTemplate.exchange(url, org.springframework.http.HttpMethod.GET, entity, UserStats.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                return response.getBody();
            } else {
                throw new RuntimeException("Failed to fetch user statistics: " + response.getStatusCode());
            }
        } catch (Exception e) {
            logger.error("Error fetching user statistics: ", e);
            throw new RuntimeException("Could not fetch user statistics", e);
        }
    }

    public static class UserStats {
        private long totalUsers;
        private long studentsCount;
        private long instructorsCount;
        private long adminsCount;

        public UserStats() {}

        public UserStats(long totalUsers, long studentsCount, long instructorsCount, long adminsCount) {
            this.totalUsers = totalUsers;
            this.studentsCount = studentsCount;
            this.instructorsCount = instructorsCount;
            this.adminsCount = adminsCount;
        }

        public long getTotalUsers() { return totalUsers; }
        public void setTotalUsers(long totalUsers) { this.totalUsers = totalUsers; }

        public long getStudentsCount() { return studentsCount; }
        public void setStudentsCount(long studentsCount) { this.studentsCount = studentsCount; }

        public long getInstructorsCount() { return instructorsCount; }
        public void setInstructorsCount(long instructorsCount) { this.instructorsCount = instructorsCount; }

        public long getAdminsCount() { return adminsCount; }
        public void setAdminsCount(long adminsCount) { this.adminsCount = adminsCount; }
    }
}
