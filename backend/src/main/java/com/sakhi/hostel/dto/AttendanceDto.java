package com.sakhi.hostel.dto;

import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AttendanceDto {

    private Long id;
    private Long studentId;
    private String studentSystemId;
    private String studentName;
    private String roomNumber;
    private LocalDate date;
    private String status; // PRESENT, ABSENT, LATE, ON_LEAVE
    private String remarks;
    private String markedBy;
    private LocalDateTime markedAt;
}
