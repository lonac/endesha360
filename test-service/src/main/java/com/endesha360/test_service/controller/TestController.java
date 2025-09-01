package com.endesha360.test_service.controller;

import com.endesha360.test_service.dto.*;
import com.endesha360.test_service.service.TestService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/exams")
public class TestController {

    @Autowired private TestService testService;

    @PostMapping("/start")
    public StartTestResponse start(@Valid @RequestBody StartTestRequest req, HttpServletRequest http) {
        return testService.startExam(req, http.getRemoteAddr(), http.getHeader("User-Agent"));
    }

    @PostMapping("/{attemptId}/submit")
    public SubmitTestResponse submit(@PathVariable String attemptId,
                                     @RequestBody SubmitTestRequest req,
                                     HttpServletRequest http) {
        return testService.submit(attemptId, req, http.getRemoteAddr());
    }

    // type: TAB_SWITCH | FOCUS_LOSS | FULLSCREEN_EXIT
    @PostMapping("/{attemptId}/event/{type}")
    public void event(@PathVariable String attemptId, @PathVariable String type) {
        testService.recordEvent(attemptId, type);
    }

    @GetMapping("/results/student/{studentId}")
    public List<TestResultDto> getStudentTestResults(@PathVariable Long studentId) {
        return testService.getStudentTestResults(studentId);
    }

    @GetMapping("/results/{attemptId}")
    public ResponseEntity<TestResultDto> getTestResult(@PathVariable String attemptId) {
        return testService.getTestResult(attemptId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
