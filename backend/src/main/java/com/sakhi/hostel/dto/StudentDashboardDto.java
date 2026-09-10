package com.sakhi.hostel.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentDashboardDto {

    private String studentName;
    private String studentId;
    private String greeting;

    // Room info
    private RoomSummary roomSummary;

    // Stats
    private Double attendancePercentage;
    private Long attendancePresent;
    private Long attendanceAbsent;
    private Long attendanceLate;
    private Long pendingLeavesCount;
    private Long openComplaintsCount;

    // Bus highlight (Tuesday Bus or today's bus)
    private BusDto.ScheduleDto featuredBus;

    // Recent Notices
    private List<NoticeDto> recentNotices;

    // Recent Complaints
    private List<ComplaintDto> activeComplaints;

    // Recent Leave
    private LeaveDto activeLeave;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class RoomSummary {
        private String roomNumber;
        private Integer floor;
        private String bedLabel;
        private Integer roommateCount;
        private Integer availableBedsCount;
        private List<String> roommates;
    }
}
