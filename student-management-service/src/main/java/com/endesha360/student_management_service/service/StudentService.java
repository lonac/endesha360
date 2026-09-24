package com.endesha360.student_management_service.service;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import com.endesha360.student_management_service.security.StudentAccess;
import com.endesha360.student_management_service.entity.Student;
import com.endesha360.student_management_service.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class StudentService {
    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private StudentAccess access;

    public Student saveStudent(Student student) {
        access.owner();
        if (student.getId() != null) {
            Student existing = access.requireStudent(student.getId());
            if (!java.util.Objects.equals(existing.getUserId(), student.getUserId()))
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST, "User identity cannot be changed");
        }
        student.setTenantCode(access.principal().tenantCode());
        return studentRepository.save(student);
    }

    public Optional<Student> getStudentById(Long id) {
        return Optional.of(access.requireStudent(id));
    }

    public List<Student> getAllStudents() {
        return studentRepository.findVisible(access.principal().tenantCode(),
                access.readerUserId(), access.readerInstructorId());
    }

    public void deleteStudent(Long id) {
        access.owner();
        studentRepository.delete(access.requireStudent(id));
    }
}
