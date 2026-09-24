package com.endesha360.student_management_service.security;

public record StudentPrincipal(Long userId, String tenantCode, String username) {}
