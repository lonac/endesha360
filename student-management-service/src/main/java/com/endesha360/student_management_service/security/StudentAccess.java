package com.endesha360.student_management_service.security;

import com.endesha360.student_management_service.entity.Student;
import com.endesha360.student_management_service.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

@Component
@RequiredArgsConstructor
public class StudentAccess {
    private final StudentRepository students;

    public StudentPrincipal principal() {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || !(auth.getPrincipal() instanceof StudentPrincipal p)
                || p.userId() == null || p.tenantCode() == null || p.tenantCode().isBlank()) {
            throw new AccessDeniedException("A school-scoped account is required");
        }
        return p;
    }

    public boolean hasRole(String role) {
        principal();
        return SecurityContextHolder.getContext().getAuthentication().getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_" + role));
    }

    public void owner() {
        if (!hasRole("SCHOOL_OWNER")) throw new AccessDeniedException("School owner required");
    }

    public void teacher() {
        if (!hasRole("SCHOOL_OWNER") && !hasRole("INSTRUCTOR"))
            throw new AccessDeniedException("School owner or assigned instructor required");
    }

    public Student requireStudent(Long id) {
        var p = principal();
        if (id == null) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Student is required");
        Student student = students.findByIdAndTenantCode(id, p.tenantCode())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Student not found"));
        boolean allowed = hasRole("SCHOOL_OWNER")
                || (hasRole("INSTRUCTOR") && p.userId().equals(student.getInstructorUserId()))
                || (hasRole("STUDENT") && p.userId().equals(student.getUserId()));
        if (!allowed) throw new AccessDeniedException("Student access denied");
        return student;
    }

    public Long readerUserId() {
        if (hasRole("SCHOOL_OWNER")) return null;
        if (hasRole("STUDENT")) return principal().userId();
        if (hasRole("INSTRUCTOR")) return null;
        throw new AccessDeniedException("Student access denied");
    }

    public Long readerInstructorId() {
        return !hasRole("SCHOOL_OWNER") && !hasRole("STUDENT") && hasRole("INSTRUCTOR")
                ? principal().userId() : null;
    }
}
