package com.endesha360.student_management_service.service;

import com.endesha360.student_management_service.entity.StudentProgress;
import com.endesha360.student_management_service.repository.StudentProgressRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class StudentProgressService {
    @Autowired
    private StudentProgressRepository progressRepository;

    public StudentProgress saveProgress(StudentProgress progress) {
        return progressRepository.save(progress);
    }

    public List<StudentProgress> getProgressByStudentId(Long studentId) {
        return progressRepository.findByStudentId(studentId);
    }

    public List<StudentProgress> getProgressByCourseId(Long courseId) {
        return progressRepository.findByCourseId(courseId);
    }

    public Optional<StudentProgress> getProgressById(Long id) {
        return progressRepository.findById(id);
    }

    public void deleteProgress(Long id) {
        progressRepository.deleteById(id);
    }
}
