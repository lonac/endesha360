package com.endesha360.questions_service.repository;

import com.endesha360.questions_service.model.QuestionLevel;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface QuestionLevelRepository extends JpaRepository<QuestionLevel, Long> {
    Optional<QuestionLevel> findByName(String name);
}
