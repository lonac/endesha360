package com.endesha360.SystemAdminServices.client;

import com.endesha360.SystemAdminServices.dto.SchoolDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PathVariable;
import java.util.List;

@FeignClient(
    name = "school-management-service",
    url = "http://localhost:8082",
    configuration = com.endesha360.SystemAdminServices.config.FeignConfig.class
)
public interface SchoolServiceFeignClient {
    @GetMapping("/api/schools/admin/stats")
    SchoolStats getSchoolStatistics();

    // DTO for statistics response
    class SchoolStats {
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

    @GetMapping("/api/schools/all")
    List<SchoolDTO> getAllSchools();

    @GetMapping("/api/schools/approved")
    List<SchoolDTO> getApprovedSchools();

    @GetMapping("/api/schools/rejected")
    List<SchoolDTO> getRejectedSchools();

    @GetMapping("/api/schools/pending")
    List<SchoolDTO> getPendingSchools();

    @GetMapping("/api/schools/{schoolId}")
    SchoolDTO getSchoolById(@PathVariable("schoolId") Long schoolId);
}
