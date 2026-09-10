package com.sakhi.hostel.service;

import com.sakhi.hostel.dto.BedDto;
import com.sakhi.hostel.entity.Bed;
import com.sakhi.hostel.entity.Notification;
import com.sakhi.hostel.entity.Room;
import com.sakhi.hostel.entity.StudentProfile;
import com.sakhi.hostel.exception.BadRequestException;
import com.sakhi.hostel.exception.ConflictException;
import com.sakhi.hostel.exception.ResourceNotFoundException;
import com.sakhi.hostel.repository.BedRepository;
import com.sakhi.hostel.repository.RoomRepository;
import com.sakhi.hostel.repository.StudentProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BedService {

    private final BedRepository bedRepository;
    private final RoomRepository roomRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final NotificationService notificationService;
    private final RoomService roomService;

    @Transactional
    public BedDto assignBed(Long bedId, Long studentId) {
        Bed bed = bedRepository.findById(bedId)
                .orElseThrow(() -> new ResourceNotFoundException("Bed not found with ID: " + bedId));

        if (bed.getStatus() == Bed.BedStatus.OCCUPIED) {
            throw new ConflictException("Bed is already occupied.");
        }
        if (bed.getStatus() == Bed.BedStatus.MAINTENANCE) {
            throw new BadRequestException("Bed is under maintenance.");
        }

        StudentProfile student = studentProfileRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with ID: " + studentId));

        // If student was in another bed, free the old bed first
        if (student.getBed() != null && !student.getBed().getId().equals(bedId)) {
            Bed oldBed = student.getBed();
            oldBed.setStatus(Bed.BedStatus.AVAILABLE);
            bedRepository.save(oldBed);

            Room oldRoom = oldBed.getRoom();
            oldRoom.setOccupiedCount(Math.max(0, oldRoom.getOccupiedCount() - 1));
            oldRoom.updateStatus();
            roomRepository.save(oldRoom);
        }

        Room room = bed.getRoom();
        if (room.getOccupiedCount() >= room.getCapacity()) {
            throw new ConflictException("Room " + room.getRoomNumber() + " is already at maximum capacity.");
        }

        // Allocate
        bed.setStatus(Bed.BedStatus.OCCUPIED);
        bed.setStudent(student);
        bed = bedRepository.save(bed);

        room.setOccupiedCount(room.getOccupiedCount() + 1);
        room.updateStatus();
        roomRepository.save(room);

        student.setRoom(room);
        student.setBed(bed);
        studentProfileRepository.save(student);

        // Notify student
        notificationService.createNotification(
                student.getUser(),
                "Bed Allocated",
                "You have been assigned to Room " + room.getRoomNumber() + " (" + bed.getBedLabel() + ")",
                Notification.NotificationType.SYSTEM,
                "/student/room"
        );

        return roomService.mapBedToDto(bed);
    }

    @Transactional
    public BedDto unassignBed(Long bedId) {
        Bed bed = bedRepository.findById(bedId)
                .orElseThrow(() -> new ResourceNotFoundException("Bed not found with ID: " + bedId));

        StudentProfile student = bed.getStudent();
        if (student != null) {
            student.setBed(null);
            student.setRoom(null);
            studentProfileRepository.save(student);

            notificationService.createNotification(
                    student.getUser(),
                    "Bed Unassigned",
                    "Your bed allocation in Room " + bed.getRoom().getRoomNumber() + " has been cleared by the warden.",
                    Notification.NotificationType.SYSTEM,
                    "/student/room"
            );
        }

        Room room = bed.getRoom();
        room.setOccupiedCount(Math.max(0, room.getOccupiedCount() - 1));
        room.updateStatus();
        roomRepository.save(room);

        bed.setStatus(Bed.BedStatus.AVAILABLE);
        bed.setStudent(null);
        bed = bedRepository.save(bed);

        return roomService.mapBedToDto(bed);
    }

    @Transactional(readOnly = true)
    public List<BedDto> getBedsByRoom(Long roomId) {
        return bedRepository.findBedsWithStudentByRoomId(roomId).stream()
                .map(roomService::mapBedToDto)
                .collect(Collectors.toList());
    }
}
