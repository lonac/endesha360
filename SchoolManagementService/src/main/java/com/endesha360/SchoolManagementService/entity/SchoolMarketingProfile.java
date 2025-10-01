package com.endesha360.SchoolManagementService.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.vladmihalcea.hibernate.type.array.StringArrayType;
import com.vladmihalcea.hibernate.type.json.JsonType;
import org.hibernate.annotations.Type;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Entity
@Table(name = "school_marketing_profiles")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class SchoolMarketingProfile {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotNull(message = "School ID is required")
    @Column(name = "school_id", nullable = false, unique = true)
    private Long schoolId;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "school_id", insertable = false, updatable = false)
    private School school;
    
    // Course Offerings
    @Type(StringArrayType.class)
    @Column(name = "courses_offered", columnDefinition = "varchar[]")
    private String[] coursesOffered;
    
    @Type(StringArrayType.class)
    @Column(name = "license_types", columnDefinition = "varchar[]")
    private String[] licenseTypes;
    
    @Type(StringArrayType.class)
    @Column(name = "specializations", columnDefinition = "varchar[]")
    private String[] specializations;
    
    @Min(value = 1, message = "Course duration must be at least 1 week")
    @Max(value = 52, message = "Course duration must not exceed 52 weeks")
    @Column(name = "course_duration_weeks")
    private Integer courseDurationWeeks;
    
    // Facilities & Services
    @Min(value = 0, message = "Fleet size must be at least 0")
    @Column(name = "fleet_size")
    private Integer fleetSize = 0;
    
    @Column(name = "has_simulators")
    private Boolean hasSimulators = false;
    
    @Min(value = 0, message = "Simulator count must be at least 0")
    @Column(name = "simulator_count")
    private Integer simulatorCount = 0;
    
    @Min(value = 0, message = "Theory rooms count must be at least 0")
    @Column(name = "theory_rooms_count")
    private Integer theoryRoomsCount = 0;
    
    @Type(JsonType.class)
    @Column(name = "practical_vehicles", columnDefinition = "jsonb")
    private List<Map<String, Object>> practicalVehicles;
    
    @Min(value = 0, message = "Parking spaces must be at least 0")
    @Column(name = "parking_spaces")
    private Integer parkingSpaces = 0;
    
    @Column(name = "has_online_theory")
    private Boolean hasOnlineTheory = false;
    
    // Business Information
    @Type(JsonType.class)
    @Column(name = "operating_hours", columnDefinition = "jsonb")
    private Map<String, Object> operatingHours;
    
    @Column(name = "pricing_info", columnDefinition = "TEXT")
    private String pricingInfo;
    
    @Type(StringArrayType.class)
    @Column(name = "payment_methods", columnDefinition = "varchar[]")
    private String[] paymentMethods;
    
    @Column(name = "cancellation_policy", columnDefinition = "TEXT")
    private String cancellationPolicy;
    
    // Marketing Content
    @Size(max = 500, message = "Logo URL must not exceed 500 characters")
    @Column(name = "logo_url", length = 500)
    private String logoUrl;
    
    @Type(StringArrayType.class)
    @Column(name = "gallery_images", columnDefinition = "varchar[]")
    private String[] galleryImages;
    
    @Column(name = "achievements", columnDefinition = "TEXT")
    private String achievements;
    
    @DecimalMin(value = "0.0", message = "Success rate must be at least 0")
    @DecimalMax(value = "100.0", message = "Success rate must not exceed 100")
    @Column(name = "success_rate", precision = 5, scale = 2)
    private BigDecimal successRate;
    
    @Min(value = 0, message = "Total graduates must be at least 0")
    @Column(name = "total_graduates")
    private Integer totalGraduates = 0;
    
    @Min(value = 0, message = "Years in operation must be at least 0")
    @Column(name = "years_in_operation")
    private Integer yearsInOperation;
    
    // Contact & Social Media
    @Type(JsonType.class)
    @Column(name = "social_media", columnDefinition = "jsonb")
    private Map<String, Object> socialMedia;
    
    @Size(max = 20, message = "WhatsApp number must not exceed 20 characters")
    @Column(name = "whatsapp_number", length = 20)
    private String whatsappNumber;
    
    @Size(max = 20, message = "Secondary phone must not exceed 20 characters")
    @Column(name = "secondary_phone", length = 20)
    private String secondaryPhone;
    
    // SEO & Marketing
    @Type(StringArrayType.class)
    @Column(name = "keywords", columnDefinition = "varchar[]")
    private String[] keywords;
    
    @Type(StringArrayType.class)
    @Column(name = "target_audience", columnDefinition = "varchar[]")
    private String[] targetAudience;
    
    @Type(StringArrayType.class)
    @Column(name = "unique_selling_points", columnDefinition = "varchar[]")
    private String[] uniqueSellingPoints;
    
    // Status
    @Column(name = "is_public")
    private Boolean isPublic = false;
    
    @Column(name = "profile_completion_percentage")
    private Integer profileCompletionPercentage = 0;
    
    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // Constructors
    public SchoolMarketingProfile() {}
    
    public SchoolMarketingProfile(School school) {
        this.school = school;
        this.schoolId = school.getId();
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public Long getSchoolId() {
        return schoolId;
    }
    
    public void setSchoolId(Long schoolId) {
        this.schoolId = schoolId;
    }
    
    public School getSchool() {
        return school;
    }
    
    public void setSchool(School school) {
        this.school = school;
    }
    
    public String[] getCoursesOffered() {
        return coursesOffered;
    }

    public void setCoursesOffered(String[] coursesOffered) {
        this.coursesOffered = coursesOffered;
    }
    
    public String[] getLicenseTypes() {
        return licenseTypes;
    }

    public void setLicenseTypes(String[] licenseTypes) {
        this.licenseTypes = licenseTypes;
    }
    
    public String[] getSpecializations() {
        return specializations;
    }

    public void setSpecializations(String[] specializations) {
        this.specializations = specializations;
    }
    
    public Integer getCourseDurationWeeks() {
        return courseDurationWeeks;
    }
    
    public void setCourseDurationWeeks(Integer courseDurationWeeks) {
        this.courseDurationWeeks = courseDurationWeeks;
    }
    
    public Integer getFleetSize() {
        return fleetSize;
    }
    
    public void setFleetSize(Integer fleetSize) {
        this.fleetSize = fleetSize;
    }
    
    public Boolean getHasSimulators() {
        return hasSimulators;
    }
    
    public void setHasSimulators(Boolean hasSimulators) {
        this.hasSimulators = hasSimulators;
    }
    
    public Integer getSimulatorCount() {
        return simulatorCount;
    }
    
    public void setSimulatorCount(Integer simulatorCount) {
        this.simulatorCount = simulatorCount;
    }
    
    public Integer getTheoryRoomsCount() {
        return theoryRoomsCount;
    }
    
    public void setTheoryRoomsCount(Integer theoryRoomsCount) {
        this.theoryRoomsCount = theoryRoomsCount;
    }
    
    public List<Map<String, Object>> getPracticalVehicles() {
        return practicalVehicles;
    }
    
    public void setPracticalVehicles(List<Map<String, Object>> practicalVehicles) {
        this.practicalVehicles = practicalVehicles;
    }
    
    public Integer getParkingSpaces() {
        return parkingSpaces;
    }
    
    public void setParkingSpaces(Integer parkingSpaces) {
        this.parkingSpaces = parkingSpaces;
    }
    
    public Boolean getHasOnlineTheory() {
        return hasOnlineTheory;
    }
    
    public void setHasOnlineTheory(Boolean hasOnlineTheory) {
        this.hasOnlineTheory = hasOnlineTheory;
    }
    
    public Map<String, Object> getOperatingHours() {
        return operatingHours;
    }
    
    public void setOperatingHours(Map<String, Object> operatingHours) {
        this.operatingHours = operatingHours;
    }
    
    public String getPricingInfo() {
        return pricingInfo;
    }
    
    public void setPricingInfo(String pricingInfo) {
        this.pricingInfo = pricingInfo;
    }
    
    public String[] getPaymentMethods() {
        return paymentMethods;
    }

    public void setPaymentMethods(String[] paymentMethods) {
        this.paymentMethods = paymentMethods;
    }
    
    public String getCancellationPolicy() {
        return cancellationPolicy;
    }
    
    public void setCancellationPolicy(String cancellationPolicy) {
        this.cancellationPolicy = cancellationPolicy;
    }
    
    public String getLogoUrl() {
        return logoUrl;
    }
    
    public void setLogoUrl(String logoUrl) {
        this.logoUrl = logoUrl;
    }
    
    public String[] getGalleryImages() {
        return galleryImages;
    }

    public void setGalleryImages(String[] galleryImages) {
        this.galleryImages = galleryImages;
    }
    
    public String getAchievements() {
        return achievements;
    }
    
    public void setAchievements(String achievements) {
        this.achievements = achievements;
    }
    
    public BigDecimal getSuccessRate() {
        return successRate;
    }
    
    public void setSuccessRate(BigDecimal successRate) {
        this.successRate = successRate;
    }
    
    public Integer getTotalGraduates() {
        return totalGraduates;
    }
    
    public void setTotalGraduates(Integer totalGraduates) {
        this.totalGraduates = totalGraduates;
    }
    
    public Integer getYearsInOperation() {
        return yearsInOperation;
    }
    
    public void setYearsInOperation(Integer yearsInOperation) {
        this.yearsInOperation = yearsInOperation;
    }
    
    public Map<String, Object> getSocialMedia() {
        return socialMedia;
    }
    
    public void setSocialMedia(Map<String, Object> socialMedia) {
        this.socialMedia = socialMedia;
    }
    
    public String getWhatsappNumber() {
        return whatsappNumber;
    }
    
    public void setWhatsappNumber(String whatsappNumber) {
        this.whatsappNumber = whatsappNumber;
    }
    
    public String getSecondaryPhone() {
        return secondaryPhone;
    }
    
    public void setSecondaryPhone(String secondaryPhone) {
        this.secondaryPhone = secondaryPhone;
    }
    
    public String[] getKeywords() {
        return keywords;
    }

    public void setKeywords(String[] keywords) {
        this.keywords = keywords;
    }
    
    public String[] getTargetAudience() {
        return targetAudience;
    }

    public void setTargetAudience(String[] targetAudience) {
        this.targetAudience = targetAudience;
    }
    
    public String[] getUniqueSellingPoints() {
        return uniqueSellingPoints;
    }

    public void setUniqueSellingPoints(String[] uniqueSellingPoints) {
        this.uniqueSellingPoints = uniqueSellingPoints;
    }
    
    public Boolean getIsPublic() {
        return isPublic;
    }
    
    public void setIsPublic(Boolean isPublic) {
        this.isPublic = isPublic;
    }
    
    public Integer getProfileCompletionPercentage() {
        return profileCompletionPercentage;
    }
    
    public void setProfileCompletionPercentage(Integer profileCompletionPercentage) {
        this.profileCompletionPercentage = profileCompletionPercentage;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
