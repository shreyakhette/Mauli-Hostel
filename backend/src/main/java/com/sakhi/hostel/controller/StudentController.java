package com.sakhi.hostel.controller;

import com.sakhi.hostel.dto.StudentDashboardDto;
import com.sakhi.hostel.dto.StudentProfileDto;
import com.sakhi.hostel.security.UserPrincipal;
import com.sakhi.hostel.service.StudentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/students")
@RequiredArgsConstructor
public class StudentController {

    private final StudentService studentService;

    @GetMapping("/me")
    public ResponseEntity<StudentProfileDto> getMyProfile(@AuthenticationPrincipal UserPrincipal currentUser) {
        return ResponseEntity.ok(studentService.getProfileByUserId(currentUser.getId()));
    }

    @PutMapping("/me")
    public ResponseEntity<StudentProfileDto> updateMyProfile(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @RequestBody StudentProfileDto.UpdateRequest req) {
        StudentProfileDto profile = studentService.getProfileByUserId(currentUser.getId());
        return ResponseEntity.ok(studentService.updateProfile(profile.getId(), req));
    }

    @GetMapping("/dashboard")
    public ResponseEntity<StudentDashboardDto> getStudentDashboard(@AuthenticationPrincipal UserPrincipal currentUser) {
        StudentProfileDto profile = studentService.getProfileByUserId(currentUser.getId());
        return ResponseEntity.ok(studentService.getStudentDashboard(profile.getId()));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('WARDEN')")
    public ResponseEntity<StudentProfileDto> getStudentById(@PathVariable Long id) {
        return ResponseEntity.ok(studentService.getProfileById(id));
    }

    @GetMapping
    @PreAuthorize("hasRole('WARDEN')")
    public ResponseEntity<List<StudentProfileDto>> getAllStudents(@RequestParam(required = false) String query) {
        return ResponseEntity.ok(studentService.getAllStudents(query));
    }
}
