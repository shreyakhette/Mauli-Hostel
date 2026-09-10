package com.sakhi.hostel.controller;

import com.sakhi.hostel.dto.BusDto;
import com.sakhi.hostel.service.BusService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bus")
@RequiredArgsConstructor
public class BusController {

    private final BusService busService;

    @GetMapping("/schedules")
    public ResponseEntity<List<BusDto.ScheduleDto>> getAllSchedules() {
        return ResponseEntity.ok(busService.getAllSchedules());
    }

    @GetMapping("/schedules/day/{day}")
    public ResponseEntity<List<BusDto.ScheduleDto>> getSchedulesByDay(@PathVariable String day) {
        return ResponseEntity.ok(busService.getSchedulesByDay(day));
    }

    @GetMapping
    public ResponseEntity<List<BusDto>> getAllBuses() {
        return ResponseEntity.ok(busService.getAllBuses());
    }

    @PostMapping("/schedules")
    @PreAuthorize("hasRole('WARDEN')")
    public ResponseEntity<BusDto.ScheduleDto> createSchedule(@Valid @RequestBody BusDto.ScheduleRequest req) {
        return new ResponseEntity<>(busService.createSchedule(req), HttpStatus.CREATED);
    }

    @PutMapping("/schedules/{id}")
    @PreAuthorize("hasRole('WARDEN')")
    public ResponseEntity<BusDto.ScheduleDto> updateSchedule(@PathVariable Long id, @Valid @RequestBody BusDto.ScheduleRequest req) {
        return ResponseEntity.ok(busService.updateSchedule(id, req));
    }

    @DeleteMapping("/schedules/{id}")
    @PreAuthorize("hasRole('WARDEN')")
    public ResponseEntity<Void> deleteSchedule(@PathVariable Long id) {
        busService.deleteSchedule(id);
        return ResponseEntity.noContent().build();
    }
}
