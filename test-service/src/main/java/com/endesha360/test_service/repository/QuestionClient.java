package com.endesha360.test_service.repository;

import com.endesha360.test_service.dto.QuestionDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@FeignClient(name = "question-service", url = "http://localhost:8086/api/questions")
public interface QuestionClient {

    @GetMapping("/random")
    List<QuestionDto> getRandomQuestions(@RequestParam("count") int count);
}
