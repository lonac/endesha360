package com.endesha360.SchoolManagementService.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

public class SchoolMarketingProfileResponse {
    
    @JsonProperty("id")
    private Long id;
    
    @JsonProperty("schoolId")
    private Long schoolId;
    
    @JsonProperty("schoolName")
    private String schoolName;
    
    // Course Offerings
    @JsonProperty("coursesOffered")
    private List<String> coursesOffered;
    
    @JsonProperty("licenseTypes")
    private List<String> licenseTypes;
    
    @JsonProperty("specializations")
    private List<String> specializations;
    
    @JsonProperty("courseDurationWeeks")
    private Integer courseDurationWeeks;
    
    // Facilities & Services
    @JsonProperty("fleetSize")
    private Integer fleetSize;
    
    @JsonProperty("hasSimulators")
    private Boolean hasSimulators;
    
    @JsonProperty("simulatorCount")
    private Integer simulatorCount;
    
    @JsonProperty("theoryRoomsCount")
    private Integer theoryRoomsCount;
    
    @JsonProperty("practicalVehicles")
    private List<Map<String, Object>> practicalVehicles;
    
    @JsonProperty("parkingSpaces")
    private Integer parkingSpaces;
    
    @JsonProperty("hasOnlineTheory")
    private Boolean hasOnlineTheory;
    
    // Business Information
    @JsonProperty("operatingHours")
    private Map<String, Object> operatingHours;
    
    @JsonProperty("pricingInfo")
    private String pricingInfo;
    
    @JsonProperty("paymentMethods")
    private List<String> paymentMethods;
    
    @JsonProperty("cancellationPolicy")
    private String cancellationPolicy;
    
    // Marketing Content
    @JsonProperty("logoUrl")
    private String logoUrl;
    
    @JsonProperty("galleryImages")
    private List<String> galleryImages;
    
    @JsonProperty("achievements")
    private String achievements;
    
    @JsonProperty("successRate")
    private BigDecimal successRate;
    
    @JsonProperty("totalGraduates")
    private Integer totalGraduates;
    
    @JsonProperty("yearsInOperation")
    private Integer yearsInOperation;
    
    // Contact & Social Media
    @JsonProperty("socialMedia")
    private Map<String, Object> socialMedia;
    
    @JsonProperty("whatsappNumber")
    private String whatsappNumber;
    
    @JsonProperty("secondaryPhone")
    private String secondaryPhone;
    
    // SEO & Marketing
    @JsonProperty("keywords")
    private List<String> keywords;
    
    @JsonProperty("targetAudience")
    private List<String> targetAudience;
    
    @JsonProperty("uniqueSellingPoints")
    private List<String> uniqueSellingPoints;
    
    // Status & Visibility
    @JsonProperty("isPublic")
    private Boolean isPublic;
    
    @JsonProperty("profileCompletionPercentage")
    private Integer profileCompletionPercentage;
    
    @JsonProperty("createdAt")
    private LocalDateTime createdAt;
    
    @JsonProperty("updatedAt")
    private LocalDateTime updatedAt;
    
    // Constructors
    public SchoolMarketingProfileResponse() {}
    
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
    
    public String getSchoolName() {
        return schoolName;
    }
    
    public void setSchoolName(String schoolName) {
        this.schoolName = schoolName;
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
