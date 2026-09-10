package com.sakhi.hostel.repository;

import com.sakhi.hostel.entity.Notice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface NoticeRepository extends JpaRepository<Notice, Long> {
    List<Notice> findAllByOrderByIsPinnedDescCreatedAtDesc();

    @Query("SELECT n FROM Notice n WHERE (n.expiryDate IS NULL OR n.expiryDate >= :today) " +
           "AND (:category IS NULL OR n.category = :category) " +
           "ORDER BY n.isPinned DESC, n.createdAt DESC")
    List<Notice> findActiveNotices(@Param("today") LocalDate today,
                                   @Param("category") Notice.Category category);

    List<Notice> findTop5ByOrderByCreatedAtDesc();
}
