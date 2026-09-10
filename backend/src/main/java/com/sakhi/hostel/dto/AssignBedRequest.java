package com.sakhi.hostel.dto;

import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AssignBedRequest {

    @NotNull(message = "Bed ID is required")
    private Long bedId;

    @NotNull(message = "Student ID is required")
    private Long studentId;
}
