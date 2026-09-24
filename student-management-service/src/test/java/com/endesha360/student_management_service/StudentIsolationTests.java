package com.endesha360.student_management_service;

import com.endesha360.student_management_service.config.SecurityConfig;
import com.endesha360.student_management_service.controller.*;
import com.endesha360.student_management_service.entity.*;
import com.endesha360.student_management_service.repository.*;
import com.endesha360.student_management_service.security.*;
import com.endesha360.student_management_service.service.*;
import com.endesha360.student_management_service.client.TestServiceClient;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import java.util.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(controllers = {StudentController.class, StudentEnrollmentController.class,
        StudentFeedbackController.class, StudentProgressController.class}, properties = {
        "app.jwt.secret=0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
        "spring.cloud.discovery.enabled=false"})
@Import({SecurityConfig.class, JwtAuthenticationFilter.class, JwtAuthenticationEntryPoint.class,
        JwtTokenService.class, StudentAccess.class, StudentService.class, StudentEnrollmentService.class,
        StudentFeedbackService.class, StudentProgressService.class})
class StudentIsolationTests {
    private static final String SECRET = "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef";
    @Autowired MockMvc mvc;
    @MockitoBean StudentRepository students;
    @MockitoBean StudentEnrollmentRepository enrollments;
    @MockitoBean StudentFeedbackRepository feedback;
    @MockitoBean StudentProgressRepository progress;
    @MockitoBean TestServiceClient exams;

    String token(String tenant, Long userId, String role) {
        return Jwts.builder().setSubject("test-user").claim("userId", userId)
                .claim("tenantCode", tenant).claim("roles", List.of(role))
                .claim("permissions", List.of()).setExpiration(new Date(System.currentTimeMillis() + 60000))
                .signWith(Keys.hmacShaKeyFor(SECRET.getBytes()), SignatureAlgorithm.HS512).compact();
    }
    String auth(String role) { return "Bearer " + token("A", 10L, role); }

    @BeforeEach void records() {
        var own = Student.builder().id(1L).userId(10L).tenantCode("A").instructorUserId(20L).build();
        var other = Student.builder().id(2L).userId(11L).tenantCode("A").instructorUserId(21L).build();
        when(students.findByIdAndTenantCode(1L, "A")).thenReturn(Optional.of(own));
        when(students.findByIdAndTenantCode(2L, "A")).thenReturn(Optional.of(other));
        when(students.findByUserIdAndTenantCode(10L, "A")).thenReturn(Optional.of(own));
        when(enrollments.findById(9L)).thenReturn(Optional.of(StudentEnrollment.builder().id(9L).studentId(3L).build()));
        when(feedback.findById(9L)).thenReturn(Optional.of(StudentFeedback.builder().id(9L).studentId(3L).build()));
        when(progress.findById(9L)).thenReturn(Optional.of(StudentProgress.builder().id(9L).studentId(3L).build()));
    }

    @Test void anonymousAndInvalidTokensAreRejected() throws Exception {
        mvc.perform(get("/api/students")).andExpect(status().isUnauthorized());
        mvc.perform(get("/api/students").header("Authorization", "Bearer invalid")).andExpect(status().isUnauthorized());
        String expired = Jwts.builder().setSubject("x").setExpiration(new Date(0))
                .signWith(Keys.hmacShaKeyFor(SECRET.getBytes())).compact();
        mvc.perform(get("/api/students").header("Authorization", "Bearer " + expired)).andExpect(status().isUnauthorized());
    }
    @Test void missingSchoolOrUserAndUnknownRoleAreRejected() throws Exception {
        for (String jwt : List.of(token(null, 10L, "SCHOOL_OWNER"), token("A", null, "SCHOOL_OWNER"), token("A", 10L, "ADMIN"))) {
            mvc.perform(get("/api/students").header("Authorization", "Bearer " + jwt)).andExpect(status().isForbidden());
        }
        verify(students, never()).findVisible(any(), any(), any());
    }
    @Test void studentCanReadSelfButNotPeersOrOtherSchool() throws Exception {
        mvc.perform(get("/api/students/1").header("Authorization", auth("STUDENT"))).andExpect(status().isOk());
        mvc.perform(get("/api/students/2").header("Authorization", auth("STUDENT"))).andExpect(status().isForbidden());
        mvc.perform(get("/api/students/1").header("Authorization", "Bearer " + token("B", 10L, "STUDENT")))
                .andExpect(status().isNotFound());
    }
    @Test void ownerCannotReadDeleteOrOverwriteForeignStudent() throws Exception {
        mvc.perform(get("/api/students/3").header("Authorization", auth("SCHOOL_OWNER"))).andExpect(status().isNotFound());
        mvc.perform(delete("/api/students/3").header("Authorization", auth("SCHOOL_OWNER"))).andExpect(status().isNotFound());
        mvc.perform(post("/api/students").header("Authorization", auth("SCHOOL_OWNER"))
                .contentType("application/json").content("{\"id\":3,\"userId\":30}"))
                .andExpect(status().isNotFound());
        verify(students, never()).save(any());
        verify(students, never()).delete(any(Student.class));
    }
    @Test void ownerCreationUsesSignedSchoolAndCannotRebindUser() throws Exception {
        when(students.save(any())).thenAnswer(invocation -> invocation.getArgument(0));
        mvc.perform(post("/api/students").header("Authorization", auth("SCHOOL_OWNER"))
                .contentType("application/json").content("{\"userId\":40,\"tenantCode\":\"B\"}"))
                .andExpect(status().isOk()).andExpect(jsonPath("$.tenantCode").value("A"));
        mvc.perform(post("/api/students").header("Authorization", auth("SCHOOL_OWNER"))
                .contentType("application/json").content("{\"id\":1,\"userId\":99}"))
                .andExpect(status().isBadRequest());
    }
    @Test void instructorCanReadOnlyAssignedStudent() throws Exception {
        String header = "Bearer " + token("A", 20L, "INSTRUCTOR");
        mvc.perform(get("/api/students/1").header("Authorization", header)).andExpect(status().isOk());
        mvc.perform(get("/api/students/2").header("Authorization", header)).andExpect(status().isForbidden());
        mvc.perform(delete("/api/students/1").header("Authorization", header)).andExpect(status().isForbidden());
    }
    @Test void listsAreScopedForEveryRole() throws Exception {
        mvc.perform(get("/api/students").header("Authorization", auth("STUDENT"))).andExpect(status().isOk());
        verify(students).findVisible("A", 10L, null);
        mvc.perform(get("/api/students").header("Authorization", auth("SCHOOL_OWNER"))).andExpect(status().isOk());
        verify(students).findVisible("A", null, null);
        mvc.perform(get("/api/students").header("Authorization", auth("INSTRUCTOR"))).andExpect(status().isOk());
        verify(students).findVisible("A", null, 10L);
    }
    @ParameterizedTest @ValueSource(strings={"student-enrollments", "student-feedback", "student-progress"})
    void relatedRecordsCannotBypassSchoolChecks(String resource) throws Exception {
        String base = "/api/" + resource;
        mvc.perform(get(base + "/student/3").header("Authorization", auth("SCHOOL_OWNER"))).andExpect(status().isNotFound());
        mvc.perform(get(base + "/9").header("Authorization", auth("SCHOOL_OWNER"))).andExpect(status().isNotFound());
        mvc.perform(delete(base + "/9").header("Authorization", auth("SCHOOL_OWNER"))).andExpect(status().isNotFound());
        mvc.perform(post(base).header("Authorization", auth("SCHOOL_OWNER"))
                .contentType("application/json").content("{\"id\":9,\"studentId\":1,\"courseId\":1}"))
                .andExpect(status().isNotFound());
        mvc.perform(post(base).header("Authorization", auth("SCHOOL_OWNER"))
                .contentType("application/json").content("{\"studentId\":3,\"courseId\":1}"))
                .andExpect(status().isNotFound());
        verify(enrollments, never()).save(any());
        verify(feedback, never()).save(any());
        verify(progress, never()).save(any());
    }
    @Test void courseListsAreScoped() throws Exception {
        for (String resource : List.of("student-enrollments", "student-feedback", "student-progress"))
            mvc.perform(get("/api/" + resource + "/course/7").header("Authorization", auth("STUDENT"))).andExpect(status().isOk());
        verify(enrollments).findVisibleByCourse(7L, "A", 10L, null);
        verify(feedback).findVisibleByCourse(7L, "A", 10L, null);
        verify(progress).findVisibleByCourse(7L, "A", 10L, null);
    }
    @Test void studentCannotWriteScoresEnrollOrDelete() throws Exception {
        for (String resource : List.of("students", "student-enrollments", "student-progress", "student-progress/update-after-exam"))
            mvc.perform(post("/api/" + resource).header("Authorization", auth("STUDENT"))
                    .contentType("application/json").content("{\"studentId\":1,\"score\":100}"))
                    .andExpect(status().isForbidden());
        mvc.perform(delete("/api/student-feedback/9").header("Authorization", auth("STUDENT")))
                .andExpect(status().isForbidden());
        verify(progress, never()).save(any());
    }
    @Test void feedbackIsLimitedToAccessibleStudents() throws Exception {
        when(feedback.save(any())).thenAnswer(invocation -> invocation.getArgument(0));
        mvc.perform(post("/api/student-feedback").header("Authorization", auth("STUDENT"))
                .contentType("application/json").content("{\"studentId\":1,\"feedbackText\":\"Good\"}"))
                .andExpect(status().isOk());
        mvc.perform(post("/api/student-feedback").header("Authorization", auth("STUDENT"))
                .contentType("application/json").content("{\"studentId\":2}"))
                .andExpect(status().isForbidden());
    }
    @Test void instructorCanRecordProgressForAssignedStudentOnly() throws Exception {
        String header = "Bearer " + token("A", 20L, "INSTRUCTOR");
        when(progress.save(any())).thenAnswer(invocation -> invocation.getArgument(0));
        mvc.perform(post("/api/student-progress").header("Authorization", header)
                .contentType("application/json").content("{\"studentId\":1,\"courseId\":1,\"score\":80}"))
                .andExpect(status().isOk());
        mvc.perform(post("/api/student-progress/update-after-exam").header("Authorization", header)
                .contentType("application/json").content("{\"studentId\":2,\"score\":80}"))
                .andExpect(status().isForbidden());
    }
    @Test void comprehensiveProgressChecksOwnershipBeforeCallingExamService() throws Exception {
        mvc.perform(get("/api/student-progress/comprehensive/student/3").header("Authorization", auth("SCHOOL_OWNER")))
                .andExpect(status().isNotFound());
        verifyNoInteractions(exams);
        mvc.perform(get("/api/student-progress/comprehensive/me").header("Authorization", auth("STUDENT")))
                .andExpect(status().isOk());
        verify(progress).findByStudentId(1L);
        verify(exams).getStudentTestResults(10L);
    }
}
