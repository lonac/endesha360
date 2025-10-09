package com.endesha360.SchoolManagementService.repository;

import com.endesha360.SchoolManagementService.entity.SchoolMarketingProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SchoolMarketingProfileRepository extends JpaRepository<SchoolMarketingProfile, Long> {
    Optional<SchoolMarketingProfile> findBySchoolId(Long schoolId);
}
