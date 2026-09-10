package com.sakhi.hostel.repository;

import com.sakhi.hostel.entity.StudentProfile;
import com.sakhi.hostel.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentProfileRepository extends JpaRepository<StudentProfile, Long> {
    Optional<StudentProfile> findByUser(User user);
    Optional<StudentProfile> findByStudentId(String studentId);
    Optional<StudentProfile> findByEmail(String email);
    Boolean existsByStudentId(String studentId);
    Boolean existsByEmail(String email);

    @Query("SELECT s FROM StudentProfile s WHERE s.room.id = :roomId")
    List<StudentProfile> findByRoomId(@Param("roomId") Long roomId);

    @Query("SELECT s FROM StudentProfile s WHERE LOWER(s.fullName) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(s.studentId) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(s.department) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<StudentProfile> searchStudents(@Param("query") String query);

    long countByStatus(String status);
}
