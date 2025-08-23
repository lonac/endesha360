//(PUBLIC – no correct answers)
package com.endesha360.questions_service.controller;

import com.endesha360.questions_service.dto.QuestionCreateRequest;
import com.endesha360.questions_service.dto.PublicQuestionDto;
import com.endesha360.questions_service.service.QuestionService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController @RequestMapping("/api/questions")
public class QuestionController {

    @Autowired private QuestionService questionService;

    @PostMapping
    public PublicQuestionDto create(@Valid @RequestBody QuestionCreateRequest req) {
        return questionService.create(req);
    }

    @GetMapping
    public List<PublicQuestionDto> list(@RequestParam(required = false) Long categoryId) {
        return questionService.listPublic(categoryId);
    }
}
