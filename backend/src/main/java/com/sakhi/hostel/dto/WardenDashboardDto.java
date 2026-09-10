package com.sakhi.hostel.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WardenDashboardDto {

    private String wardenName;
    private String greeting;

    // Capacity & Occupancy Overview
    private Integer totalBeds;
    private Integer occupiedBeds;
    private Integer availableBeds;
    private Integer totalRooms;
    private Double occupancyPercentage;

    // Key Operational Metrics
    private Long pendingLeavesCount;
    private Long openComplaintsCount;
    private Long todayAttendanceMarked;
    private Long todayAttendancePresent;
    private Long todayVisitorsCount;

    // Breakdown for occupancy charts (Today, This Week, This Month)
    private OccupancyBreakdown occupancyToday;
    private OccupancyBreakdown occupancyWeek;
    private OccupancyBreakdown occupancyMonth;

    // Recent items for quick actions
    private List<LeaveDto> recentPendingLeaves;
    private List<ComplaintDto> recentOpenComplaints;
    private List<NoticeDto> activeNotices;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class OccupancyBreakdown {
        private String period; // "Today", "This Week", "This Month"
        private Integer totalCapacity;
        private Integer occupied;
        private Integer available;
        private Integer maintenance;
        private Double occupancyRate;
    }
}
