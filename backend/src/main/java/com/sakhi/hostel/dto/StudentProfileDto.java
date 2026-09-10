package com.sakhi.hostel.dto;

import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentProfileDto {

    private Long id;
    private Long userId;
    private String studentId;
    private String fullName;
    private String email;
    private String mobile;
    private LocalDate dateOfBirth;
    private String bloodGroup;

    // Academic
    private String department;
    private String course;
    private String academicYear;
    private String college;

    // Guardian
    private String guardianName;
    private String guardianContact;
    private String guardianRelationship;
    private String emergencyContact;
    private String address;

    // Hostel & Room
    private Long roomId;
    private String roomNumber;
    private Integer floor;
    private Long bedId;
    private String bedLabel;
    private Integer bedNumber;
    private LocalDate joiningDate;
    private String status;
    private String profilePhotoUrl;
    private LocalDateTime createdAt;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class UpdateRequest {
        private String mobile;
        private String emergencyContact;
        private String address;
        private String guardianContact;
        private String profilePhotoUrl;
    }
}
