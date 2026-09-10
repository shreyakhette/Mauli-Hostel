package com.sakhi.hostel.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HostelConfigDto {

    private Long id;

    @NotBlank(message = "Hostel name is required")
    private String name;

    @NotNull
    @Min(value = 1, message = "Total rooms must be at least 1")
    private Integer totalRooms;

    @NotNull
    @Min(value = 1, message = "Beds per room must be at least 1")
    private Integer bedsPerRoom;

    @NotNull
    @Min(value = 1, message = "Total floors must be at least 1")
    private Integer totalFloors;

    private Integer totalCapacity;
    private String address;
    private String contactNumber;
    private String email;

    // Live statistics
    private Integer occupiedBeds;
    private Integer availableBeds;
    private Double occupancyPercentage;
}
