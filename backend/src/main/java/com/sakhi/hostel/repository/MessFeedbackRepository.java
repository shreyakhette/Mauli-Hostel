package com.sakhi.hostel.repository;

import com.sakhi.hostel.entity.MessFeedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessFeedbackRepository extends JpaRepository<MessFeedback, Long> {
    List<MessFeedback> findByDayOfWeekIgnoreCase(String dayOfWeek);
    List<MessFeedback> findByStudentIdOrderByCreatedAtDesc(Long studentId);
}
