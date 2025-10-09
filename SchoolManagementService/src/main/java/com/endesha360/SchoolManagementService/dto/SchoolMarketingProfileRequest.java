package com.endesha360.SchoolManagementService.dto;

import jakarta.validation.constraints.Size;
import java.util.List;
import java.util.Map;

public class SchoolMarketingProfileRequest {

    // === Courses & Services ===
    private List<String> coursesOffered;
    private List<String> licenseTypes;
    private List<String> specializations;
    private Integer courseDurationWeeks;

    // === Facilities ===
    private Integer fleetSize;
    private Boolean hasSimulators;
    private Integer simulatorCount;
    private Integer theoryRoomsCount;
    private Integer parkingSpaces;
    private Boolean hasOnlineTheory;
    private List<String> practicalVehicles;

    // === Business Info ===
    @Size(max = 2000)
    private String pricingInfo;
    private List<String> paymentMethods;
    private String cancellationPolicy;
    private Map<String, String> operatingHours;

    // === Marketing Content ===
    private String logoUrl;
    private List<String> galleryImages;
    private String achievements;
    private Double successRate;
    private Integer totalGraduates;
    private Integer yearsInOperation;
    private List<String> keywords;
    private List<String> targetAudience;
    private List<String> uniqueSellingPoints;

    // === Contact & Social Media ===
    private String whatsappNumber;
    private String secondaryPhone;
    private Map<String, Object> socialMedia;

    // === Getters and Setters ===

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
}
