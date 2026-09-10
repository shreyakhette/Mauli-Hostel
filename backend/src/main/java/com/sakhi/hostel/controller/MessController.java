package com.sakhi.hostel.controller;

import com.sakhi.hostel.dto.MessMenuDto;
import com.sakhi.hostel.dto.StudentProfileDto;
import com.sakhi.hostel.security.UserPrincipal;
import com.sakhi.hostel.service.MessService;
import com.sakhi.hostel.service.StudentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/mess")
@RequiredArgsConstructor
public class MessController {

    private final MessService messService;
    private final StudentService studentService;

    @GetMapping("/weekly-menu")
    public ResponseEntity<List<MessMenuDto>> getWeeklyMenu() {
        return ResponseEntity.ok(messService.getWeeklyMenu());
    }

    @GetMapping("/menu/{day}")
    public ResponseEntity<MessMenuDto> getMenuByDay(@PathVariable String day) {
        return ResponseEntity.ok(messService.getMenuByDay(day));
    }

    @PutMapping("/menu/{day}")
    @PreAuthorize("hasRole('WARDEN')")
    public ResponseEntity<MessMenuDto> updateMenu(@PathVariable String day, @Valid @RequestBody MessMenuDto dto) {
        return ResponseEntity.ok(messService.updateMenu(day, dto));
    }

    @PostMapping("/feedback")
    public ResponseEntity<MessMenuDto.FeedbackDto> submitFeedback(
            @Valid @RequestBody MessMenuDto.FeedbackRequest req,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        StudentProfileDto student = studentService.getProfileByUserId(currentUser.getId());
        return new ResponseEntity<>(messService.submitFeedback(student.getId(), req), HttpStatus.CREATED);
    }

    @GetMapping("/feedback/{day}")
    public ResponseEntity<List<MessMenuDto.FeedbackDto>> getFeedback(@PathVariable String day) {
        return ResponseEntity.ok(messService.getFeedbackByDay(day));
    }
}
