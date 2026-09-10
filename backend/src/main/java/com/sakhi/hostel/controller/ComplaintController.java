package com.sakhi.hostel.controller;

import com.sakhi.hostel.dto.ComplaintCommentRequest;
import com.sakhi.hostel.dto.ComplaintDto;
import com.sakhi.hostel.dto.ComplaintRequest;
import com.sakhi.hostel.dto.ComplaintStatusUpdateRequest;
import com.sakhi.hostel.dto.StudentProfileDto;
import com.sakhi.hostel.security.UserPrincipal;
import com.sakhi.hostel.service.ComplaintService;
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
@RequestMapping("/api/complaints")
@RequiredArgsConstructor
public class ComplaintController {

    private final ComplaintService complaintService;
    private final StudentService studentService;

    @GetMapping("/my")
    public ResponseEntity<List<ComplaintDto>> getMyComplaints(@AuthenticationPrincipal UserPrincipal currentUser) {
        StudentProfileDto student = studentService.getProfileByUserId(currentUser.getId());
        return ResponseEntity.ok(complaintService.getStudentComplaints(student.getId()));
    }

    @GetMapping
    @PreAuthorize("hasRole('WARDEN')")
    public ResponseEntity<List<ComplaintDto>> getAllComplaints(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String category) {
        return ResponseEntity.ok(complaintService.getAllComplaints(status, category));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ComplaintDto> getComplaintById(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        ComplaintDto complaint = complaintService.getComplaintById(id);
        boolean isWarden = currentUser.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_WARDEN"));
        if (!isWarden) {
            StudentProfileDto student = studentService.getProfileByUserId(currentUser.getId());
            if (!complaint.getStudentId().equals(student.getId())) {
                throw new AccessDeniedException("Access denied: You can only view your own complaints");
            }
        }
        return ResponseEntity.ok(complaint);
    }

    @PostMapping
    public ResponseEntity<ComplaintDto> createComplaint(
            @Valid @RequestBody ComplaintRequest req,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        StudentProfileDto student = studentService.getProfileByUserId(currentUser.getId());
        return new ResponseEntity<>(complaintService.createComplaint(student.getId(), req), HttpStatus.CREATED);
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('WARDEN')")
    public ResponseEntity<ComplaintDto> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody ComplaintStatusUpdateRequest req,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        return ResponseEntity.ok(complaintService.updateComplaintStatus(id, req, currentUser.getUsername()));
    }

    @PostMapping("/{id}/comments")
    public ResponseEntity<ComplaintDto> addComment(
            @PathVariable Long id,
            @Valid @RequestBody ComplaintCommentRequest req,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        boolean isWarden = currentUser.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_WARDEN"));
        if (!isWarden) {
            StudentProfileDto student = studentService.getProfileByUserId(currentUser.getId());
            ComplaintDto complaint = complaintService.getComplaintById(id);
            if (!complaint.getStudentId().equals(student.getId())) {
                throw new AccessDeniedException("Access denied: You can only comment on your own complaints");
            }
        }
        String role = isWarden ? "WARDEN" : "STUDENT";
        return ResponseEntity.ok(complaintService.addComment(id, req.getComment(), currentUser.getUsername(), role));
    }
}
