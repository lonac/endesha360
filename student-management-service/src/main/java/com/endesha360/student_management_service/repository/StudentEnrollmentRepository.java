package com.endesha360.student_management_service.repository;

import com.endesha360.student_management_service.entity.StudentEnrollment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface StudentEnrollmentRepository extends JpaRepository<StudentEnrollment, Long> {
    List<StudentEnrollment> findByStudentId(Long studentId);
    @org.springframework.data.jpa.repository.Query("select r from StudentEnrollment r, Student s "
            + "where r.studentId = s.id and r.courseId = :courseId and s.tenantCode = :tenant "
            + "and (:userId is null or s.userId = :userId) "
            + "and (:instructorId is null or s.instructorUserId = :instructorId)")
    List<StudentEnrollment> findVisibleByCourse(Long courseId, String tenant, Long userId, Long instructorId);
}
