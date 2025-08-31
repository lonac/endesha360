package com.endesha360.student_management_service.controller;

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
}
