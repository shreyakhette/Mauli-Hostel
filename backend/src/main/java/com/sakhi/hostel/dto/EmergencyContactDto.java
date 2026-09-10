package com.sakhi.hostel.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmergencyContactDto {

    private Long id;

    @NotBlank(message = "Title is required")
    private String title; // "WARDEN", "HOSTEL OFFICE", "SECURITY", "HOSPITAL", "AMBULANCE", "POLICE", "FIRE"

    private String contactPerson;

    @NotBlank(message = "Phone number is required")
    private String phoneNumber;

    private String altPhone;
    private String location;
    private String description;
    private Integer orderIndex;
    private Boolean isActive;
}
