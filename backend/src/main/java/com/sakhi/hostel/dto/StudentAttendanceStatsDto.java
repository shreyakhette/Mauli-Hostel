package com.sakhi.hostel.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentAttendanceStatsDto {

    private Long studentId;
    private String studentName;
    private long totalMarkedDays;
    private long presentCount;
    private long absentCount;
    private long lateCount;
    private long leaveCount;
    private double percentage;
    private List<AttendanceDto> recentHistory;
}
