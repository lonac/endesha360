package com.endesha360.questions_service.repository;

import com.endesha360.questions_service.model.QuestionCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface QuestionCategoryRepository extends JpaRepository<QuestionCategory, Long> {
    Optional<QuestionCategory> findByNameIgnoreCase(String name);
}
