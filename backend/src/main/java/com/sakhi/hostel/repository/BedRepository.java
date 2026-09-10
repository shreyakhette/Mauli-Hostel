package com.sakhi.hostel.repository;

import com.sakhi.hostel.entity.Bed;
import com.sakhi.hostel.entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BedRepository extends JpaRepository<Bed, Long> {
    List<Bed> findByRoomIdOrderByBedNumberAsc(Long roomId);
    List<Bed> findByRoomAndStatus(Room room, Bed.BedStatus status);
    Optional<Bed> findByRoomIdAndBedNumber(Long roomId, Integer bedNumber);
    long countByStatus(Bed.BedStatus status);

    @Query("SELECT b FROM Bed b LEFT JOIN FETCH b.student s WHERE b.room.id = :roomId ORDER BY b.bedNumber ASC")
    List<Bed> findBedsWithStudentByRoomId(@Param("roomId") Long roomId);
}
