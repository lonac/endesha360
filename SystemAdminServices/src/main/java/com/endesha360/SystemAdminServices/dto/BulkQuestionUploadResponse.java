package com.endesha360.SystemAdminServices.dto;

import java.time.LocalDateTime;
import java.util.List;

/**
 * DTO for bulk question upload response
 */
public class BulkQuestionUploadResponse {
    
    private boolean success;
    private String message;
    private int totalProcessed;
    private int successfullyCreated;
    private int failedUploads;
    private List<QuestionUploadError> errors;
    private List<String> errorMessages;
    private List<QuestionDTO> createdQuestions;
    private LocalDateTime uploadTimestamp;
    private String uploadedBy;
    
    // Constructors
    public BulkQuestionUploadResponse() {
        this.uploadTimestamp = LocalDateTime.now();
    }
    
    public BulkQuestionUploadResponse(boolean success, String message, int totalProcessed, 
                                    int successfullyCreated, int failedUploads) {
        this();
        this.success = success;
        this.message = message;
        this.totalProcessed = totalProcessed;
        this.successfullyCreated = successfullyCreated;
        this.failedUploads = failedUploads;
    }
    
    // Getters and Setters
    public boolean isSuccess() {
        return success;
    }
    
    public void setSuccess(boolean success) {
        this.success = success;
    }
    
    public String getMessage() {
        return message;
    }
    
    public void setMessage(String message) {
        this.message = message;
    }
    
    public int getTotalProcessed() {
        return totalProcessed;
    }
    
    public void setTotalProcessed(int totalProcessed) {
        this.totalProcessed = totalProcessed;
    }
    
    public int getSuccessfullyCreated() {
        return successfullyCreated;
    }
    
    public void setSuccessfullyCreated(int successfullyCreated) {
        this.successfullyCreated = successfullyCreated;
    }
    
    public int getFailedUploads() {
        return failedUploads;
    }
    
    public void setFailedUploads(int failedUploads) {
        this.failedUploads = failedUploads;
    }
    
    public List<QuestionUploadError> getErrors() {
        return errors;
    }
    
    public void setErrors(List<QuestionUploadError> errors) {
        this.errors = errors;
    }
    
    public List<String> getErrorMessages() {
        return errorMessages;
    }
    
    public void setErrorMessages(List<String> errorMessages) {
        this.errorMessages = errorMessages;
    }
    
    public List<QuestionDTO> getCreatedQuestions() {
        return createdQuestions;
    }
    
    public void setCreatedQuestions(List<QuestionDTO> createdQuestions) {
        this.createdQuestions = createdQuestions;
    }
    
    public LocalDateTime getUploadTimestamp() {
        return uploadTimestamp;
    }
    
    public void setUploadTimestamp(LocalDateTime uploadTimestamp) {
        this.uploadTimestamp = uploadTimestamp;
    }
    
    public String getUploadedBy() {
        return uploadedBy;
    }
    
    public void setUploadedBy(String uploadedBy) {
        this.uploadedBy = uploadedBy;
    }
    
    /**
     * Inner class for upload error details
     */
    public static class QuestionUploadError {
        private int questionIndex;
        private String questionText;
        private String errorMessage;
        private String fieldName;
        
        public QuestionUploadError() {}
        
        public QuestionUploadError(int questionIndex, String questionText, String errorMessage) {
            this.questionIndex = questionIndex;
            this.questionText = questionText;
            this.errorMessage = errorMessage;
        }
        
        // Getters and Setters
        public int getQuestionIndex() {
            return questionIndex;
        }
        
        public void setQuestionIndex(int questionIndex) {
            this.questionIndex = questionIndex;
        }
        
        public String getQuestionText() {
            return questionText;
        }
        
        public void setQuestionText(String questionText) {
            this.questionText = questionText;
        }
        
        public String getErrorMessage() {
            return errorMessage;
        }
        
        public void setErrorMessage(String errorMessage) {
            this.errorMessage = errorMessage;
        }
        
        public String getFieldName() {
            return fieldName;
        }
        
        public void setFieldName(String fieldName) {
            this.fieldName = fieldName;
        }
    }
    
    @Override
    public String toString() {
        return "BulkQuestionUploadResponse{" +
                "success=" + success +
                ", message='" + message + '\'' +
                ", totalProcessed=" + totalProcessed +
                ", successfullyCreated=" + successfullyCreated +
                ", failedUploads=" + failedUploads +
                ", uploadTimestamp=" + uploadTimestamp +
                ", uploadedBy='" + uploadedBy + '\'' +
                '}';
    }
}
