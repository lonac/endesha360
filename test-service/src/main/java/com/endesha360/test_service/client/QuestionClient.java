package com.endesha360.test_service.client;

import lombok.Data;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@FeignClient(name = "question-service")
public interface QuestionClient {

    @GetMapping("/api/internal/questions/pool")
    List<QuestionInternalDto> getPool(@RequestParam(required = false) Long categoryId,
                                      @RequestParam(defaultValue = "200") int limit);

    @Data
    class QuestionInternalDto {
        private Long id;
        private Long categoryId;
        private String categoryName;
        private String questionText;
        private String imageUrl;
        private List<String> options;
        private String correctAnswer;
    }
}
