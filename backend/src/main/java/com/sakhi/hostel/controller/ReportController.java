package com.sakhi.hostel.controller;

import com.sakhi.hostel.dto.ReportsSummaryDto;
import com.sakhi.hostel.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/reports")
@PreAuthorize("hasRole('WARDEN')")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @GetMapping("/summary")
    public ResponseEntity<ReportsSummaryDto> getReportsSummary() {
        return ResponseEntity.ok(reportService.getReportsSummary());
    }
}
