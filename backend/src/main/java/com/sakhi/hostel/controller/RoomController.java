package com.sakhi.hostel.controller;

import com.sakhi.hostel.dto.AssignBedRequest;
import com.sakhi.hostel.dto.BedDto;
import com.sakhi.hostel.dto.RoomDto;
import com.sakhi.hostel.service.BedService;
import com.sakhi.hostel.service.RoomService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rooms")
@RequiredArgsConstructor
public class RoomController {

    private final RoomService roomService;
    private final BedService bedService;

    @GetMapping
    public ResponseEntity<List<RoomDto>> getAllRooms(
            @RequestParam(required = false) Integer floor,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String query) {
        return ResponseEntity.ok(roomService.getAllRooms(floor, status, query));
    }

    @GetMapping("/{id}")
    public ResponseEntity<RoomDto> getRoomById(@PathVariable Long id) {
        return ResponseEntity.ok(roomService.getRoomById(id));
    }

    @GetMapping("/number/{roomNumber}")
    public ResponseEntity<RoomDto> getRoomByNumber(@PathVariable String roomNumber) {
        return ResponseEntity.ok(roomService.getRoomByNumber(roomNumber));
    }

    @PostMapping
    @PreAuthorize("hasRole('WARDEN')")
    public ResponseEntity<RoomDto> createRoom(@Valid @RequestBody RoomDto dto) {
        return new ResponseEntity<>(roomService.createRoom(dto), HttpStatus.CREATED);
    }

    @GetMapping("/{id}/beds")
    public ResponseEntity<List<BedDto>> getRoomBeds(@PathVariable Long id) {
        return ResponseEntity.ok(bedService.getBedsByRoom(id));
    }

    @PostMapping("/beds/assign")
    @PreAuthorize("hasRole('WARDEN')")
    public ResponseEntity<BedDto> assignBed(@Valid @RequestBody AssignBedRequest req) {
        return ResponseEntity.ok(bedService.assignBed(req.getBedId(), req.getStudentId()));
    }

    @PostMapping("/beds/{bedId}/unassign")
    @PreAuthorize("hasRole('WARDEN')")
    public ResponseEntity<BedDto> unassignBed(@PathVariable Long bedId) {
        return ResponseEntity.ok(bedService.unassignBed(bedId));
    }
}
