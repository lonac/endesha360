//(INTERNAL – includes correct answers)
package com.endesha360.questions_service.controller;

import com.endesha360.questions_service.dto.InternalQuestionDto;
import com.endesha360.questions_service.service.QuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController @RequestMapping("/api/internal/questions")
public class InternalQuestionController {

    @Autowired private QuestionService questionService;

    @GetMapping("/pool")
    public List<InternalQuestionDto> pool(@RequestParam(required = false) Long categoryId,
                                          @RequestParam(required = false) Long levelId,
                                          @RequestParam(defaultValue = "200") int limit) {
        return questionService.poolInternal(categoryId, levelId, limit);
    }
}
