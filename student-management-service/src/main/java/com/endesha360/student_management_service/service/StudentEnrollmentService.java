package com.endesha360.student_management_service.service;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import com.endesha360.student_management_service.security.StudentAccess;
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

    @Autowired
    private StudentAccess access;

    public StudentEnrollment saveEnrollment(StudentEnrollment enrollment) {
        access.owner();
        access.requireStudent(enrollment.getStudentId());
        if (enrollment.getId() != null) {
            StudentEnrollment existing = enrollmentRepository.findById(enrollment.getId())
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.NOT_FOUND));
            access.requireStudent(existing.getStudentId());
            if (!java.util.Objects.equals(existing.getStudentId(), enrollment.getStudentId()))
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST, "Student identity cannot be changed");
        }
        return enrollmentRepository.save(enrollment);
    }

    public List<StudentEnrollment> getEnrollmentsByStudentId(Long studentId) {
        access.requireStudent(studentId);
        return enrollmentRepository.findByStudentId(studentId);
    }

    public List<StudentEnrollment> getEnrollmentsByCourseId(Long courseId) {
        return enrollmentRepository.findVisibleByCourse(courseId, access.principal().tenantCode(),
                access.readerUserId(), access.readerInstructorId());
    }

    public Optional<StudentEnrollment> getEnrollmentById(Long id) {
        access.principal();
        return enrollmentRepository.findById(id).map(record -> {
            access.requireStudent(record.getStudentId());
            return record;
        });
    }

    public void deleteEnrollment(Long id) {
        access.owner();
        getEnrollmentById(id).ifPresent(enrollmentRepository::delete);
    }
}
