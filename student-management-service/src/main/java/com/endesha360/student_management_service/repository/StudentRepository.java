package com.endesha360.student_management_service.repository;

import com.endesha360.student_management_service.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
    java.util.Optional<Student> findByUserIdAndTenantCode(Long userId, String tenantCode);

    java.util.Optional<Student> findByIdAndTenantCode(Long id, String tenantCode);

    @org.springframework.data.jpa.repository.Query("select s from Student s where s.tenantCode = :tenant "
            + "and (:userId is null or s.userId = :userId) "
            + "and (:instructorId is null or s.instructorUserId = :instructorId)")
    java.util.List<Student> findVisible(String tenant, Long userId, Long instructorId);
}
