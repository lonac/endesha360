package com.endesha360.student_management_service.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@FeignClient(name = "test-service", url = "http://localhost:8086")
public interface TestServiceClient {
    
    @GetMapping("/api/exams/results/student/{studentId}")
    List<TestResultDto> getStudentTestResults(@PathVariable Long studentId);

    // Define TestResultDto as inner class or import from test service
    public static class TestResultDto {
        public String attemptId;
        public Long studentId;
        public String startedAt;
        public Integer score;
        public Integer totalQuestions;
        public Double percentage;
        public String status;
    }
}
