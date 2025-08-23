package com.endesha360.questions_service.service;

import com.endesha360.questions_service.dto.QuestionCategoryDto;
import com.endesha360.questions_service.model.QuestionCategory;
import com.endesha360.questions_service.repository.QuestionCategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class QuestionCategoryService {

    @Autowired
    private QuestionCategoryRepository questionCategoryRepository;

    public List<QuestionCategoryDto> list() {
        return questionCategoryRepository.findAll().stream().map(c -> {
            QuestionCategoryDto dto = new QuestionCategoryDto();
            dto.setId(c.getId());
            dto.setName(c.getName());
            return dto;
        }).toList();
    }

    public QuestionCategory createIfNotExists(String name) {
        return questionCategoryRepository.findByNameIgnoreCase(name)
                .orElseGet(() -> {
                    QuestionCategory c = new QuestionCategory();
                    c.setName(name);
                    return questionCategoryRepository.save(c);
                });
    }
}
