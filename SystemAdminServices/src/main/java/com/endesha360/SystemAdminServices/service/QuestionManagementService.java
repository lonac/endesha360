package com.endesha360.SystemAdminServices.service;

import com.endesha360.SystemAdminServices.client.QuestionsServiceClient;
import com.endesha360.SystemAdminServices.dto.*;
import feign.FeignException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.ArrayList;

/**
 * Service for managing questions through SystemAdminServices using OpenFeign
 * Communicates with questions-service via Feign client for professional microservices architecture
 */
@Service
public class QuestionManagementService {

    private static final Logger logger = LoggerFactory.getLogger(QuestionManagementService.class);

    @Autowired
    private QuestionsServiceClient questionsServiceClient;

    /**
     * Retrieve paginated questions with optional filtering (overloaded for controller compatibility)
     */
    public Page<QuestionDTO> getAllQuestions(int page, int size, String sort, String direction) {
        return getAllQuestions(page, size, sort, direction, null, null);
    }

    /**
     * Retrieve paginated questions with optional filtering
     */
    public Page<QuestionDTO> getAllQuestions(int page, int size, String sort, String direction, 
                                           String search, Long categoryId) {
        try {
            logger.info("Fetching questions via Feign - page: {}, size: {}, sort: {}, direction: {}, search: {}, categoryId: {}", 
                       page, size, sort, direction, search, categoryId);
            return questionsServiceClient.getAllQuestions(page, size, sort, direction, search, categoryId);
        } catch (FeignException e) {
            logger.error("Feign error fetching questions from questions-service: {}", e.getMessage());
            throw new RuntimeException("Failed to fetch questions: " + e.getMessage());
        }
    }

    /**
     * Create a new question (overloaded for controller compatibility)
     */
    public QuestionDTO createQuestion(QuestionDTO questionDTO, String token) {
        return createQuestion(questionDTO);
    }

    /**
     * Create a new question
     */
    public QuestionDTO createQuestion(QuestionDTO questionDTO) {
        try {
            logger.info("Creating new question via Feign: {}", questionDTO.getQuestionText());
            return questionsServiceClient.createQuestion(questionDTO);
        } catch (FeignException e) {
            logger.error("Feign error creating question: {}", e.getMessage());
            throw new RuntimeException("Failed to create question: " + e.getMessage());
        }
    }

    /**
     * Get question by ID
     */
    public QuestionDTO getQuestionById(Long id) {
        try {
            logger.info("Fetching question by ID via Feign: {}", id);
            return questionsServiceClient.getQuestionById(id);
        } catch (FeignException.NotFound e) {
            logger.error("Question not found with ID: {}", id);
            throw new RuntimeException("Question not found with ID: " + id);
        } catch (FeignException e) {
            logger.error("Feign error fetching question by ID {}: {}", id, e.getMessage());
            throw new RuntimeException("Failed to fetch question: " + e.getMessage());
        }
    }

    /**
     * Update existing question (overloaded for controller compatibility)
     */
    public QuestionDTO updateQuestion(Long id, QuestionDTO questionDTO, String token) {
        return updateQuestion(id, questionDTO);
    }

    /**
     * Update existing question
     */
    public QuestionDTO updateQuestion(Long id, QuestionDTO questionDTO) {
        try {
            logger.info("Updating question with ID via Feign: {}", id);
            return questionsServiceClient.updateQuestion(id, questionDTO);
        } catch (FeignException.NotFound e) {
            logger.error("Question not found for update with ID: {}", id);
            throw new RuntimeException("Question not found with ID: " + id);
        } catch (FeignException e) {
            logger.error("Feign error updating question with ID {}: {}", id, e.getMessage());
            throw new RuntimeException("Failed to update question: " + e.getMessage());
        }
    }

    /**
     * Delete question by ID (overloaded for controller compatibility)
     */
    public void deleteQuestion(Long id, String token) {
        deleteQuestion(id);
    }

    /**
     * Delete question by ID
     */
    public void deleteQuestion(Long id) {
        try {
            logger.info("Deleting question with ID via Feign: {}", id);
            questionsServiceClient.deleteQuestion(id);
        } catch (FeignException.NotFound e) {
            logger.error("Question not found for deletion with ID: {}", id);
            throw new RuntimeException("Question not found with ID: " + id);
        } catch (FeignException e) {
            logger.error("Feign error deleting question with ID {}: {}", id, e.getMessage());
            throw new RuntimeException("Failed to delete question: " + e.getMessage());
        }
    }

    /**
     * Bulk upload questions with proper error handling (overloaded for controller compatibility)
     */
    public BulkQuestionUploadResponse bulkUploadQuestions(BulkQuestionUploadRequest request, String token) {
        return bulkUploadQuestions(request);
    }

    /**
     * Bulk upload questions with proper error handling
     */
    public BulkQuestionUploadResponse bulkUploadQuestions(BulkQuestionUploadRequest request) {
        logger.info("Starting bulk upload of {} questions via Feign", request.getQuestions().size());
        
        BulkQuestionUploadResponse response = new BulkQuestionUploadResponse();
        List<String> errors = new ArrayList<>();
        List<QuestionDTO> successfullyCreated = new ArrayList<>();
        
        try {
            // Use Feign client for bulk creation
            List<QuestionDTO> createdQuestions = questionsServiceClient.bulkCreateQuestions(request.getQuestions());
            successfullyCreated.addAll(createdQuestions);
            
            response.setTotalProcessed(request.getQuestions().size());
            response.setSuccessfullyCreated(successfullyCreated.size());
            response.setCreatedQuestions(successfullyCreated);
            response.setErrorMessages(errors);
            
            logger.info("Bulk upload completed via Feign - Total: {}, Successful: {}, Errors: {}", 
                       response.getTotalProcessed(), response.getSuccessfullyCreated(), errors.size());
            
        } catch (FeignException e) {
            logger.error("Feign error during bulk upload: {}", e.getMessage());
            errors.add("Bulk upload failed: " + e.getMessage());
            
            response.setTotalProcessed(request.getQuestions().size());
            response.setSuccessfullyCreated(0);
            response.setCreatedQuestions(new ArrayList<>());
            response.setErrorMessages(errors);
        }
        
        return response;
    }

    /**
     * Get available question categories
     */
    public List<QuestionsServiceClient.CategoryDTO> getCategories() {
        try {
            logger.info("Fetching question categories via Feign");
            return questionsServiceClient.getCategories();
        } catch (FeignException e) {
            logger.error("Feign error fetching categories: {}", e.getMessage());
            throw new RuntimeException("Failed to fetch categories: " + e.getMessage());
        }
    }

    /**
     * Get available question categories (alias method for controller compatibility)
     */
    public List<QuestionsServiceClient.CategoryDTO> getQuestionCategories() {
        return getCategories();
    }

    /**
     * Get available question levels
     */
    public List<String> getQuestionLevels() {
        try {
            logger.info("Fetching question levels via Feign");
            List<QuestionsServiceClient.LevelDTO> levels = questionsServiceClient.getLevels();
            return levels.stream().map(QuestionsServiceClient.LevelDTO::getName).toList();
        } catch (Exception e) {
            logger.error("Feign error fetching levels from questions-service: {}", e.getMessage());
            // Fallback to mock implementation
            List<String> levels = new ArrayList<>();
            levels.add("BEGINNER");
            levels.add("INTERMEDIATE");
            levels.add("ADVANCED");
            return levels;
        }
    }

    /**
     * Get question statistics
     */
    public QuestionStatisticsDTO getQuestionStatistics() {
        try {
            logger.info("Fetching question statistics via Feign");
            QuestionsServiceClient.QuestionStatisticsDTO stats = questionsServiceClient.getQuestionStatistics();
            
            // Convert to our internal DTO
            return new QuestionStatisticsDTO(
                stats.getTotalQuestions(),
                stats.getTotalCategories(),
                stats.getQuestionsThisMonth(),
                stats.getAverageQuestionsPerCategory()
            );
        } catch (FeignException e) {
            logger.error("Feign error fetching question statistics: {}", e.getMessage());
            throw new RuntimeException("Failed to fetch statistics: " + e.getMessage());
        }
    }
}
