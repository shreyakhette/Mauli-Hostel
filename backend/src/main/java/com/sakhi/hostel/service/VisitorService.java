package com.sakhi.hostel.service;

import com.sakhi.hostel.dto.VisitorDto;
import com.sakhi.hostel.entity.Notification;
import com.sakhi.hostel.entity.StudentProfile;
import com.sakhi.hostel.entity.Visitor;
import com.sakhi.hostel.exception.ResourceNotFoundException;
import com.sakhi.hostel.repository.StudentProfileRepository;
import com.sakhi.hostel.repository.VisitorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VisitorService {

    private final VisitorRepository visitorRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final NotificationService notificationService;

    @Transactional
    public VisitorDto requestVisitor(Long studentProfileId, VisitorDto.Request req) {
        StudentProfile student = studentProfileRepository.findById(studentProfileId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with ID: " + studentProfileId));

        Visitor visitor = Visitor.builder()
                .student(student)
                .visitorName(req.getVisitorName().trim())
                .relationship(req.getRelationship().trim())
                .phone(req.getPhone().trim())
                .visitDate(req.getVisitDate())
                .entryTime(req.getEntryTime().trim())
                .exitTime(req.getExitTime())
                .purpose(req.getPurpose().trim())
                .status(Visitor.VisitorStatus.PENDING)
                .build();

        visitor = visitorRepository.save(visitor);

        notificationService.createNotification(
                student.getUser(),
                "Visitor Pass Requested",
                "Your visitor pass for " + visitor.getVisitorName() + " on " + visitor.getVisitDate() + " has been submitted for Warden review.",
                Notification.NotificationType.SYSTEM,
                "/student/visitors"
        );

        return mapToDto(visitor);
    }

    @Transactional
    public VisitorDto reviewVisitor(Long visitorId, VisitorDto.Review req, String reviewerName) {
        Visitor visitor = visitorRepository.findById(visitorId)
                .orElseThrow(() -> new ResourceNotFoundException("Visitor not found with ID: " + visitorId));

        Visitor.VisitorStatus status = Visitor.VisitorStatus.valueOf(req.getStatus().toUpperCase());
        visitor.setStatus(status);
        visitor.setWardenRemarks(req.getRemarks());

        visitor = visitorRepository.save(visitor);

        // Notify student
        String statusText = status.name();
        notificationService.createNotification(
                visitor.getStudent().getUser(),
                "Visitor Pass " + statusText,
                "The visitor pass for " + visitor.getVisitorName() + " has been " + statusText +
                        (req.getRemarks() != null ? ": " + req.getRemarks() : "."),
                Notification.NotificationType.SYSTEM,
                "/student/visitors"
        );

        return mapToDto(visitor);
    }

    @Transactional(readOnly = true)
    public List<VisitorDto> getStudentVisitors(Long studentProfileId) {
        return visitorRepository.findByStudentIdOrderByCreatedAtDesc(studentProfileId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<VisitorDto> getAllVisitors(String statusStr) {
        Visitor.VisitorStatus status = null;
        if (statusStr != null && !statusStr.isBlank()) {
            try {
                status = Visitor.VisitorStatus.valueOf(statusStr.toUpperCase());
            } catch (IllegalArgumentException ignored) {}
        }
        return visitorRepository.filterVisitors(status).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<VisitorDto> getTodayVisitors() {
        return visitorRepository.findByVisitDate(LocalDate.now()).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public VisitorDto mapToDto(Visitor v) {
        return VisitorDto.builder()
                .id(v.getId())
                .studentId(v.getStudent().getId())
                .studentName(v.getStudent().getFullName())
                .studentSystemId(v.getStudent().getStudentId())
                .roomNumber(v.getStudent().getRoom() != null ? v.getStudent().getRoom().getRoomNumber() : "Unassigned")
                .visitorName(v.getVisitorName())
                .relationship(v.getRelationship())
                .phone(v.getPhone())
                .visitDate(v.getVisitDate())
                .entryTime(v.getEntryTime())
                .exitTime(v.getExitTime())
                .purpose(v.getPurpose())
                .status(v.getStatus().name())
                .wardenRemarks(v.getWardenRemarks())
                .createdAt(v.getCreatedAt())
                .build();
    }
}
