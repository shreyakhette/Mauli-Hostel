package com.sakhi.hostel.controller;

import com.sakhi.hostel.dto.EmergencyContactDto;
import com.sakhi.hostel.service.EmergencyService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/emergency")
@RequiredArgsConstructor
public class EmergencyController {

    private final EmergencyService emergencyService;

    @GetMapping
    public ResponseEntity<List<EmergencyContactDto>> getActiveContacts() {
        return ResponseEntity.ok(emergencyService.getActiveContacts());
    }

    @GetMapping("/public")
    public ResponseEntity<List<EmergencyContactDto>> getPublicContacts() {
        return ResponseEntity.ok(emergencyService.getActiveContacts());
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('WARDEN')")
    public ResponseEntity<List<EmergencyContactDto>> getAllContacts() {
        return ResponseEntity.ok(emergencyService.getAllContacts());
    }

    @PostMapping
    @PreAuthorize("hasRole('WARDEN')")
    public ResponseEntity<EmergencyContactDto> createContact(@Valid @RequestBody EmergencyContactDto dto) {
        return new ResponseEntity<>(emergencyService.createContact(dto), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('WARDEN')")
    public ResponseEntity<EmergencyContactDto> updateContact(@PathVariable Long id, @Valid @RequestBody EmergencyContactDto dto) {
        return ResponseEntity.ok(emergencyService.updateContact(id, dto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('WARDEN')")
    public ResponseEntity<Void> deleteContact(@PathVariable Long id) {
        emergencyService.deleteContact(id);
        return ResponseEntity.noContent().build();
    }
}
