package com.sakhi.hostel.controller;

import com.sakhi.hostel.dto.StudentProfileDto;
import com.sakhi.hostel.dto.VisitorDto;
import com.sakhi.hostel.security.UserPrincipal;
import com.sakhi.hostel.service.StudentService;
import com.sakhi.hostel.service.VisitorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/visitors")
@RequiredArgsConstructor
public class VisitorController {

    private final VisitorService visitorService;
    private final StudentService studentService;

    @GetMapping("/my")
    public ResponseEntity<List<VisitorDto>> getMyVisitors(@AuthenticationPrincipal UserPrincipal currentUser) {
        StudentProfileDto student = studentService.getProfileByUserId(currentUser.getId());
        return ResponseEntity.ok(visitorService.getStudentVisitors(student.getId()));
    }

    @GetMapping
    @PreAuthorize("hasRole('WARDEN')")
    public ResponseEntity<List<VisitorDto>> getAllVisitors(@RequestParam(required = false) String status) {
        return ResponseEntity.ok(visitorService.getAllVisitors(status));
    }

    @GetMapping("/today")
    @PreAuthorize("hasRole('WARDEN')")
    public ResponseEntity<List<VisitorDto>> getTodayVisitors() {
        return ResponseEntity.ok(visitorService.getTodayVisitors());
    }

    @PostMapping("/request")
    public ResponseEntity<VisitorDto> requestVisitor(
            @Valid @RequestBody VisitorDto.Request req,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        StudentProfileDto student = studentService.getProfileByUserId(currentUser.getId());
        return new ResponseEntity<>(visitorService.requestVisitor(student.getId(), req), HttpStatus.CREATED);
    }

    @PatchMapping("/{id}/review")
    @PreAuthorize("hasRole('WARDEN')")
    public ResponseEntity<VisitorDto> reviewVisitor(
            @PathVariable Long id,
            @Valid @RequestBody VisitorDto.Review req,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        return ResponseEntity.ok(visitorService.reviewVisitor(id, req, currentUser.getUsername()));
    }
}
