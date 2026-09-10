package com.sakhi.hostel.repository;

import com.sakhi.hostel.entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {
    Optional<Room> findByRoomNumber(String roomNumber);
    List<Room> findByFloor(Integer floor);
    List<Room> findByStatus(Room.RoomStatus status);

    @Query("SELECT r FROM Room r WHERE (:floor IS NULL OR r.floor = :floor) " +
           "AND (:status IS NULL OR r.status = :status) " +
           "AND (:query IS NULL OR LOWER(r.roomNumber) LIKE LOWER(CONCAT('%', :query, '%'))) " +
           "ORDER BY r.floor ASC, r.roomNumber ASC")
    List<Room> filterRooms(@Param("floor") Integer floor,
                           @Param("status") Room.RoomStatus status,
                           @Param("query") String query);

    @Query("SELECT SUM(r.capacity) FROM Room r")
    Integer getTotalBedCapacity();

    @Query("SELECT SUM(r.occupiedCount) FROM Room r")
    Integer getTotalOccupiedBeds();

    long countByStatus(Room.RoomStatus status);
}
