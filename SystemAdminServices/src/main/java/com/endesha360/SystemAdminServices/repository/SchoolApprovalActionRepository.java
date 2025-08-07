package com.endesha360.SystemAdminServices.repository;

import com.endesha360.SystemAdminServices.entity.SchoolApprovalAction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface SchoolApprovalActionRepository extends JpaRepository<SchoolApprovalAction, Long> {
    
    List<SchoolApprovalAction> findBySchoolIdOrderByActionTimestampDesc(Long schoolId);
    
    List<SchoolApprovalAction> findByAdminIdOrderByActionTimestampDesc(Long adminId);
    
    List<SchoolApprovalAction> findByActionTypeOrderByActionTimestampDesc(SchoolApprovalAction.ActionType actionType);
    
    List<SchoolApprovalAction> findBySchoolOwnerIdOrderByActionTimestampDesc(Long schoolOwnerId);
    
    @Query("SELECT saa FROM SchoolApprovalAction saa WHERE saa.actionTimestamp BETWEEN :startDate AND :endDate ORDER BY saa.actionTimestamp DESC")
    List<SchoolApprovalAction> findByActionTimestampBetween(@Param("startDate") LocalDateTime startDate, 
                                                           @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT saa FROM SchoolApprovalAction saa WHERE saa.schoolId = :schoolId AND saa.actionType = :actionType ORDER BY saa.actionTimestamp DESC")
    List<SchoolApprovalAction> findBySchoolIdAndActionType(@Param("schoolId") Long schoolId, 
                                                          @Param("actionType") SchoolApprovalAction.ActionType actionType);
    
    @Query("SELECT COUNT(saa) FROM SchoolApprovalAction saa WHERE saa.adminId = :adminId AND saa.actionType = :actionType")
    Long countByAdminIdAndActionType(@Param("adminId") Long adminId, 
                                    @Param("actionType") SchoolApprovalAction.ActionType actionType);
}
