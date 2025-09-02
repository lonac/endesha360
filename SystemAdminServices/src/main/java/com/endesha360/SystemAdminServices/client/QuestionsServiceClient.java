package com.endesha360.SystemAdminServices.client;

import com.endesha360.SystemAdminServices.dto.QuestionDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@FeignClient(
    name = "questions-service", 
    url = "http://localhost:8086",
    configuration = com.endesha360.SystemAdminServices.config.FeignConfig.class
)
public interface QuestionsServiceClient {

    @GetMapping("/api/admin/questions")
    Page<QuestionDTO> getAllQuestions(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size,
        @RequestParam(defaultValue = "id") String sort,
        @RequestParam(defaultValue = "ASC") String direction,
        @RequestParam(required = false) String search,
        @RequestParam(required = false) Long categoryId
    );

    @PostMapping("/api/admin/questions")
    QuestionDTO createQuestion(@RequestBody QuestionDTO questionDTO);

    @GetMapping("/api/admin/questions/{id}")
    QuestionDTO getQuestionById(@PathVariable Long id);

    @PutMapping("/api/admin/questions/{id}")
    QuestionDTO updateQuestion(@PathVariable Long id, @RequestBody QuestionDTO questionDTO);

    @DeleteMapping("/api/admin/questions/{id}")
    void deleteQuestion(@PathVariable Long id);

    @PostMapping("/api/admin/questions/bulk")
    List<QuestionDTO> bulkCreateQuestions(@RequestBody List<QuestionDTO> questions);

    @GetMapping("/api/admin/questions/categories")
    List<CategoryDTO> getCategories();

    @GetMapping("/api/admin/questions/levels")
    List<LevelDTO> getLevels();

    @GetMapping("/api/admin/questions/statistics")
    QuestionStatisticsDTO getQuestionStatistics();

    // DTOs for response handling
    class CategoryDTO {
        private Long id;
        private String name;
        private String description;

        // Constructors
        public CategoryDTO() {}

        public CategoryDTO(Long id, String name, String description) {
            this.id = id;
            this.name = name;
            this.description = description;
        }

        // Getters and setters
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }

        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
    }

    class LevelDTO {
        private Long id;
        private String name;

        // Constructors
        public LevelDTO() {}

        public LevelDTO(Long id, String name) {
            this.id = id;
            this.name = name;
        }

        // Getters and setters
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
    }

    class QuestionStatisticsDTO {
        private long totalQuestions;
        private long totalCategories;
        private long questionsThisMonth;
        private double averageQuestionsPerCategory;

        // Constructors
        public QuestionStatisticsDTO() {}

        public QuestionStatisticsDTO(long totalQuestions, long totalCategories, 
                                   long questionsThisMonth, double averageQuestionsPerCategory) {
            this.totalQuestions = totalQuestions;
            this.totalCategories = totalCategories;
            this.questionsThisMonth = questionsThisMonth;
            this.averageQuestionsPerCategory = averageQuestionsPerCategory;
        }

        // Getters and setters
        public long getTotalQuestions() { return totalQuestions; }
        public void setTotalQuestions(long totalQuestions) { this.totalQuestions = totalQuestions; }

        public long getTotalCategories() { return totalCategories; }
        public void setTotalCategories(long totalCategories) { this.totalCategories = totalCategories; }

        public long getQuestionsThisMonth() { return questionsThisMonth; }
        public void setQuestionsThisMonth(long questionsThisMonth) { this.questionsThisMonth = questionsThisMonth; }

        public double getAverageQuestionsPerCategory() { return averageQuestionsPerCategory; }
        public void setAverageQuestionsPerCategory(double averageQuestionsPerCategory) { 
            this.averageQuestionsPerCategory = averageQuestionsPerCategory; 
        }
    }
}
