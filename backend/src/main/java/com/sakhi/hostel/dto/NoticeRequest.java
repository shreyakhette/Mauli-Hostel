package com.sakhi.hostel.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NoticeRequest {

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Content is required")
    private String content;

    private String category; // GENERAL, MESS, MAINTENANCE, ACADEMIC, DISCIPLINE, URGENT, EVENT
    private String priority; // LOW, NORMAL, HIGH, CRITICAL, URGENT
    private Boolean isPinned;
    private Boolean isImportant;
    private LocalDate publishDate;
    private LocalDate expiryDate;
}
