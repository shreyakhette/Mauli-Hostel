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
public class VisitorDto {

    private Long id;
    private Long studentId;
    private String studentName;
    private String studentSystemId;
    private String roomNumber;
    private String visitorName;
    private String relationship;
    private String phone;
    private LocalDate visitDate;
    private String entryTime;
    private String exitTime;
    private String purpose;
    private String status; // PENDING, APPROVED, REJECTED, CHECKED_OUT
    private String wardenRemarks;
    private LocalDateTime createdAt;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Request {
        @NotBlank(message = "Visitor name is required")
        private String visitorName;

        @NotBlank(message = "Relationship is required")
        private String relationship;

        @NotBlank(message = "Phone number is required")
        private String phone;

        @NotNull(message = "Visit date is required")
        private LocalDate visitDate;

        @NotBlank(message = "Entry time is required")
        private String entryTime;

        private String exitTime;

        @NotBlank(message = "Purpose is required")
        private String purpose;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Review {
        @NotBlank(message = "Status is required")
        private String status; // APPROVED, REJECTED, CHECKED_OUT

        private String remarks;
    }
}
