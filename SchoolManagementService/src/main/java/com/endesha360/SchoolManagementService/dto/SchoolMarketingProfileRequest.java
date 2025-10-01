package com.endesha360.SchoolManagementService.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public class SchoolMarketingProfileRequest {
    
    // Course Offerings
    @JsonProperty("coursesOffered")
    private List<String> coursesOffered;
    
    @JsonProperty("licenseTypes")
    private List<String> licenseTypes;
    
    @JsonProperty("specializations")
    private List<String> specializations;
    
    @Min(value = 1, message = "Course duration must be at least 1 week")
    @Max(value = 52, message = "Course duration must not exceed 52 weeks")
    @JsonProperty("courseDurationWeeks")
    private Integer courseDurationWeeks;
    
    // Facilities & Services
    @Min(value = 0, message = "Fleet size must be at least 0")
    @JsonProperty("fleetSize")
    private Integer fleetSize;
    
    @JsonProperty("hasSimulators")
    private Boolean hasSimulators;
    
    @Min(value = 0, message = "Simulator count must be at least 0")
    @JsonProperty("simulatorCount")
    private Integer simulatorCount;
    
    @Min(value = 0, message = "Theory rooms count must be at least 0")
    @JsonProperty("theoryRoomsCount")
    private Integer theoryRoomsCount;
    
    @JsonProperty("practicalVehicles")
    private List<Map<String, Object>> practicalVehicles;
    
    @Min(value = 0, message = "Parking spaces must be at least 0")
    @JsonProperty("parkingSpaces")
    private Integer parkingSpaces;
    
    @JsonProperty("hasOnlineTheory")
    private Boolean hasOnlineTheory;
    
    // Business Information
    @JsonProperty("operatingHours")
    private Map<String, Object> operatingHours;
    
    @Size(max = 1000, message = "Pricing info must not exceed 1000 characters")
    @JsonProperty("pricingInfo")
    private String pricingInfo;
    
    @JsonProperty("paymentMethods")
    private List<String> paymentMethods;
    
    @Size(max = 500, message = "Cancellation policy must not exceed 500 characters")
    @JsonProperty("cancellationPolicy")
    private String cancellationPolicy;
    
    // Marketing Content
    @Size(max = 500, message = "Logo URL must not exceed 500 characters")
    @JsonProperty("logoUrl")
    private String logoUrl;
    
    @JsonProperty("galleryImages")
    private List<String> galleryImages;
    
    @Size(max = 2000, message = "Achievements must not exceed 2000 characters")
    @JsonProperty("achievements")
    private String achievements;
    
    @DecimalMin(value = "0.0", message = "Success rate must be at least 0")
    @DecimalMax(value = "100.0", message = "Success rate must not exceed 100")
    @JsonProperty("successRate")
    private BigDecimal successRate;
    
    @Min(value = 0, message = "Total graduates must be at least 0")
    @JsonProperty("totalGraduates")
    private Integer totalGraduates;
    
    @Min(value = 0, message = "Years in operation must be at least 0")
    @JsonProperty("yearsInOperation")
    private Integer yearsInOperation;
    
    // Contact & Social Media
    @JsonProperty("socialMedia")
    private Map<String, Object> socialMedia;
    
    @Size(max = 20, message = "WhatsApp number must not exceed 20 characters")
    @JsonProperty("whatsappNumber")
    private String whatsappNumber;
    
    @Size(max = 20, message = "Secondary phone must not exceed 20 characters")
    @JsonProperty("secondaryPhone")
    private String secondaryPhone;
    
    // SEO & Marketing
    @JsonProperty("keywords")
    private List<String> keywords;
    
    @JsonProperty("targetAudience")
    private List<String> targetAudience;
    
    @JsonProperty("uniqueSellingPoints")
    private List<String> uniqueSellingPoints;
    
    // Constructors
    public SchoolMarketingProfileRequest() {}
    
    // Getters and Setters
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
}
