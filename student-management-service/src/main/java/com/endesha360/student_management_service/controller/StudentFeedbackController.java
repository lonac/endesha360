package com.endesha360.student_management_service.controller;

import com.endesha360.student_management_service.entity.StudentFeedback;
import com.endesha360.student_management_service.service.StudentFeedbackService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/student-feedback")
public class StudentFeedbackController {
    @Autowired
    private StudentFeedbackService feedbackService;

    @PostMapping
    public StudentFeedback createFeedback(@RequestBody StudentFeedback feedback) {
        return feedbackService.saveFeedback(feedback);
    }

    @GetMapping("/student/{studentId}")
    public List<StudentFeedback> getFeedbackByStudentId(@PathVariable Long studentId) {
        return feedbackService.getFeedbackByStudentId(studentId);
    }

    @GetMapping("/course/{courseId}")
    public List<StudentFeedback> getFeedbackByCourseId(@PathVariable Long courseId) {
        return feedbackService.getFeedbackByCourseId(courseId);
    }

    @GetMapping("/{id}")
    public ResponseEntity<StudentFeedback> getFeedbackById(@PathVariable Long id) {
        return feedbackService.getFeedbackById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public void deleteFeedback(@PathVariable Long id) {
        feedbackService.deleteFeedback(id);
    }
}
