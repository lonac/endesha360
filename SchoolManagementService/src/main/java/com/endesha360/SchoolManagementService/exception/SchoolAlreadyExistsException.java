package com.endesha360.SchoolManagementService.exception;

public class SchoolAlreadyExistsException extends RuntimeException {
    
    public SchoolAlreadyExistsException(String message) {
        super(message);
    }
    
    public SchoolAlreadyExistsException(String message, Throwable cause) {
        super(message, cause);
    }
}
