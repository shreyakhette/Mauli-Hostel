package com.sakhi.hostel.repository;

import com.sakhi.hostel.entity.BusSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BusScheduleRepository extends JpaRepository<BusSchedule, Long> {
    List<BusSchedule> findByDayOfWeekIgnoreCase(String dayOfWeek);
    List<BusSchedule> findAllByOrderByIdAsc();
}
