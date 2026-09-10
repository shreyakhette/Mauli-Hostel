package com.sakhi.hostel.repository;

import com.sakhi.hostel.entity.Visitor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface VisitorRepository extends JpaRepository<Visitor, Long> {
    List<Visitor> findByStudentIdOrderByCreatedAtDesc(Long studentId);
    List<Visitor> findAllByOrderByCreatedAtDesc();
    List<Visitor> findByVisitDate(LocalDate visitDate);

    @Query("SELECT v FROM Visitor v WHERE (:status IS NULL OR v.status = :status) ORDER BY v.visitDate DESC, v.createdAt DESC")
    List<Visitor> filterVisitors(@Param("status") Visitor.VisitorStatus status);

    long countByVisitDate(LocalDate visitDate);
    long countByStatus(Visitor.VisitorStatus status);
}
