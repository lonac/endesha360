package com.endesha360.SchoolManagementService.repository;

import com.endesha360.SchoolManagementService.entity.SchoolMarketingProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SchoolMarketingProfileRepository extends JpaRepository<SchoolMarketingProfile, Long> {
    
    Optional<SchoolMarketingProfile> findBySchoolId(Long schoolId);
    
    @Query("SELECT smp FROM SchoolMarketingProfile smp JOIN smp.school s WHERE s.ownerUserId = :ownerUserId")
    Optional<SchoolMarketingProfile> findBySchoolOwnerUserId(@Param("ownerUserId") String ownerUserId);
    
    List<SchoolMarketingProfile> findByIsPublicTrue();
    
    @Query("SELECT smp FROM SchoolMarketingProfile smp JOIN smp.school s WHERE s.isApproved = true AND smp.isPublic = true")
    List<SchoolMarketingProfile> findPublicApprovedSchoolProfiles();
    
    @Query("SELECT smp FROM SchoolMarketingProfile smp JOIN smp.school s WHERE s.city = :city AND s.isApproved = true AND smp.isPublic = true")
    List<SchoolMarketingProfile> findPublicApprovedSchoolProfilesByCity(@Param("city") String city);
    
    @Query(value = "SELECT * FROM school_marketing_profiles smp WHERE :courseType = ANY(smp.courses_offered) AND smp.is_public = true", nativeQuery = true)
    List<SchoolMarketingProfile> findByCoursesOfferedContaining(@Param("courseType") String courseType);
    
    @Query(value = "SELECT * FROM school_marketing_profiles smp WHERE :licenseType = ANY(smp.license_types) AND smp.is_public = true", nativeQuery = true)
    List<SchoolMarketingProfile> findByLicenseTypesContaining(@Param("licenseType") String licenseType);
    
    @Query("SELECT AVG(smp.profileCompletionPercentage) FROM SchoolMarketingProfile smp")
    Double getAverageProfileCompletionPercentage();
    
    @Query("SELECT COUNT(smp) FROM SchoolMarketingProfile smp WHERE smp.profileCompletionPercentage >= :minCompletion")
    Long countProfilesWithMinimumCompletion(@Param("minCompletion") Integer minCompletion);
    
    @Query(value = "SELECT smp.* FROM school_marketing_profiles smp " +
           "JOIN schools s ON smp.school_id = s.id WHERE " +
           "(:city IS NULL OR s.city = :city) AND " +
           "(:courseType IS NULL OR :courseType = ANY(smp.courses_offered)) AND " +
           "(:licenseType IS NULL OR :licenseType = ANY(smp.license_types)) AND " +
           "s.is_approved = true AND smp.is_public = true", nativeQuery = true)
    List<SchoolMarketingProfile> searchSchoolProfiles(
        @Param("city") String city,
        @Param("courseType") String courseType,
        @Param("licenseType") String licenseType
    );
}
