package com.endesha360.student_management_service.controller;

import com.endesha360.student_management_service.dto.ExamResultUpdateRequest;
import com.endesha360.student_management_service.dto.StudentProgressWithResultsDto;
import com.endesha360.student_management_service.entity.StudentProgress;
import com.endesha360.student_management_service.service.StudentProgressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/student-progress")
public class StudentProgressController {
    @Autowired
    private StudentProgressService progressService;

    @PostMapping
    public StudentProgress createProgress(@RequestBody StudentProgress progress) {
        return progressService.saveProgress(progress);
    }

    @GetMapping("/student/{studentId}")
    public List<StudentProgress> getProgressByStudentId(@PathVariable Long studentId) {
        return progressService.getProgressByStudentId(studentId);
    }

    @GetMapping("/course/{courseId}")
    public List<StudentProgress> getProgressByCourseId(@PathVariable Long courseId) {
        return progressService.getProgressByCourseId(courseId);
    }

    @GetMapping("/{id}")
    public ResponseEntity<StudentProgress> getProgressById(@PathVariable Long id) {
        return progressService.getProgressById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public void deleteProgress(@PathVariable Long id) {
        progressService.deleteProgress(id);
    }

    @PostMapping("/update-after-exam")
    public ResponseEntity<String> updateProgressAfterExam(@RequestBody ExamResultUpdateRequest request) {
        try {
            progressService.updateProgressAfterExam(request);
            return ResponseEntity.ok("Progress updated successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error updating progress: " + e.getMessage());
        }
    }

    @GetMapping("/comprehensive/student/{studentId}")
    public ResponseEntity<List<StudentProgressWithResultsDto>> getComprehensiveProgress(@PathVariable Long studentId) {
        try {
            List<StudentProgressWithResultsDto> comprehensiveProgress = progressService.getComprehensiveProgress(studentId);
            return ResponseEntity.ok(comprehensiveProgress);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
