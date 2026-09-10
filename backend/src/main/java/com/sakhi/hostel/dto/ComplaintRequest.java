package com.sakhi.hostel.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ComplaintRequest {

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    @NotBlank(message = "Category is required")
    private String category; // WATER, ELECTRICITY, CLEANING, FOOD, ROOM, BATHROOM, INTERNET, SECURITY, MAINTENANCE, OTHER

    private String priority; // LOW, MEDIUM, HIGH, URGENT
    private String roomNumber;
}
