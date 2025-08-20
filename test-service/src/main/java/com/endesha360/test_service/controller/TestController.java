package com.endesha360.test_service.controller;

import com.endesha360.test_service.dto.AnswerSubmission;
import com.endesha360.test_service.dto.TestRequest;
import com.endesha360.test_service.model.Test;
import com.endesha360.test_service.service.TestService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tests")
@RequiredArgsConstructor
public class TestController {

    private final TestService mockTestService;

    @PostMapping
    public Test createTest(@RequestBody TestRequest request) {
        return mockTestService.createTest(request);
    }

    @PostMapping("/{testId}/submit")
    public Test submitAnswers(@PathVariable Long testId, @RequestBody List<AnswerSubmission> submissions) {
        return mockTestService.submitAnswers(testId, submissions);
    }

    @GetMapping("/student/{studentId}")
    public List<Test> getTestsByStudent(@PathVariable Long studentId) {
        return mockTestService.getTestsByStudent(studentId);
    }

    @GetMapping("/{testId}")
    public Test getTest(@PathVariable Long testId) {
        return mockTestService.getTest(testId);
    }
}

