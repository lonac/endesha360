package com.endesha360.questions_service.service;

import com.endesha360.questions_service.dto.*;
import com.endesha360.questions_service.model.QuestionCategory;
import com.endesha360.questions_service.model.Question;
import com.endesha360.questions_service.repository.QuestionCategoryRepository;
import com.endesha360.questions_service.repository.QuestionRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class QuestionService {

    @Autowired private QuestionRepository questionRepository;
    @Autowired private QuestionCategoryRepository questionCategoryRepository;

    @Transactional
    public PublicQuestionDto create(QuestionCreateRequest req) {
        QuestionCategory cat = questionCategoryRepository.findById(req.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        if (!req.getOptions().contains(req.getCorrectAnswer())) {
            throw new RuntimeException("Correct answer must be one of the options");
        }

        Question q = new Question();
        q.setQuestionCategory(cat);
        q.setQuestionText(req.getQuestionText());
        q.setImageUrl(req.getImageUrl());
        q.setOptions(req.getOptions());
        q.setCorrectAnswer(req.getCorrectAnswer());

        q = questionRepository.save(q);
        return toPublicDto(q);
    }

    public List<PublicQuestionDto> listPublic(Long categoryId) {
        return questionRepository.findAllByQuestionCategoryId(categoryId).stream()
                .map(this::toPublicDto)
                .toList();
    }

    /** Internal for test-service: returns pool (with answers) and shuffles result list. */
    public List<InternalQuestionDto> poolInternal(Long categoryId, int limit) {
        List<Question> all = questionRepository.findAllByQuestionCategoryId(categoryId);
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
                .build();
    }
}
