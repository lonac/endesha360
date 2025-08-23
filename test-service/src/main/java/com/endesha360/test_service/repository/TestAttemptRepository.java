package com.endesha360.test_service.repository;

import com.endesha360.test_service.model.TestAttempt;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.Optional;

public interface TestAttemptRepository extends JpaRepository<TestAttempt, String> {
    Optional<TestAttempt> findFirstByStudentIdAndStatusIn(Long studentId, Collection<TestAttempt.Status> statuses);
}

