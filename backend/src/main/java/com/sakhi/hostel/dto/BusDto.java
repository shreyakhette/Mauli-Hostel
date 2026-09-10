package com.sakhi.hostel.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BusDto {

    private Long id;
    private String busNumber;
    private String routeName;
    private Integer totalSeats;
    private String driverName;
    private String driverPhone;
    private Boolean active;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ScheduleDto {
        private Long id;
        private Long busId;
        private String busNumber;
        private String dayOfWeek;
        private String route;
        private String departureTime;
        private String returnTime;
        private Integer totalSeats;
        private Integer availableSeats;
        private String status;
        private String notes;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ScheduleRequest {
        @NotNull(message = "Bus ID is required")
        private Long busId;

        @NotBlank(message = "Day of week is required")
        private String dayOfWeek;

        @NotBlank(message = "Route is required")
        private String route;

        @NotBlank(message = "Departure time is required")
        private String departureTime;

        private String returnTime;

        @NotNull(message = "Total seats is required")
        private Integer totalSeats;

        @NotNull(message = "Available seats is required")
        private Integer availableSeats;

        private String status;
        private String notes;
    }
}
