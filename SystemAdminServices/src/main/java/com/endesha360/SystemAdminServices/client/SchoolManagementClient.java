package com.endesha360.SystemAdminServices.client;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class SchoolManagementClient {

    private static final Logger logger = LoggerFactory.getLogger(SchoolManagementClient.class);

    @Value("${school.management.service.url:http://localhost:8082}")
    private String schoolServiceUrl;

    private final RestTemplate restTemplate;

    public SchoolManagementClient() {
        this.restTemplate = new RestTemplate();
    }

    public SchoolStats getSchoolStatistics() {
        return getSchoolStatistics(null);
    }
    public SchoolStats getSchoolStatistics(String token) {
        try {
            String url = schoolServiceUrl + "/api/schools/admin/stats";
            logger.info("Fetching school statistics from: {}", url);

            org.springframework.http.HttpHeaders headers = new org.springframework.http.HttpHeaders();
            if (token != null) {
                headers.set("Authorization", "Bearer " + token);
            }
            org.springframework.http.HttpEntity<Void> entity = new org.springframework.http.HttpEntity<>(headers);
            ResponseEntity<SchoolStats> response = restTemplate.exchange(url, org.springframework.http.HttpMethod.GET, entity, SchoolStats.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                return response.getBody();
            } else {
                throw new RuntimeException("Failed to fetch school statistics: " + response.getStatusCode());
            }
        } catch (Exception e) {
            logger.error("Error fetching school statistics: ", e);
            throw new RuntimeException("Could not fetch school statistics", e);
        }
    }

    public static class SchoolStats {
        private long totalSchools;
        private long activeSchools;
        private long pendingApproval;

        public SchoolStats() {}

        public SchoolStats(long totalSchools, long activeSchools, long pendingApproval) {
            this.totalSchools = totalSchools;
            this.activeSchools = activeSchools;
            this.pendingApproval = pendingApproval;
        }

        public long getTotalSchools() { return totalSchools; }
        public void setTotalSchools(long totalSchools) { this.totalSchools = totalSchools; }

        public long getActiveSchools() { return activeSchools; }
        public void setActiveSchools(long activeSchools) { this.activeSchools = activeSchools; }

        public long getPendingApproval() { return pendingApproval; }
        public void setPendingApproval(long pendingApproval) { this.pendingApproval = pendingApproval; }
    }
}
