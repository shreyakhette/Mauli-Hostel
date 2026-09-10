package com.sakhi.hostel.controller;

import com.sakhi.hostel.dto.AttendanceDto;
import com.sakhi.hostel.dto.MarkAttendanceRequest;
import com.sakhi.hostel.dto.StudentAttendanceStatsDto;
import com.sakhi.hostel.dto.StudentProfileDto;
import com.sakhi.hostel.security.UserPrincipal;
import com.sakhi.hostel.service.AttendanceService;
import com.sakhi.hostel.service.StudentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/attendance")
@RequiredArgsConstructor
public class AttendanceController {

    private final AttendanceService attendanceService;
    private final StudentService studentService;

    @GetMapping("/my-stats")
    public ResponseEntity<StudentAttendanceStatsDto> getMyStats(@AuthenticationPrincipal UserPrincipal currentUser) {
        StudentProfileDto student = studentService.getProfileByUserId(currentUser.getId());
        return ResponseEntity.ok(attendanceService.getStudentStats(student.getId()));
    }

    @GetMapping("/student/{studentId}/stats")
    @PreAuthorize("hasRole('WARDEN')")
    public ResponseEntity<StudentAttendanceStatsDto> getStudentStats(@PathVariable Long studentId) {
        return ResponseEntity.ok(attendanceService.getStudentStats(studentId));
    }

    @GetMapping("/by-date")
    @PreAuthorize("hasRole('WARDEN')")
    public ResponseEntity<List<AttendanceDto>> getAttendanceByDate(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(attendanceService.getAttendanceByDate(date));
    }

    @PostMapping("/mark")
    @PreAuthorize("hasRole('WARDEN')")
    public ResponseEntity<AttendanceDto> markAttendance(
            @Valid @RequestBody MarkAttendanceRequest req,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        return ResponseEntity.ok(attendanceService.markAttendance(req, currentUser.getUsername()));
    }

    @PostMapping("/bulk-mark")
    @PreAuthorize("hasRole('WARDEN')")
    public ResponseEntity<List<AttendanceDto>> markBulkAttendance(
            @Valid @RequestBody MarkAttendanceRequest.BulkRequest req,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        return ResponseEntity.ok(attendanceService.markBulkAttendance(req, currentUser.getUsername()));
    }
}
