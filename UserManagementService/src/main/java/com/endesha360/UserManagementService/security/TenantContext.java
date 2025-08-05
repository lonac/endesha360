package com.endesha360.UserManagementService.security;

public class TenantContext {
    
    private static final ThreadLocal<String> currentTenant = new ThreadLocal<>();
    private static final ThreadLocal<Long> currentUserId = new ThreadLocal<>();
    
    public static void setCurrentTenant(String tenant) {
        currentTenant.set(tenant);
    }
    
    public static String getCurrentTenant() {
        return currentTenant.get();
    }
    
    public static void setCurrentUserId(Long userId) {
        currentUserId.set(userId);
    }
    
    public static Long getCurrentUserId() {
        return currentUserId.get();
    }
    
    public static void clear() {
        currentTenant.remove();
        currentUserId.remove();
    }
}
