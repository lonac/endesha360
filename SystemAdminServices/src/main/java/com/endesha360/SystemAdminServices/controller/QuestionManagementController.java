package com.endesha360.SystemAdminServices.controller;

import com.endesha360.SystemAdminServices.dto.*;
import com.endesha360.SystemAdminServices.service.QuestionManagementService;
import com.endesha360.SystemAdminServices.client.QuestionsServiceClient;
import com.endesha360.SystemAdminServices.util.JwtUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.List;

/**
 * Controller for question management operations by system administrators
 */
@RestController
@RequestMapping("/api/admin/questions")
@CrossOrigin(origins = "*")
@Tag(name = "Question Management", description = "System admin question management endpoints")
@SecurityRequirement(name = "bearerAuth")
public class QuestionManagementController {
    
    private static final Logger logger = LoggerFactory.getLogger(QuestionManagementController.class);
    
    @Autowired
    private QuestionManagementService questionManagementService;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    /**
     * Get all questions with pagination
     */
    @GetMapping
    @Operation(summary = "Get all questions", description = "Retrieve all questions with pagination")
    @PreAuthorize("hasAuthority('VIEW_QUESTIONS') or hasAuthority('MANAGE_QUESTIONS')")
    public ResponseEntity<Map<String, Object>> getAllQuestions(
            @Parameter(description = "Page number (0-based)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size") @RequestParam(defaultValue = "20") int size,
            @Parameter(description = "Sort field") @RequestParam(defaultValue = "id") String sortBy,
            @Parameter(description = "Sort direction") @RequestParam(defaultValue = "desc") String sortDir) {
        
        try {
            Page<QuestionDTO> questionsPage = questionManagementService.getAllQuestions(page, size, sortBy, sortDir);
            
            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("message", "Questions retrieved successfully");
            result.put("data", questionsPage);
            
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            logger.error("Error fetching questions: ", e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to fetch questions: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
    
    /**
     * Get question by ID
     */
    @GetMapping("/{questionId}")
    @Operation(summary = "Get question by ID", description = "Retrieve a specific question by its ID")
    @PreAuthorize("hasAuthority('VIEW_QUESTIONS') or hasAuthority('MANAGE_QUESTIONS')")
    public ResponseEntity<Map<String, Object>> getQuestionById(@PathVariable Long questionId) {
        try {
            QuestionDTO question = questionManagementService.getQuestionById(questionId);
            
            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("message", "Question retrieved successfully");
            result.put("data", question);
            
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            logger.error("Error fetching question by ID: ", e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to fetch question: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
    
    /**
     * Create a new question
     */
    @PostMapping
    @Operation(summary = "Create question", description = "Create a new question")
    @PreAuthorize("hasAuthority('MANAGE_QUESTIONS')")
    public ResponseEntity<Map<String, Object>> createQuestion(
            @Valid @RequestBody QuestionDTO questionDTO,
            HttpServletRequest request) {
        
        try {
            String adminUsername = extractAdminUsername(request);
            QuestionDTO createdQuestion = questionManagementService.createQuestion(questionDTO, adminUsername);
            
            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("message", "Question created successfully");
            result.put("data", createdQuestion);
            
            return ResponseEntity.status(HttpStatus.CREATED).body(result);
            
        } catch (Exception e) {
            logger.error("Error creating question: ", e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to create question: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
    
    /**
     * Update an existing question
     */
    @PutMapping("/{questionId}")
    @Operation(summary = "Update question", description = "Update an existing question")
    @PreAuthorize("hasAuthority('MANAGE_QUESTIONS')")
    public ResponseEntity<Map<String, Object>> updateQuestion(
            @PathVariable Long questionId,
            @Valid @RequestBody QuestionDTO questionDTO,
            HttpServletRequest request) {
        
        try {
            String adminUsername = extractAdminUsername(request);
            QuestionDTO updatedQuestion = questionManagementService.updateQuestion(questionId, questionDTO, adminUsername);
            
            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("message", "Question updated successfully");
            result.put("data", updatedQuestion);
            
            return ResponseEntity.ok(result);
            
        } catch (Exception e) {
            logger.error("Error updating question: ", e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to update question: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
    
    /**
     * Delete a question
     */
    @DeleteMapping("/{questionId}")
    @Operation(summary = "Delete question", description = "Delete a question")
    @PreAuthorize("hasAuthority('MANAGE_QUESTIONS')")
    public ResponseEntity<Map<String, Object>> deleteQuestion(
            @PathVariable Long questionId,
            HttpServletRequest request) {
        
        try {
            String adminUsername = extractAdminUsername(request);
            questionManagementService.deleteQuestion(questionId, adminUsername);
            
            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("message", "Question deleted successfully");
            
            return ResponseEntity.ok(result);
            
        } catch (Exception e) {
            logger.error("Error deleting question: ", e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to delete question: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
    
    /**
     * Bulk upload questions
     */
    @PostMapping("/bulk-upload")
    @Operation(summary = "Bulk upload questions", description = "Upload multiple questions at once")
    @PreAuthorize("hasAuthority('BULK_UPLOAD_QUESTIONS') or hasAuthority('MANAGE_QUESTIONS')")
    public ResponseEntity<Map<String, Object>> bulkUploadQuestions(
            @Valid @RequestBody BulkQuestionUploadRequest request,
            HttpServletRequest httpRequest) {
        
        try {
            String adminUsername = extractAdminUsername(httpRequest);
            BulkQuestionUploadResponse uploadResponse = questionManagementService.bulkUploadQuestions(request, adminUsername);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", uploadResponse.isSuccess());
            response.put("message", uploadResponse.getMessage());
            response.put("uploadDetails", uploadResponse);
            
            HttpStatus status = uploadResponse.isSuccess() ? HttpStatus.OK : HttpStatus.PARTIAL_CONTENT;
            return ResponseEntity.status(status).body(response);
            
        } catch (Exception e) {
            logger.error("Error in bulk upload: ", e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Bulk upload failed: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
    
    /**
     * Get question statistics
     */
    @GetMapping("/statistics")
    @Operation(summary = "Get question statistics", description = "Retrieve question statistics and analytics")
    @PreAuthorize("hasAuthority('VIEW_QUESTIONS') or hasAuthority('MANAGE_QUESTIONS')")
    public ResponseEntity<Map<String, Object>> getQuestionStatistics() {
        try {
            QuestionStatisticsDTO stats = questionManagementService.getQuestionStatistics();
            
            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("message", "Statistics retrieved successfully");
            result.put("data", stats);
            
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            logger.error("Error fetching question statistics: ", e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to fetch statistics: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
    
    /**
     * Get question categories
     */
    @GetMapping("/categories")
    @Operation(summary = "Get question categories", description = "Retrieve all available question categories")
    @PreAuthorize("hasAuthority('VIEW_QUESTIONS') or hasAuthority('MANAGE_QUESTIONS')")
    public ResponseEntity<Map<String, Object>> getQuestionCategories() {
        try {
            List<QuestionsServiceClient.CategoryDTO> categories = questionManagementService.getQuestionCategories();
            
            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("message", "Categories retrieved successfully");
            result.put("data", categories);
            
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            logger.error("Error fetching question categories: ", e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to fetch categories: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
    
    /**
     * Get question levels
     */
    @GetMapping("/levels")
    @Operation(summary = "Get question levels", description = "Retrieve all available question difficulty levels")
    @PreAuthorize("hasAuthority('VIEW_QUESTIONS') or hasAuthority('MANAGE_QUESTIONS')")
    public ResponseEntity<Map<String, Object>> getQuestionLevels() {
        try {
            List<String> levels = questionManagementService.getQuestionLevels();
            
            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("message", "Levels retrieved successfully");
            result.put("data", levels);
            
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            logger.error("Error fetching question levels: ", e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to fetch levels: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
    
    /**
     * Extract admin username from JWT token
     */
    private String extractAdminUsername(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            return jwtUtil.getUsernameFromToken(token);
        }
        throw new RuntimeException("No valid authentication token found");
    }
}
