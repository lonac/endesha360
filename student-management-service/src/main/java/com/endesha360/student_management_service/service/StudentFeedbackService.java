package com.endesha360.student_management_service.service;

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

    public StudentFeedback saveFeedback(StudentFeedback feedback) {
        return feedbackRepository.save(feedback);
    }

    public List<StudentFeedback> getFeedbackByStudentId(Long studentId) {
        return feedbackRepository.findByStudentId(studentId);
    }

    public List<StudentFeedback> getFeedbackByCourseId(Long courseId) {
        return feedbackRepository.findByCourseId(courseId);
    }

    public Optional<StudentFeedback> getFeedbackById(Long id) {
        return feedbackRepository.findById(id);
    }

    public void deleteFeedback(Long id) {
        feedbackRepository.deleteById(id);
    }
}
