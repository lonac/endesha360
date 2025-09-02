package com.endesha360.SystemAdminServices.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import java.util.List;

/**
 * DTO for bulk question upload requests
 */
public class BulkQuestionUploadRequest {
    
    @NotEmpty(message = "Questions list cannot be empty")
    @Size(max = 100, message = "Cannot upload more than 100 questions at once")
    @Valid
    private List<QuestionDTO> questions;
    
    private boolean validateBeforeUpload = true;
    
    private boolean replaceExisting = false;
    
    // Constructors
    public BulkQuestionUploadRequest() {}
    
    public BulkQuestionUploadRequest(List<QuestionDTO> questions) {
        this.questions = questions;
    }
    
    // Getters and Setters
    public List<QuestionDTO> getQuestions() {
        return questions;
    }
    
    public void setQuestions(List<QuestionDTO> questions) {
        this.questions = questions;
    }
    
    public boolean isValidateBeforeUpload() {
        return validateBeforeUpload;
    }
    
    public void setValidateBeforeUpload(boolean validateBeforeUpload) {
        this.validateBeforeUpload = validateBeforeUpload;
    }
    
    public boolean isReplaceExisting() {
        return replaceExisting;
    }
    
    public void setReplaceExisting(boolean replaceExisting) {
        this.replaceExisting = replaceExisting;
    }
    
    @Override
    public String toString() {
        return "BulkQuestionUploadRequest{" +
                "questionsCount=" + (questions != null ? questions.size() : 0) +
                ", validateBeforeUpload=" + validateBeforeUpload +
                ", replaceExisting=" + replaceExisting +
                '}';
    }
}
