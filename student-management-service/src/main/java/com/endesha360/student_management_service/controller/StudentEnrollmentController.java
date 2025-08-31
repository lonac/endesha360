package com.endesha360.student_management_service.controller;

import com.endesha360.student_management_service.entity.StudentEnrollment;
import com.endesha360.student_management_service.service.StudentEnrollmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/student-enrollments")
public class StudentEnrollmentController {
    @Autowired
    private StudentEnrollmentService enrollmentService;

    @PostMapping
    public StudentEnrollment createEnrollment(@RequestBody StudentEnrollment enrollment) {
        return enrollmentService.saveEnrollment(enrollment);
    }

    @GetMapping("/student/{studentId}")
    public List<StudentEnrollment> getEnrollmentsByStudentId(@PathVariable Long studentId) {
        return enrollmentService.getEnrollmentsByStudentId(studentId);
    }

    @GetMapping("/course/{courseId}")
    public List<StudentEnrollment> getEnrollmentsByCourseId(@PathVariable Long courseId) {
        return enrollmentService.getEnrollmentsByCourseId(courseId);
    }

    @GetMapping("/{id}")
    public ResponseEntity<StudentEnrollment> getEnrollmentById(@PathVariable Long id) {
        return enrollmentService.getEnrollmentById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public void deleteEnrollment(@PathVariable Long id) {
        enrollmentService.deleteEnrollment(id);
    }
}
