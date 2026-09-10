package com.sakhi.hostel.controller;

import com.sakhi.hostel.dto.WardenDashboardDto;
import com.sakhi.hostel.dto.WardenProfileDto;
import com.sakhi.hostel.security.UserPrincipal;
import com.sakhi.hostel.service.WardenService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/warden")
@PreAuthorize("hasRole('WARDEN')")
@RequiredArgsConstructor
public class WardenController {

    private final WardenService wardenService;

    @GetMapping("/me")
    public ResponseEntity<WardenProfileDto> getMyProfile(@AuthenticationPrincipal UserPrincipal currentUser) {
        return ResponseEntity.ok(wardenService.getProfileByUserId(currentUser.getId()));
    }

    @PutMapping("/me")
    public ResponseEntity<WardenProfileDto> updateMyProfile(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @RequestBody WardenProfileDto.UpdateRequest req) {
        WardenProfileDto profile = wardenService.getProfileByUserId(currentUser.getId());
        return ResponseEntity.ok(wardenService.updateProfile(profile.getId(), req));
    }

    @GetMapping("/dashboard")
    public ResponseEntity<WardenDashboardDto> getWardenDashboard() {
        return ResponseEntity.ok(wardenService.getWardenDashboard());
    }
}
