package com.sakhi.hostel.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LeaveDto {

    private Long id;
    private Long studentId;
    private String studentName;
    private String studentSystemId;
    private String roomNumber;
    private LocalDate fromDate;
    private LocalDate toDate;
    private String reason;
    private String destination;
    private String guardianContact;
    private String additionalNotes;
    private String status; // PENDING, APPROVED, REJECTED
    private String wardenRemarks;
    private String reviewedBy;
    private LocalDateTime appliedAt;
    private LocalDateTime reviewedAt;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ApplyRequest {
        @NotNull(message = "From date is required")
        private LocalDate fromDate;

        @NotNull(message = "To date is required")
        private LocalDate toDate;

        @NotBlank(message = "Reason is required")
        private String reason;

        @NotBlank(message = "Destination is required")
        private String destination;

        @NotBlank(message = "Guardian contact is required")
        private String guardianContact;

        private String additionalNotes;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ReviewRequest {
        @NotBlank(message = "Review status is required")
        private String status; // APPROVED or REJECTED

        private String remarks;
    }
}
