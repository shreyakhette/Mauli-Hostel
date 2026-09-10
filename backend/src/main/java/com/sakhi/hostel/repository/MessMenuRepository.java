package com.sakhi.hostel.repository;

import com.sakhi.hostel.entity.MessMenu;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MessMenuRepository extends JpaRepository<MessMenu, Long> {
    Optional<MessMenu> findByDayOfWeekIgnoreCase(String dayOfWeek);
}
