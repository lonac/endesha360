package com.endesha360.questions_service.service;

import com.endesha360.questions_service.dto.*;
import com.endesha360.questions_service.model.QuestionCategory;
import com.endesha360.questions_service.model.Question;
import com.endesha360.questions_service.model.QuestionLevel;
import com.endesha360.questions_service.repository.QuestionCategoryRepository;
import com.endesha360.questions_service.repository.QuestionRepository;
import com.endesha360.questions_service.repository.QuestionLevelRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class QuestionService {

    @Autowired private QuestionRepository questionRepository;
    @Autowired private QuestionCategoryRepository questionCategoryRepository;

    @Autowired private QuestionLevelRepository questionLevelRepository;

    @Transactional
    public PublicQuestionDto create(QuestionCreateRequest req) {
        QuestionCategory cat = questionCategoryRepository.findById(req.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

    QuestionLevel level = questionLevelRepository.findById(req.getLevelId())
        .orElseThrow(() -> new RuntimeException("Level not found"));

        if (!req.getOptions().contains(req.getCorrectAnswer())) {
            throw new RuntimeException("Correct answer must be one of the options");
        }

        Question q = new Question();
        q.setQuestionCategory(cat);
        q.setQuestionText(req.getQuestionText());
        q.setImageUrl(req.getImageUrl());
        q.setOptions(req.getOptions());
        q.setCorrectAnswer(req.getCorrectAnswer());

    q.setQuestionLevel(level);

        q = questionRepository.save(q);
        return toPublicDto(q);
    }

    public List<PublicQuestionDto> listPublic(Long categoryId) {
        return questionRepository.findAllByQuestionCategoryId(categoryId).stream()
                .map(this::toPublicDto)
                .toList();
    }

    /** Internal for test-service: returns pool (with answers) and shuffles result list. */
    public List<InternalQuestionDto> poolInternal(Long categoryId, Long levelId, int limit) {
        List<Question> all;
        if (categoryId != null && levelId != null) {
            all = questionRepository.findAllByQuestionCategoryIdAndQuestionLevelId(categoryId, levelId);
        } else if (categoryId != null) {
            all = questionRepository.findAllByQuestionCategoryId(categoryId);
        } else {
            all = questionRepository.findAll();
        }
        Collections.shuffle(all);
        return all.stream().limit(limit).map(this::toInternalDto).toList();
    }

    private PublicQuestionDto toPublicDto(Question q) {
    return PublicQuestionDto.builder()
        .id(q.getId())
        .categoryId(q.getQuestionCategory().getId())
        .categoryName(q.getQuestionCategory().getName())
        .questionText(q.getQuestionText())
        .imageUrl(q.getImageUrl())
        .options(q.getOptions())
        .levelId(q.getQuestionLevel() != null ? q.getQuestionLevel().getId() : null)
        .levelName(q.getQuestionLevel() != null ? q.getQuestionLevel().getName() : null)
        .build();
    }

    private InternalQuestionDto toInternalDto(Question q) {
    return InternalQuestionDto.builder()
        .id(q.getId())
        .categoryId(q.getQuestionCategory().getId())
        .categoryName(q.getQuestionCategory().getName())
        .questionText(q.getQuestionText())
        .imageUrl(q.getImageUrl())
        .options(q.getOptions())
        .correctAnswer(q.getCorrectAnswer())
        .levelId(q.getQuestionLevel() != null ? q.getQuestionLevel().getId() : null)
        .levelName(q.getQuestionLevel() != null ? q.getQuestionLevel().getName() : null)
        .build();
    }

    // Admin-specific methods for AdminQuestionController
    @Transactional
    public InternalQuestionDto createInternal(QuestionCreateRequest req) {
        QuestionCategory cat = questionCategoryRepository.findById(req.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        QuestionLevel level = questionLevelRepository.findById(req.getLevelId())
                .orElseThrow(() -> new RuntimeException("Level not found"));

        if (!req.getOptions().contains(req.getCorrectAnswer())) {
            throw new RuntimeException("Correct answer must be one of the options");
        }

        Question q = new Question();
        q.setQuestionCategory(cat);
        q.setQuestionText(req.getQuestionText());
        q.setImageUrl(req.getImageUrl());
        q.setOptions(req.getOptions());
        q.setCorrectAnswer(req.getCorrectAnswer());
        q.setQuestionLevel(level);

        q = questionRepository.save(q);
        return toInternalDto(q);
    }

    public InternalQuestionDto getInternalById(Long id) {
        Question q = questionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Question not found"));
        return toInternalDto(q);
    }

    @Transactional
    public InternalQuestionDto updateInternal(Long id, QuestionCreateRequest req) {
        Question q = questionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Question not found"));

        QuestionCategory cat = questionCategoryRepository.findById(req.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        QuestionLevel level = questionLevelRepository.findById(req.getLevelId())
                .orElseThrow(() -> new RuntimeException("Level not found"));

        if (!req.getOptions().contains(req.getCorrectAnswer())) {
            throw new RuntimeException("Correct answer must be one of the options");
        }

        q.setQuestionCategory(cat);
        q.setQuestionText(req.getQuestionText());
        q.setImageUrl(req.getImageUrl());
        q.setOptions(req.getOptions());
        q.setCorrectAnswer(req.getCorrectAnswer());
        q.setQuestionLevel(level);

        q = questionRepository.save(q);
        return toInternalDto(q);
    }

    @Transactional
    public void delete(Long id) {
        if (!questionRepository.existsById(id)) {
            throw new RuntimeException("Question not found");
        }
        questionRepository.deleteById(id);
    }

    @Transactional
    public List<InternalQuestionDto> bulkCreateInternal(List<QuestionCreateRequest> requests) {
        List<InternalQuestionDto> results = new ArrayList<>();
        for (QuestionCreateRequest req : requests) {
            try {
                results.add(createInternal(req));
            } catch (Exception e) {
                // Log error and continue with next question
                System.err.println("Failed to create question: " + e.getMessage());
            }
        }
        return results;
    }
}
