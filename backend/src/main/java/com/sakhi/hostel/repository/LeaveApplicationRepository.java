package com.sakhi.hostel.repository;

import com.sakhi.hostel.entity.LeaveApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LeaveApplicationRepository extends JpaRepository<LeaveApplication, Long> {
    List<LeaveApplication> findByStudentIdOrderByAppliedAtDesc(Long studentId);
    List<LeaveApplication> findAllByOrderByAppliedAtDesc();
    List<LeaveApplication> findByStatusOrderByAppliedAtDesc(LeaveApplication.LeaveStatus status);

    @Query("SELECT l FROM LeaveApplication l WHERE (:status IS NULL OR l.status = :status) ORDER BY l.appliedAt DESC")
    List<LeaveApplication> filterLeaves(@Param("status") LeaveApplication.LeaveStatus status);

    long countByStatus(LeaveApplication.LeaveStatus status);
    long countByStudentIdAndStatus(Long studentId, LeaveApplication.LeaveStatus status);

    @Query("SELECT l.status, COUNT(l) FROM LeaveApplication l GROUP BY l.status")
    List<Object[]> countLeavesByStatus();
}
