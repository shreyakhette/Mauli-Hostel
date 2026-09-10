package com.sakhi.hostel.controller;

import com.sakhi.hostel.dto.NoticeDto;
import com.sakhi.hostel.dto.NoticeRequest;
import com.sakhi.hostel.security.UserPrincipal;
import com.sakhi.hostel.service.NoticeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notices")
@RequiredArgsConstructor
public class NoticeController {

    private final NoticeService noticeService;

    @GetMapping
    public ResponseEntity<List<NoticeDto>> getActiveNotices(@RequestParam(required = false) String category) {
        return ResponseEntity.ok(noticeService.getActiveNotices(category));
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('WARDEN')")
    public ResponseEntity<List<NoticeDto>> getAllNotices() {
        return ResponseEntity.ok(noticeService.getAllNotices());
    }

    @GetMapping("/{id}")
    public ResponseEntity<NoticeDto> getNoticeById(@PathVariable Long id) {
        return ResponseEntity.ok(noticeService.getNoticeById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('WARDEN')")
    public ResponseEntity<NoticeDto> createNotice(
            @Valid @RequestBody NoticeRequest req,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        return new ResponseEntity<>(noticeService.createNotice(req, currentUser.getUsername()), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('WARDEN')")
    public ResponseEntity<NoticeDto> updateNotice(
            @PathVariable Long id,
            @Valid @RequestBody NoticeRequest req) {
        return ResponseEntity.ok(noticeService.updateNotice(id, req));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('WARDEN')")
    public ResponseEntity<Void> deleteNotice(@PathVariable Long id) {
        noticeService.deleteNotice(id);
        return ResponseEntity.noContent().build();
    }
}
