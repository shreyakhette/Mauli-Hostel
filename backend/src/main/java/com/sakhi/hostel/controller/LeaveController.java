package com.sakhi.hostel.controller;

import com.sakhi.hostel.dto.LeaveDto;
import com.sakhi.hostel.dto.StudentProfileDto;
import com.sakhi.hostel.security.UserPrincipal;
import com.sakhi.hostel.service.LeaveService;
import com.sakhi.hostel.service.StudentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leave")
@RequiredArgsConstructor
public class LeaveController {

    private final LeaveService leaveService;
    private final StudentService studentService;

    @GetMapping("/my")
    public ResponseEntity<List<LeaveDto>> getMyLeaves(@AuthenticationPrincipal UserPrincipal currentUser) {
        StudentProfileDto student = studentService.getProfileByUserId(currentUser.getId());
        return ResponseEntity.ok(leaveService.getStudentLeaves(student.getId()));
    }

    @GetMapping
    @PreAuthorize("hasRole('WARDEN')")
    public ResponseEntity<List<LeaveDto>> getAllLeaves(@RequestParam(required = false) String status) {
        return ResponseEntity.ok(leaveService.getAllLeaves(status));
    }

    @GetMapping("/{id}")
    public ResponseEntity<LeaveDto> getLeaveById(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        LeaveDto leave = leaveService.getLeaveById(id);
        boolean isWarden = currentUser.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_WARDEN"));
        if (!isWarden) {
            StudentProfileDto student = studentService.getProfileByUserId(currentUser.getId());
            if (!leave.getStudentId().equals(student.getId())) {
                throw new AccessDeniedException("Access denied: You can only view your own leave applications");
            }
        }
        return ResponseEntity.ok(leave);
    }

    @PostMapping("/apply")
    public ResponseEntity<LeaveDto> applyLeave(
            @Valid @RequestBody LeaveDto.ApplyRequest req,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        StudentProfileDto student = studentService.getProfileByUserId(currentUser.getId());
        return new ResponseEntity<>(leaveService.applyLeave(student.getId(), req), HttpStatus.CREATED);
    }

    @PatchMapping("/{id}/review")
    @PreAuthorize("hasRole('WARDEN')")
    public ResponseEntity<LeaveDto> reviewLeave(
            @PathVariable Long id,
            @Valid @RequestBody LeaveDto.ReviewRequest req,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        return ResponseEntity.ok(leaveService.reviewLeave(id, req, currentUser.getUsername()));
    }
}
