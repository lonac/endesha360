package com.endesha360.SchoolManagementService.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Entity
@Table(name = "school_marketing_profiles")
public class SchoolMarketingProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Relationship with School
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "school_id", nullable = false, unique = true)
    private School school;

    // === Courses & Services ===
    @ElementCollection
    @CollectionTable(name = "school_courses_offered", joinColumns = @JoinColumn(name = "profile_id"))
    @Column(name = "course")
    private List<String> coursesOffered;

    @ElementCollection
    @CollectionTable(name = "school_license_types", joinColumns = @JoinColumn(name = "profile_id"))
    @Column(name = "license_type")
    private List<String> licenseTypes;

    @ElementCollection
    @CollectionTable(name = "school_specializations", joinColumns = @JoinColumn(name = "profile_id"))
    @Column(name = "specialization")
    private List<String> specializations;

    private Integer courseDurationWeeks;

    // === Facilities ===
    private Integer fleetSize;
    private Boolean hasSimulators;
    private Integer simulatorCount;
    private Integer theoryRoomsCount;
    private Integer parkingSpaces;
    private Boolean hasOnlineTheory;

    @ElementCollection
    @CollectionTable(name = "school_practical_vehicles", joinColumns = @JoinColumn(name = "profile_id"))
    @Column(name = "vehicle")
    private List<String> practicalVehicles;

    // === Business Information ===
    @Column(columnDefinition = "TEXT")
    private String pricingInfo;

    @ElementCollection
    @CollectionTable(name = "school_payment_methods", joinColumns = @JoinColumn(name = "profile_id"))
    @Column(name = "method")
    private List<String> paymentMethods;

    @Column(columnDefinition = "TEXT")
    private String cancellationPolicy;

    @ElementCollection
    @CollectionTable(name = "school_operating_hours", joinColumns = @JoinColumn(name = "profile_id"))
    @MapKeyColumn(name = "day")
    @Column(name = "hours")
    private Map<String, String> operatingHours;

    // === Marketing Content ===
    private String logoUrl;

    @ElementCollection
    @CollectionTable(name = "school_gallery_images", joinColumns = @JoinColumn(name = "profile_id"))
    @Column(name = "image_url")
    private List<String> galleryImages;

    @Column(columnDefinition = "TEXT")
    private String achievements;

    private Double successRate;
    private Integer totalGraduates;
    private Integer yearsInOperation;

    @ElementCollection
    @CollectionTable(name = "school_keywords", joinColumns = @JoinColumn(name = "profile_id"))
    @Column(name = "keyword")
    private List<String> keywords;

    @ElementCollection
    @CollectionTable(name = "school_target_audience", joinColumns = @JoinColumn(name = "profile_id"))
    @Column(name = "audience")
    private List<String> targetAudience;

    @ElementCollection
    @CollectionTable(name = "school_unique_points", joinColumns = @JoinColumn(name = "profile_id"))
    @Column(name = "selling_point")
    private List<String> uniqueSellingPoints;

    // === Contact & Social Media ===
    private String whatsappNumber;
    private String secondaryPhone;

    @ElementCollection
    @CollectionTable(name = "school_social_media", joinColumns = @JoinColumn(name = "profile_id"))
    @MapKeyColumn(name = "platform")
    @Column(name = "url")
    private Map<String, Object> socialMedia;

    // === Visibility & Meta ===
    private Boolean isPublic = false;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    // === Getters and Setters ===

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public School getSchool() {
        return school;
    }

    public void setSchool(School school) {
        this.school = school;
    }

    public List<String> getCoursesOffered() {
        return coursesOffered;
    }

    public void setCoursesOffered(List<String> coursesOffered) {
        this.coursesOffered = coursesOffered;
    }

    public List<String> getLicenseTypes() {
        return licenseTypes;
    }

    public void setLicenseTypes(List<String> licenseTypes) {
        this.licenseTypes = licenseTypes;
    }

    public List<String> getSpecializations() {
        return specializations;
    }

    public void setSpecializations(List<String> specializations) {
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

    public List<String> getPracticalVehicles() {
        return practicalVehicles;
    }

    public void setPracticalVehicles(List<String> practicalVehicles) {
        this.practicalVehicles = practicalVehicles;
    }

    public String getPricingInfo() {
        return pricingInfo;
    }

    public void setPricingInfo(String pricingInfo) {
        this.pricingInfo = pricingInfo;
    }

    public List<String> getPaymentMethods() {
        return paymentMethods;
    }

    public void setPaymentMethods(List<String> paymentMethods) {
        this.paymentMethods = paymentMethods;
    }

    public String getCancellationPolicy() {
        return cancellationPolicy;
    }

    public void setCancellationPolicy(String cancellationPolicy) {
        this.cancellationPolicy = cancellationPolicy;
    }

    public Map<String, String> getOperatingHours() {
        return operatingHours;
    }

    public void setOperatingHours(Map<String, String> operatingHours) {
        this.operatingHours = operatingHours;
    }

    public String getLogoUrl() {
        return logoUrl;
    }

    public void setLogoUrl(String logoUrl) {
        this.logoUrl = logoUrl;
    }

    public List<String> getGalleryImages() {
        return galleryImages;
    }

    public void setGalleryImages(List<String> galleryImages) {
        this.galleryImages = galleryImages;
    }

    public String getAchievements() {
        return achievements;
    }

    public void setAchievements(String achievements) {
        this.achievements = achievements;
    }

    public Double getSuccessRate() {
        return successRate;
    }

    public void setSuccessRate(Double successRate) {
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

    public List<String> getKeywords() {
        return keywords;
    }

    public void setKeywords(List<String> keywords) {
        this.keywords = keywords;
    }

    public List<String> getTargetAudience() {
        return targetAudience;
    }

    public void setTargetAudience(List<String> targetAudience) {
        this.targetAudience = targetAudience;
    }

    public List<String> getUniqueSellingPoints() {
        return uniqueSellingPoints;
    }

    public void setUniqueSellingPoints(List<String> uniqueSellingPoints) {
        this.uniqueSellingPoints = uniqueSellingPoints;
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

    public Map<String, Object> getSocialMedia() {
        return socialMedia;
    }

    public void setSocialMedia(Map<String, Object> socialMedia) {
        this.socialMedia = socialMedia;
    }

    public Boolean getPublic() {
        return isPublic;
    }

    public void setPublic(Boolean aPublic) {
        isPublic = aPublic;
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
