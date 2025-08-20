package com.endesha360.test_service.repository;

import com.endesha360.test_service.model.Test;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TestRepository extends JpaRepository<Test, Long> {
    List<Test> findByStudentId(Long studentId);
}
