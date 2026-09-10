package com.sakhi.hostel.dto;

import lombok.*;

import java.util.List;
import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReportsSummaryDto {

    // Occupancy
    private OccupancyReport occupancy;

    // Complaints
    private ComplaintReport complaints;

    // Leaves
    private LeaveReport leaves;

    // Attendance Trends
    private List<AttendanceTrendItem> attendanceTrends;

    // Visitors
    private VisitorReport visitors;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class OccupancyReport {
        private int totalBeds;
        private int occupiedBeds;
        private int availableBeds;
        private int maintenanceBeds;
        private double occupancyPercentage;
        private Map<Integer, Integer> occupiedByFloor; // Floor -> count
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ComplaintReport {
        private long total;
        private long open;
        private long inProgress;
        private long resolved;
        private long rejected;
        private Map<String, Long> byCategory;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class LeaveReport {
        private long total;
        private long pending;
        private long approved;
        private long rejected;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class AttendanceTrendItem {
        private String date;
        private long present;
        private long absent;
        private long late;
        private long onLeave;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class VisitorReport {
        private long totalMonthly;
        private long approved;
        private long pending;
        private long todayCount;
    }
}
