package com.sakhi.hostel.controller;

import com.sakhi.hostel.dto.HostelConfigDto;
import com.sakhi.hostel.dto.PasswordChangeRequest;
import com.sakhi.hostel.security.UserPrincipal;
import com.sakhi.hostel.service.SettingsService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/settings")
@RequiredArgsConstructor
public class SettingsController {

    private final SettingsService settingsService;

    @GetMapping("/hostel")
    public ResponseEntity<HostelConfigDto> getHostelConfig() {
        return ResponseEntity.ok(settingsService.getHostelConfig());
    }

    @PutMapping("/hostel")
    @PreAuthorize("hasRole('WARDEN')")
    public ResponseEntity<HostelConfigDto> updateHostelConfig(@Valid @RequestBody HostelConfigDto dto) {
        return ResponseEntity.ok(settingsService.updateHostelConfig(dto));
    }

    @PostMapping("/change-password")
    public ResponseEntity<Void> changePassword(
            @Valid @RequestBody PasswordChangeRequest req,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        settingsService.changePassword(currentUser.getId(), req);
        return ResponseEntity.noContent().build();
    }
}
