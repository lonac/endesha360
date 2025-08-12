package com.endesha360.StudentManagementService.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "students")
public class Student {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "user_id", nullable = false, unique = true)
    private Long userId; // Reference to User Management Service
    
    @Column(name = "tenant_id", nullable = false)
    private Long tenantId;
    
    @NotBlank
    @Size(max = 100)
    @Column(name = "first_name", nullable = false)
    private String firstName;
    
    @NotBlank
    @Size(max = 100)
    @Column(name = "last_name", nullable = false)
    private String lastName;
    
    @Email
    @Column(name = "email", nullable = false, unique = true)
    private String email;
    
    @Pattern(regexp = "^\\+?[1-9]\\d{1,14}$")
    @Column(name = "phone_number")
    private String phoneNumber;
    
    @Past
    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;
    
    @Column(name = "address", length = 500)
    private String address;
    
    @Column(name = "emergency_contact_name")
    private String emergencyContactName;
    
    @Column(name = "emergency_contact_phone")
    private String emergencyContactPhone;
    
    @Column(name = "national_id")
    private String nationalId;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "license_type")
    private LicenseType licenseType;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "registration_status", nullable = false)
    private RegistrationStatus registrationStatus = RegistrationStatus.ACTIVE;
    
    @Column(name = "assigned_instructor_id")
    private Long assignedInstructorId; // Reference to Instructor Management Service
    
    @Column(name = "medical_certificate_valid")
    private Boolean medicalCertificateValid = false;
    
    @Column(name = "theory_test_passed")
    private Boolean theoryTestPassed = false;
    
    @Column(name = "practical_test_passed")
    private Boolean practicalTestPassed = false;
    
    @Column(name = "license_issued")
    private Boolean licenseIssued = false;
    
    @Column(name = "license_issue_date")
    private LocalDate licenseIssueDate;
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // One-to-Many relationships
    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<StudentProgress> progressRecords;
    
    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<StudentEnrollment> enrollments;
    
    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<StudentFeedback> feedbacks;
    
    // Constructors
    public Student() {}
    
    public Student(String firstName, String lastName, String email, Long userId, Long tenantId) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.userId = userId;
        this.tenantId = tenantId;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    
    public Long getTenantId() { return tenantId; }
    public void setTenantId(Long tenantId) { this.tenantId = tenantId; }
    
    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }
    
    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }
    
    public LocalDate getDateOfBirth() { return dateOfBirth; }
    public void setDateOfBirth(LocalDate dateOfBirth) { this.dateOfBirth = dateOfBirth; }
    
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    
    public String getEmergencyContactName() { return emergencyContactName; }
    public void setEmergencyContactName(String emergencyContactName) { this.emergencyContactName = emergencyContactName; }
    
    public String getEmergencyContactPhone() { return emergencyContactPhone; }
    public void setEmergencyContactPhone(String emergencyContactPhone) { this.emergencyContactPhone = emergencyContactPhone; }
    
    public String getNationalId() { return nationalId; }
    public void setNationalId(String nationalId) { this.nationalId = nationalId; }
    
    public LicenseType getLicenseType() { return licenseType; }
    public void setLicenseType(LicenseType licenseType) { this.licenseType = licenseType; }
    
    public RegistrationStatus getRegistrationStatus() { return registrationStatus; }
    public void setRegistrationStatus(RegistrationStatus registrationStatus) { this.registrationStatus = registrationStatus; }
    
    public Long getAssignedInstructorId() { return assignedInstructorId; }
    public void setAssignedInstructorId(Long assignedInstructorId) { this.assignedInstructorId = assignedInstructorId; }
    
    public Boolean getMedicalCertificateValid() { return medicalCertificateValid; }
    public void setMedicalCertificateValid(Boolean medicalCertificateValid) { this.medicalCertificateValid = medicalCertificateValid; }
    
    public Boolean getTheoryTestPassed() { return theoryTestPassed; }
    public void setTheoryTestPassed(Boolean theoryTestPassed) { this.theoryTestPassed = theoryTestPassed; }
    
    public Boolean getPracticalTestPassed() { return practicalTestPassed; }
    public void setPracticalTestPassed(Boolean practicalTestPassed) { this.practicalTestPassed = practicalTestPassed; }
    
    public Boolean getLicenseIssued() { return licenseIssued; }
    public void setLicenseIssued(Boolean licenseIssued) { this.licenseIssued = licenseIssued; }
    
    public LocalDate getLicenseIssueDate() { return licenseIssueDate; }
    public void setLicenseIssueDate(LocalDate licenseIssueDate) { this.licenseIssueDate = licenseIssueDate; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    public List<StudentProgress> getProgressRecords() { return progressRecords; }
    public void setProgressRecords(List<StudentProgress> progressRecords) { this.progressRecords = progressRecords; }
    
    public List<StudentEnrollment> getEnrollments() { return enrollments; }
    public void setEnrollments(List<StudentEnrollment> enrollments) { this.enrollments = enrollments; }
    
    public List<StudentFeedback> getFeedbacks() { return feedbacks; }
    public void setFeedbacks(List<StudentFeedback> feedbacks) { this.feedbacks = feedbacks; }
    
    public String getFullName() {
        return firstName + " " + lastName;
    }
}

// Enums
enum LicenseType {
    CLASS_A, CLASS_B, CLASS_C, MOTORCYCLE, COMMERCIAL
}

enum RegistrationStatus {
    ACTIVE, SUSPENDED, GRADUATED, DROPPED_OUT, PENDING
}