package com.sakhi.hostel.service;

import com.sakhi.hostel.dto.BedDto;
import com.sakhi.hostel.dto.RoomDto;
import com.sakhi.hostel.entity.Bed;
import com.sakhi.hostel.entity.Room;
import com.sakhi.hostel.exception.ConflictException;
import com.sakhi.hostel.exception.ResourceNotFoundException;
import com.sakhi.hostel.repository.BedRepository;
import com.sakhi.hostel.repository.RoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RoomService {

    private final RoomRepository roomRepository;
    private final BedRepository bedRepository;

    @Transactional(readOnly = true)
    public List<RoomDto> getAllRooms(Integer floor, String statusStr, String query) {
        Room.RoomStatus status = null;
        if (statusStr != null && !statusStr.isBlank()) {
            try {
                status = Room.RoomStatus.valueOf(statusStr.toUpperCase());
            } catch (IllegalArgumentException ignored) {}
        }

        String search = (query != null && !query.isBlank()) ? query.trim() : null;
        List<Room> rooms = roomRepository.filterRooms(floor, status, search);

        return rooms.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public RoomDto getRoomById(Long id) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found with ID: " + id));
        return mapToDtoWithBeds(room);
    }

    @Transactional(readOnly = true)
    public RoomDto getRoomByNumber(String roomNumber) {
        Room room = roomRepository.findByRoomNumber(roomNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found with number: " + roomNumber));
        return mapToDtoWithBeds(room);
    }

    @Transactional
    public RoomDto createRoom(RoomDto dto) {
        if (roomRepository.findByRoomNumber(dto.getRoomNumber()).isPresent()) {
            throw new ConflictException("Room number " + dto.getRoomNumber() + " already exists.");
        }

        int capacity = (dto.getCapacity() != null && dto.getCapacity() > 0) ? dto.getCapacity() : 4;
        Room room = Room.builder()
                .roomNumber(dto.getRoomNumber().trim())
                .floor(dto.getFloor() != null ? dto.getFloor() : 1)
                .capacity(capacity)
                .occupiedCount(0)
                .status(Room.RoomStatus.AVAILABLE)
                .beds(new ArrayList<>())
                .build();

        room = roomRepository.save(room);

        // Generate beds for this room
        for (int i = 1; i <= capacity; i++) {
            Bed bed = Bed.builder()
                    .bedNumber(i)
                    .bedLabel("Bed " + i)
                    .status(Bed.BedStatus.AVAILABLE)
                    .room(room)
                    .build();
            room.getBeds().add(bedRepository.save(bed));
        }

        return mapToDtoWithBeds(room);
    }

    public RoomDto mapToDto(Room room) {
        int available = Math.max(0, room.getCapacity() - room.getOccupiedCount());
        return RoomDto.builder()
                .id(room.getId())
                .roomNumber(room.getRoomNumber())
                .floor(room.getFloor())
                .capacity(room.getCapacity())
                .occupiedCount(room.getOccupiedCount())
                .availableBeds(available)
                .status(room.getStatus().name())
                .build();
    }

    public RoomDto mapToDtoWithBeds(Room room) {
        RoomDto dto = mapToDto(room);
        List<Bed> beds = bedRepository.findBedsWithStudentByRoomId(room.getId());
        dto.setBeds(beds.stream().map(this::mapBedToDto).collect(Collectors.toList()));
        return dto;
    }

    public BedDto mapBedToDto(Bed bed) {
        BedDto.BedDtoBuilder builder = BedDto.builder()
                .id(bed.getId())
                .roomId(bed.getRoom().getId())
                .roomNumber(bed.getRoom().getRoomNumber())
                .bedNumber(bed.getBedNumber())
                .bedLabel(bed.getBedLabel())
                .status(bed.getStatus().name());

        if (bed.getStudent() != null) {
            builder.studentId(bed.getStudent().getId())
                    .studentSystemId(bed.getStudent().getStudentId())
                    .studentName(bed.getStudent().getFullName())
                    .studentDepartment(bed.getStudent().getDepartment())
                    .studentMobile(bed.getStudent().getMobile())
                    .studentEmail(bed.getStudent().getEmail());
        }

        return builder.build();
    }
}
