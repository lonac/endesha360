package com.endesha360.student_management_service.repository;

import com.endesha360.student_management_service.entity.StudentEnrollment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface StudentEnrollmentRepository extends JpaRepository<StudentEnrollment, Long> {
    List<StudentEnrollment> findByStudentId(Long studentId);
    List<StudentEnrollment> findByCourseId(Long courseId);
}
