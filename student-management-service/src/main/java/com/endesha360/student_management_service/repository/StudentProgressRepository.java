package com.endesha360.student_management_service.repository;

import com.endesha360.student_management_service.entity.StudentProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface StudentProgressRepository extends JpaRepository<StudentProgress, Long> {
    List<StudentProgress> findByStudentId(Long studentId);
    List<StudentProgress> findByCourseId(Long courseId);
}
