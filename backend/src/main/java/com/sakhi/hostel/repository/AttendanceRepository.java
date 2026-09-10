package com.sakhi.hostel.repository;

import com.sakhi.hostel.entity.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    Optional<Attendance> findByStudentIdAndAttendanceDate(Long studentId, LocalDate attendanceDate);
    List<Attendance> findByStudentIdOrderByAttendanceDateDesc(Long studentId);
    List<Attendance> findByAttendanceDate(LocalDate attendanceDate);

    @Query("SELECT a FROM Attendance a JOIN FETCH a.student s LEFT JOIN FETCH s.room WHERE a.attendanceDate = :date")
    List<Attendance> findWithStudentByAttendanceDate(@Param("date") LocalDate date);

    long countByStudentIdAndStatus(Long studentId, Attendance.AttendanceStatus status);
    long countByStudentId(Long studentId);

    long countByAttendanceDateAndStatus(LocalDate attendanceDate, Attendance.AttendanceStatus status);
    long countByAttendanceDate(LocalDate attendanceDate);

    @Query("SELECT a.status, COUNT(a) FROM Attendance a WHERE a.attendanceDate = :date GROUP BY a.status")
    List<Object[]> countByDateGroupByStatus(@Param("date") LocalDate date);

    @Query("SELECT a.attendanceDate, a.status, COUNT(a) FROM Attendance a WHERE a.attendanceDate BETWEEN :startDate AND :endDate GROUP BY a.attendanceDate, a.status ORDER BY a.attendanceDate ASC")
    List<Object[]> getAttendanceTrend(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
}
