package com.sakhi.hostel.dto;

import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ComplaintDto {

    private Long id;
    private String ticketNumber;
    private String title;
    private String description;
    private String category;
    private String status;
    private String priority;
    private Long studentId;
    private String studentName;
    private String studentSystemId;
    private String roomNumber;
    private String resolutionRemarks;
    private LocalDateTime resolvedAt;
    private LocalDateTime createdAt;
    private List<CommentDto> comments;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CommentDto {
        private Long id;
        private String authorName;
        private String authorRole;
        private String comment;
        private LocalDateTime createdAt;
    }
}
