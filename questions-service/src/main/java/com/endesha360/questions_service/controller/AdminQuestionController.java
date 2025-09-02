package com.endesha360.questions_service.controller;

import com.endesha360.questions_service.dto.InternalQuestionDto;
import com.endesha360.questions_service.dto.QuestionCategoryDto;
import com.endesha360.questions_service.dto.QuestionCreateRequest;
import com.endesha360.questions_service.dto.QuestionLevelDTO;
import com.endesha360.questions_service.service.QuestionService;
import com.endesha360.questions_service.service.QuestionCategoryService;
import com.endesha360.questions_service.service.QuestionLevelService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.HashMap;
import java.util.Map;

@RestController 
@RequestMapping("/api/admin/questions")
public class AdminQuestionController {

    @Autowired 
    private QuestionService questionService;
    
    @Autowired 
    private QuestionCategoryService questionCategoryService;

    @Autowired 
    private QuestionLevelService questionLevelService;

    @GetMapping
    public Page<AdminQuestionDto> getAllQuestions(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size,
        @RequestParam(defaultValue = "id") String sort,
        @RequestParam(defaultValue = "ASC") String direction,
        @RequestParam(required = false) String search,
        @RequestParam(required = false) Long categoryId
    ) {
        // Get internal questions (with correct answers for admin)
        List<InternalQuestionDto> questions = questionService.poolInternal(categoryId, null, 1000);
        
        // Convert to AdminQuestionDto format
        List<AdminQuestionDto> adminQuestions = questions.stream()
            .map(this::toAdminQuestionDto)
            .toList();
        
        // Simple pagination implementation
        Pageable pageable = PageRequest.of(page, size);
        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), adminQuestions.size());
        
        List<AdminQuestionDto> pageContent = adminQuestions.subList(start, end);
        return new PageImpl<>(pageContent, pageable, adminQuestions.size());
    }

    @PostMapping
    public AdminQuestionDto createQuestion(@Valid @RequestBody QuestionCreateRequest questionDTO) {
        InternalQuestionDto created = questionService.createInternal(questionDTO);
        return toAdminQuestionDto(created);
    }

    @GetMapping("/{id}")
    public AdminQuestionDto getQuestionById(@PathVariable Long id) {
        InternalQuestionDto question = questionService.getInternalById(id);
        return toAdminQuestionDto(question);
    }

    @PutMapping("/{id}")
    public AdminQuestionDto updateQuestion(@PathVariable Long id, @Valid @RequestBody QuestionCreateRequest questionDTO) {
        InternalQuestionDto updated = questionService.updateInternal(id, questionDTO);
        return toAdminQuestionDto(updated);
    }

    @DeleteMapping("/{id}")
    public void deleteQuestion(@PathVariable Long id) {
        questionService.delete(id);
    }

    @PostMapping("/bulk")
    public List<AdminQuestionDto> bulkCreateQuestions(@RequestBody List<QuestionCreateRequest> questions) {
        List<InternalQuestionDto> created = questionService.bulkCreateInternal(questions);
        return created.stream().map(this::toAdminQuestionDto).toList();
    }

    @GetMapping("/categories")
    public List<QuestionCategoryDto> getCategories() {
        return questionCategoryService.list();
    }

    @GetMapping("/levels")
    public List<QuestionLevelDTO> getLevels() {
        // We need to get levels from the level service
        return questionLevelService.getAllLevels();
    }

    @GetMapping("/statistics")
    public AdminQuestionStatisticsDto getQuestionStatistics() {
        // Simple statistics implementation
        List<InternalQuestionDto> allQuestions = questionService.poolInternal(null, null, 10000);
        List<QuestionCategoryDto> categories = questionCategoryService.list();
        
        AdminQuestionStatisticsDto stats = new AdminQuestionStatisticsDto();
        stats.setTotalQuestions(allQuestions.size());
        stats.setTotalCategories(categories.size());
        stats.setQuestionsThisMonth(allQuestions.size()); // Simplified
        stats.setAverageQuestionsPerCategory(categories.isEmpty() ? 0 : (double) allQuestions.size() / categories.size());
        
        return stats;
    }

    // Convert InternalQuestionDto to AdminQuestionDto format expected by SystemAdminServices
    private AdminQuestionDto toAdminQuestionDto(InternalQuestionDto internal) {
        AdminQuestionDto admin = new AdminQuestionDto();
        admin.setId(internal.getId());
        admin.setQuestionText(internal.getQuestionText());
        admin.setOptions(internal.getOptions());
        admin.setCorrectAnswer(internal.getCorrectAnswer());
        admin.setCategoryId(internal.getCategoryId());
        admin.setCategoryName(internal.getCategoryName());
        admin.setLevelId(internal.getLevelId());
        admin.setLevelName(internal.getLevelName());
        admin.setImageUrl(internal.getImageUrl());
        admin.setActive(true);
        return admin;
    }

    // DTO class that matches SystemAdminServices expectations
    public static class AdminQuestionDto {
        private Long id;
        private String questionText;
        private List<String> options;
        private String correctAnswer;
        private String explanation;
        private Long categoryId;
        private String categoryName;
        private Long levelId;
        private String levelName;
        private String imageUrl;
        private boolean active = true;
        private String createdBy;

        // Getters and setters
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getQuestionText() { return questionText; }
        public void setQuestionText(String questionText) { this.questionText = questionText; }
        public List<String> getOptions() { return options; }
        public void setOptions(List<String> options) { this.options = options; }
        public String getCorrectAnswer() { return correctAnswer; }
        public void setCorrectAnswer(String correctAnswer) { this.correctAnswer = correctAnswer; }
        public String getExplanation() { return explanation; }
        public void setExplanation(String explanation) { this.explanation = explanation; }
        public Long getCategoryId() { return categoryId; }
        public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }
        public String getCategoryName() { return categoryName; }
        public void setCategoryName(String categoryName) { this.categoryName = categoryName; }
        public Long getLevelId() { return levelId; }
        public void setLevelId(Long levelId) { this.levelId = levelId; }
        public String getLevelName() { return levelName; }
        public void setLevelName(String levelName) { this.levelName = levelName; }
        public String getImageUrl() { return imageUrl; }
        public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
        public boolean isActive() { return active; }
        public void setActive(boolean active) { this.active = active; }
        public String getCreatedBy() { return createdBy; }
        public void setCreatedBy(String createdBy) { this.createdBy = createdBy; }
    }

    // Statistics DTO
    public static class AdminQuestionStatisticsDto {
        private long totalQuestions;
        private long totalCategories;
        private long questionsThisMonth;
        private double averageQuestionsPerCategory;

        // Getters and setters
        public long getTotalQuestions() { return totalQuestions; }
        public void setTotalQuestions(long totalQuestions) { this.totalQuestions = totalQuestions; }
        public long getTotalCategories() { return totalCategories; }
        public void setTotalCategories(long totalCategories) { this.totalCategories = totalCategories; }
        public long getQuestionsThisMonth() { return questionsThisMonth; }
        public void setQuestionsThisMonth(long questionsThisMonth) { this.questionsThisMonth = questionsThisMonth; }
        public double getAverageQuestionsPerCategory() { return averageQuestionsPerCategory; }
        public void setAverageQuestionsPerCategory(double averageQuestionsPerCategory) { this.averageQuestionsPerCategory = averageQuestionsPerCategory; }
    }
}