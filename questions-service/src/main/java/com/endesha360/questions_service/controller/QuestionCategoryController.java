package com.endesha360.questions_service.controller;

import com.endesha360.questions_service.dto.QuestionCategoryDto;
import com.endesha360.questions_service.model.QuestionCategory;
import com.endesha360.questions_service.service.QuestionCategoryService;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController @RequestMapping("/api/categories")
public class QuestionCategoryController {

    @Autowired private QuestionCategoryService questionCategoryService;

    @GetMapping
    public List<QuestionCategoryDto> list() {
        return questionCategoryService.list();
    }

    // Optional: endpoint to seed categories via API
    @PostMapping
    public QuestionCategoryDto create(@RequestBody CreateCategoryRequest req) {
        QuestionCategory c = questionCategoryService.createIfNotExists(req.getName());
        QuestionCategoryDto dto = new QuestionCategoryDto();
        dto.setId(c.getId());
        dto.setName(c.getName());
        return dto;
    }

    @Data
    static class CreateCategoryRequest { @NotBlank private String name; }
}
