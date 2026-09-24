package com.endesha360.student_management_service.service;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import com.endesha360.student_management_service.security.StudentAccess;
import com.endesha360.student_management_service.entity.StudentFeedback;
import com.endesha360.student_management_service.repository.StudentFeedbackRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class StudentFeedbackService {
    @Autowired
    private StudentFeedbackRepository feedbackRepository;

    @Autowired
    private StudentAccess access;

    public StudentFeedback saveFeedback(StudentFeedback feedback) {

        access.requireStudent(feedback.getStudentId());
        if (feedback.getId() != null) {
            StudentFeedback existing = feedbackRepository.findById(feedback.getId())
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.NOT_FOUND));
            access.requireStudent(existing.getStudentId());
            if (!java.util.Objects.equals(existing.getStudentId(), feedback.getStudentId()))
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST, "Student identity cannot be changed");
        }
        return feedbackRepository.save(feedback);
    }

    public List<StudentFeedback> getFeedbackByStudentId(Long studentId) {
        access.requireStudent(studentId);
        return feedbackRepository.findByStudentId(studentId);
    }

    public List<StudentFeedback> getFeedbackByCourseId(Long courseId) {
        return feedbackRepository.findVisibleByCourse(courseId, access.principal().tenantCode(),
                access.readerUserId(), access.readerInstructorId());
    }

    public Optional<StudentFeedback> getFeedbackById(Long id) {
        access.principal();
        return feedbackRepository.findById(id).map(record -> {
            access.requireStudent(record.getStudentId());
            return record;
        });
    }

    public void deleteFeedback(Long id) {
        access.owner();
        getFeedbackById(id).ifPresent(feedbackRepository::delete);
    }
}
