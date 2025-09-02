package com.endesha360.SystemAdminServices.dto;

/**
 * DTO for question statistics
 */
public class QuestionStatisticsDTO {
    
    private long totalQuestions;
    private long totalCategories;
    private long questionsThisMonth;
    private double averageQuestionsPerCategory;
    private long activeQuestions;
    private long inactiveQuestions;
    private long questionsWithImages;
    private long questionsWithoutImages;
    private long questionsByCategory;
    private long questionsByLevel;
    private String mostUsedCategory;
    private String mostUsedLevel;
    private double averageOptionsPerQuestion;
    
    // Constructors
    public QuestionStatisticsDTO() {}
    
    public QuestionStatisticsDTO(long totalQuestions, long totalCategories, long questionsThisMonth, double averageQuestionsPerCategory) {
        this.totalQuestions = totalQuestions;
        this.totalCategories = totalCategories;
        this.questionsThisMonth = questionsThisMonth;
        this.averageQuestionsPerCategory = averageQuestionsPerCategory;
    }
    
    // Getters and Setters
    public long getTotalQuestions() {
        return totalQuestions;
    }
    
    public void setTotalQuestions(long totalQuestions) {
        this.totalQuestions = totalQuestions;
    }
    
    public long getTotalCategories() {
        return totalCategories;
    }
    
    public void setTotalCategories(long totalCategories) {
        this.totalCategories = totalCategories;
    }
    
    public long getQuestionsThisMonth() {
        return questionsThisMonth;
    }
    
    public void setQuestionsThisMonth(long questionsThisMonth) {
        this.questionsThisMonth = questionsThisMonth;
    }
    
    public double getAverageQuestionsPerCategory() {
        return averageQuestionsPerCategory;
    }
    
    public void setAverageQuestionsPerCategory(double averageQuestionsPerCategory) {
        this.averageQuestionsPerCategory = averageQuestionsPerCategory;
    }
    
    public long getActiveQuestions() {
        return activeQuestions;
    }
    
    public void setActiveQuestions(long activeQuestions) {
        this.activeQuestions = activeQuestions;
    }
    
    public long getInactiveQuestions() {
        return inactiveQuestions;
    }
    
    public void setInactiveQuestions(long inactiveQuestions) {
        this.inactiveQuestions = inactiveQuestions;
    }
    
    public long getQuestionsWithImages() {
        return questionsWithImages;
    }
    
    public void setQuestionsWithImages(long questionsWithImages) {
        this.questionsWithImages = questionsWithImages;
    }
    
    public long getQuestionsWithoutImages() {
        return questionsWithoutImages;
    }
    
    public void setQuestionsWithoutImages(long questionsWithoutImages) {
        this.questionsWithoutImages = questionsWithoutImages;
    }
    
    public long getQuestionsByCategory() {
        return questionsByCategory;
    }
    
    public void setQuestionsByCategory(long questionsByCategory) {
        this.questionsByCategory = questionsByCategory;
    }
    
    public long getQuestionsByLevel() {
        return questionsByLevel;
    }
    
    public void setQuestionsByLevel(long questionsByLevel) {
        this.questionsByLevel = questionsByLevel;
    }
    
    public String getMostUsedCategory() {
        return mostUsedCategory;
    }
    
    public void setMostUsedCategory(String mostUsedCategory) {
        this.mostUsedCategory = mostUsedCategory;
    }
    
    public String getMostUsedLevel() {
        return mostUsedLevel;
    }
    
    public void setMostUsedLevel(String mostUsedLevel) {
        this.mostUsedLevel = mostUsedLevel;
    }
    
    public double getAverageOptionsPerQuestion() {
        return averageOptionsPerQuestion;
    }
    
    public void setAverageOptionsPerQuestion(double averageOptionsPerQuestion) {
        this.averageOptionsPerQuestion = averageOptionsPerQuestion;
    }
    
    @Override
    public String toString() {
        return "QuestionStatisticsDTO{" +
                "totalQuestions=" + totalQuestions +
                ", activeQuestions=" + activeQuestions +
                ", inactiveQuestions=" + inactiveQuestions +
                ", questionsWithImages=" + questionsWithImages +
                ", mostUsedCategory='" + mostUsedCategory + '\'' +
                ", mostUsedLevel='" + mostUsedLevel + '\'' +
                '}';
    }
}
