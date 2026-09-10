package com.sakhi.hostel.service;

import com.sakhi.hostel.dto.ComplaintDto;
import com.sakhi.hostel.dto.ComplaintRequest;
import com.sakhi.hostel.dto.ComplaintStatusUpdateRequest;
import com.sakhi.hostel.entity.*;
import com.sakhi.hostel.exception.ResourceNotFoundException;
import com.sakhi.hostel.repository.ComplaintCommentRepository;
import com.sakhi.hostel.repository.ComplaintRepository;
import com.sakhi.hostel.repository.StudentProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ComplaintService {

    private final ComplaintRepository complaintRepository;
    private final ComplaintCommentRepository commentRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final NotificationService notificationService;

    @Transactional
    public ComplaintDto createComplaint(Long studentProfileId, ComplaintRequest req) {
        StudentProfile student = studentProfileRepository.findById(studentProfileId)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found with ID: " + studentProfileId));

        Complaint.ComplaintCategory category = Complaint.ComplaintCategory.OTHER;
        if (req.getCategory() != null) {
            try {
                category = Complaint.ComplaintCategory.valueOf(req.getCategory().toUpperCase());
            } catch (IllegalArgumentException ignored) {}
        }

        Complaint.Priority priority = Complaint.Priority.MEDIUM;
        if (req.getPriority() != null) {
            try {
                priority = Complaint.Priority.valueOf(req.getPriority().toUpperCase());
            } catch (IllegalArgumentException ignored) {}
        }

        long count = complaintRepository.count() + 1001;
        String ticketNumber = "CMP-" + count;

        String roomNum = req.getRoomNumber();
        if ((roomNum == null || roomNum.isBlank()) && student.getRoom() != null) {
            roomNum = student.getRoom().getRoomNumber();
        }

        Complaint complaint = Complaint.builder()
                .ticketNumber(ticketNumber)
                .title(req.getTitle().trim())
                .description(req.getDescription().trim())
                .category(category)
                .status(Complaint.ComplaintStatus.OPEN)
                .priority(priority)
                .student(student)
                .roomNumber(roomNum)
                .comments(new ArrayList<>())
                .build();

        complaint = complaintRepository.save(complaint);

        // Notify student of ticket creation
        notificationService.createNotification(
                student.getUser(),
                "Complaint Logged: " + ticketNumber,
                "Your complaint '" + complaint.getTitle() + "' has been received and assigned ticket number " + ticketNumber,
                Notification.NotificationType.COMPLAINT,
                "/student/complaints"
        );

        return mapToDto(complaint);
    }

    @Transactional
    public ComplaintDto updateComplaintStatus(Long complaintId, ComplaintStatusUpdateRequest req, String reviewerName) {
        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint not found with ID: " + complaintId));

        Complaint.ComplaintStatus newStatus = Complaint.ComplaintStatus.valueOf(req.getStatus().toUpperCase());
        complaint.setStatus(newStatus);

        if (req.getResolutionRemarks() != null && !req.getResolutionRemarks().isBlank()) {
            complaint.setResolutionRemarks(req.getResolutionRemarks().trim());
        }

        if (newStatus == Complaint.ComplaintStatus.RESOLVED) {
            complaint.setResolvedAt(LocalDateTime.now());
        }

        complaint = complaintRepository.save(complaint);

        // Notify student of status change
        notificationService.createNotification(
                complaint.getStudent().getUser(),
                "Complaint Status Updated: " + complaint.getTicketNumber(),
                "Your complaint status is now " + newStatus.name() + (complaint.getResolutionRemarks() != null ? ": " + complaint.getResolutionRemarks() : ""),
                Notification.NotificationType.COMPLAINT,
                "/student/complaints"
        );

        return mapToDto(complaint);
    }

    @Transactional
    public ComplaintDto addComment(Long complaintId, String commentText, String authorName, String authorRole) {
        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint not found with ID: " + complaintId));

        ComplaintComment comment = ComplaintComment.builder()
                .complaint(complaint)
                .authorName(authorName)
                .authorRole(authorRole)
                .comment(commentText.trim())
                .build();

        commentRepository.save(comment);

        // Notify other party
        if ("WARDEN".equalsIgnoreCase(authorRole)) {
            notificationService.createNotification(
                    complaint.getStudent().getUser(),
                    "New Note on Complaint " + complaint.getTicketNumber(),
                    authorName + ": " + (commentText.length() > 80 ? commentText.substring(0, 77) + "..." : commentText),
                    Notification.NotificationType.COMPLAINT,
                    "/student/complaints"
            );
        }

        return mapToDto(complaintRepository.findById(complaintId).orElse(complaint));
    }

    @Transactional(readOnly = true)
    public List<ComplaintDto> getStudentComplaints(Long studentProfileId) {
        return complaintRepository.findByStudentIdOrderByCreatedAtDesc(studentProfileId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ComplaintDto> getAllComplaints(String statusStr, String categoryStr) {
        Complaint.ComplaintStatus status = null;
        if (statusStr != null && !statusStr.isBlank()) {
            try {
                status = Complaint.ComplaintStatus.valueOf(statusStr.toUpperCase());
            } catch (IllegalArgumentException ignored) {}
        }

        Complaint.ComplaintCategory category = null;
        if (categoryStr != null && !categoryStr.isBlank()) {
            try {
                category = Complaint.ComplaintCategory.valueOf(categoryStr.toUpperCase());
            } catch (IllegalArgumentException ignored) {}
        }

        return complaintRepository.filterComplaints(status, category).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ComplaintDto getComplaintById(Long id) {
        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint not found with ID: " + id));
        return mapToDto(complaint);
    }

    public ComplaintDto mapToDto(Complaint c) {
        List<ComplaintDto.CommentDto> comments = commentRepository.findByComplaintIdOrderByCreatedAtAsc(c.getId()).stream()
                .map(comment -> ComplaintDto.CommentDto.builder()
                        .id(comment.getId())
                        .authorName(comment.getAuthorName())
                        .authorRole(comment.getAuthorRole())
                        .comment(comment.getComment())
                        .createdAt(comment.getCreatedAt())
                        .build())
                .collect(Collectors.toList());

        return ComplaintDto.builder()
                .id(c.getId())
                .ticketNumber(c.getTicketNumber())
                .title(c.getTitle())
                .description(c.getDescription())
                .category(c.getCategory().name())
                .status(c.getStatus().name())
                .priority(c.getPriority().name())
                .studentId(c.getStudent().getId())
                .studentName(c.getStudent().getFullName())
                .studentSystemId(c.getStudent().getStudentId())
                .roomNumber(c.getRoomNumber())
                .resolutionRemarks(c.getResolutionRemarks())
                .resolvedAt(c.getResolvedAt())
                .createdAt(c.getCreatedAt())
                .comments(comments)
                .build();
    }
}
