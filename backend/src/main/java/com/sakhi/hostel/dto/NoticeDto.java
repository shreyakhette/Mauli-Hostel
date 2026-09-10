package com.sakhi.hostel.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NoticeDto {

    private Long id;
    private String title;
    private String content;
    private String category;
    private String priority;
    private Boolean isPinned;
    private Boolean isImportant;
    private LocalDate publishDate;
    private LocalDate expiryDate;
    private String createdBy;
    private LocalDateTime createdAt;
}
