package com.endesha360.test_service.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "student-management-service", url = "http://localhost:8084")
public interface StudentProgressClient {
	@PostMapping("/api/student-progress/update-after-exam")
	void updateProgressAfterExam(@RequestBody ExamResultUpdateRequest request);
}
