package com.endesha360.questions_service.repository;

import com.endesha360.questions_service.model.Question;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface QuestionRepository extends JpaRepository<Question, Long> {

    // Automatically generates: SELECT q FROM Question q WHERE q.questionCategory.id = :categoryId
    List<Question> findAllByQuestionCategoryId(Long categoryId);

    // New: filter by both category and level
    List<Question> findAllByQuestionCategoryIdAndQuestionLevelId(Long categoryId, Long levelId);

}
