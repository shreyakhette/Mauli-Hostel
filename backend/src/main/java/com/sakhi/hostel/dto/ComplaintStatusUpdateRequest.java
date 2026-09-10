package com.sakhi.hostel.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ComplaintStatusUpdateRequest {

    @NotBlank(message = "Status is required")
    private String status; // OPEN, IN_PROGRESS, RESOLVED, REJECTED

    private String resolutionRemarks;
}
