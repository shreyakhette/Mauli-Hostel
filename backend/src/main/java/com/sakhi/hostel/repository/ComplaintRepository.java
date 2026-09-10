package com.sakhi.hostel.repository;

import com.sakhi.hostel.entity.Complaint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ComplaintRepository extends JpaRepository<Complaint, Long> {
    Optional<Complaint> findByTicketNumber(String ticketNumber);
    List<Complaint> findByStudentIdOrderByCreatedAtDesc(Long studentId);
    List<Complaint> findAllByOrderByCreatedAtDesc();
    List<Complaint> findByStatusOrderByCreatedAtDesc(Complaint.ComplaintStatus status);

    @Query("SELECT c FROM Complaint c WHERE (:status IS NULL OR c.status = :status) " +
           "AND (:category IS NULL OR c.category = :category) " +
           "ORDER BY c.createdAt DESC")
    List<Complaint> filterComplaints(@Param("status") Complaint.ComplaintStatus status,
                                     @Param("category") Complaint.ComplaintCategory category);

    long countByStatus(Complaint.ComplaintStatus status);
    long countByStudentIdAndStatus(Long studentId, Complaint.ComplaintStatus status);

    @Query("SELECT c.category, COUNT(c) FROM Complaint c GROUP BY c.category")
    List<Object[]> countComplaintsByCategory();
}
