package com.endesha360.student_management_service.service;

import com.endesha360.student_management_service.entity.StudentEnrollment;
import com.endesha360.student_management_service.repository.StudentEnrollmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class StudentEnrollmentService {
    @Autowired
    private StudentEnrollmentRepository enrollmentRepository;

    public StudentEnrollment saveEnrollment(StudentEnrollment enrollment) {
        return enrollmentRepository.save(enrollment);
    }

    public List<StudentEnrollment> getEnrollmentsByStudentId(Long studentId) {
        return enrollmentRepository.findByStudentId(studentId);
    }

    public List<StudentEnrollment> getEnrollmentsByCourseId(Long courseId) {
        return enrollmentRepository.findByCourseId(courseId);
    }

    public Optional<StudentEnrollment> getEnrollmentById(Long id) {
        return enrollmentRepository.findById(id);
    }

    public void deleteEnrollment(Long id) {
        enrollmentRepository.deleteById(id);
    }
}
