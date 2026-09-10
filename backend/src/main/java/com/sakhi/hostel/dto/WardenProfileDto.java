package com.sakhi.hostel.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WardenProfileDto {

    private Long id;
    private Long userId;
    private String fullName;
    private String email;
    private String phone;
    private String designation;
    private String officeHours;
    private String emergencyPhone;
    private String profilePhotoUrl;
    private LocalDateTime updatedAt;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class UpdateRequest {
        private String fullName;
        private String phone;
        private String designation;
        private String officeHours;
        private String emergencyPhone;
        private String profilePhotoUrl;
    }
}
