package com.sakhi.hostel.service;

import com.sakhi.hostel.dto.LeaveDto;
import com.sakhi.hostel.entity.LeaveApplication;
import com.sakhi.hostel.entity.Notification;
import com.sakhi.hostel.entity.StudentProfile;
import com.sakhi.hostel.exception.BadRequestException;
import com.sakhi.hostel.exception.ResourceNotFoundException;
import com.sakhi.hostel.repository.LeaveApplicationRepository;
import com.sakhi.hostel.repository.StudentProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LeaveService {

    private final LeaveApplicationRepository leaveRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final NotificationService notificationService;

    @Transactional
    public LeaveDto applyLeave(Long studentProfileId, LeaveDto.ApplyRequest req) {
        if (req.getToDate().isBefore(req.getFromDate())) {
            throw new BadRequestException("Return date cannot be before departure date.");
        }

        StudentProfile student = studentProfileRepository.findById(studentProfileId)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found with ID: " + studentProfileId));

        LeaveApplication leave = LeaveApplication.builder()
                .student(student)
                .fromDate(req.getFromDate())
                .toDate(req.getToDate())
                .reason(req.getReason().trim())
                .destination(req.getDestination().trim())
                .guardianContact(req.getGuardianContact().trim())
                .additionalNotes(req.getAdditionalNotes())
                .status(LeaveApplication.LeaveStatus.PENDING)
                .build();

        leave = leaveRepository.save(leave);

        notificationService.createNotification(
                student.getUser(),
                "Leave Application Submitted",
                "Your leave request to " + leave.getDestination() + " from " + leave.getFromDate() + " to " + leave.getToDate() + " has been submitted for Warden review.",
                Notification.NotificationType.LEAVE,
                "/student/leave"
        );

        return mapToDto(leave);
    }

    @Transactional
    public LeaveDto reviewLeave(Long leaveId, LeaveDto.ReviewRequest req, String reviewerName) {
        LeaveApplication leave = leaveRepository.findById(leaveId)
                .orElseThrow(() -> new ResourceNotFoundException("Leave application not found with ID: " + leaveId));

        LeaveApplication.LeaveStatus status = LeaveApplication.LeaveStatus.valueOf(req.getStatus().toUpperCase());
        leave.setStatus(status);
        leave.setWardenRemarks(req.getRemarks());
        leave.setReviewedBy(reviewerName);
        leave.setReviewedAt(LocalDateTime.now());

        leave = leaveRepository.save(leave);

        // Notify student of approval / rejection
        String statusText = status == LeaveApplication.LeaveStatus.APPROVED ? "APPROVED" : "REJECTED";
        notificationService.createNotification(
                leave.getStudent().getUser(),
                "Leave Application " + statusText,
                "Your leave application to " + leave.getDestination() + " has been " + statusText +
                        (req.getRemarks() != null && !req.getRemarks().isBlank() ? ". Remarks: " + req.getRemarks() : "."),
                Notification.NotificationType.LEAVE,
                "/student/leave"
        );

        return mapToDto(leave);
    }

    @Transactional(readOnly = true)
    public List<LeaveDto> getStudentLeaves(Long studentProfileId) {
        return leaveRepository.findByStudentIdOrderByAppliedAtDesc(studentProfileId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<LeaveDto> getAllLeaves(String statusStr) {
        LeaveApplication.LeaveStatus status = null;
        if (statusStr != null && !statusStr.isBlank()) {
            try {
                status = LeaveApplication.LeaveStatus.valueOf(statusStr.toUpperCase());
            } catch (IllegalArgumentException ignored) {}
        }
        return leaveRepository.filterLeaves(status).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public LeaveDto getLeaveById(Long id) {
        LeaveApplication leave = leaveRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Leave application not found with ID: " + id));
        return mapToDto(leave);
    }

    public LeaveDto mapToDto(LeaveApplication l) {
        return LeaveDto.builder()
                .id(l.getId())
                .studentId(l.getStudent().getId())
                .studentName(l.getStudent().getFullName())
                .studentSystemId(l.getStudent().getStudentId())
                .roomNumber(l.getStudent().getRoom() != null ? l.getStudent().getRoom().getRoomNumber() : "Unassigned")
                .fromDate(l.getFromDate())
                .toDate(l.getToDate())
                .reason(l.getReason())
                .destination(l.getDestination())
                .guardianContact(l.getGuardianContact())
                .additionalNotes(l.getAdditionalNotes())
                .status(l.getStatus().name())
                .wardenRemarks(l.getWardenRemarks())
                .reviewedBy(l.getReviewedBy())
                .appliedAt(l.getAppliedAt())
                .reviewedAt(l.getReviewedAt())
                .build();
    }
}
