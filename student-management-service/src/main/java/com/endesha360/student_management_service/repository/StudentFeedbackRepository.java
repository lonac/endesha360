package com.endesha360.student_management_service.repository;

import com.endesha360.student_management_service.entity.StudentFeedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface StudentFeedbackRepository extends JpaRepository<StudentFeedback, Long> {
    List<StudentFeedback> findByStudentId(Long studentId);
    List<StudentFeedback> findByCourseId(Long courseId);
}
