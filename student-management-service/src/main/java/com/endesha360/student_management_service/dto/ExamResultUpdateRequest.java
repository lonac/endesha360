package com.endesha360.student_management_service.dto;

import lombok.Data;

@Data
public class ExamResultUpdateRequest {
    private Long studentId;
    private Long courseId;
    private String moduleName;
    private Double score;
    private Boolean passed;
    private String notes;
}
