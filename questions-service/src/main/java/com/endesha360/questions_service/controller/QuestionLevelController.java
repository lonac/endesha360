package com.endesha360.questions_service.controller;

import com.endesha360.questions_service.dto.QuestionLevelDTO;
import com.endesha360.questions_service.service.QuestionLevelService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/question-levels")
public class QuestionLevelController {
    @Autowired
    private QuestionLevelService questionLevelService;

    @GetMapping
    public List<QuestionLevelDTO> getAllLevels() {
        return questionLevelService.getAllLevels();
    }

    @GetMapping("/{id}")
    public ResponseEntity<QuestionLevelDTO> getLevelById(@PathVariable Long id) {
        return questionLevelService.getLevelById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public QuestionLevelDTO createLevel(@RequestBody QuestionLevelDTO dto) {
        return questionLevelService.createLevel(dto);
    }
}
