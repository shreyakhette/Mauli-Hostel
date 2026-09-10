package com.sakhi.hostel.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MessMenuDto {

    private Long id;

    @NotBlank(message = "Day of week is required")
    private String dayOfWeek;

    @NotBlank(message = "Breakfast is required")
    private String breakfast;

    @NotBlank(message = "Lunch is required")
    private String lunch;

    @NotBlank(message = "Snacks is required")
    private String snacks;

    @NotBlank(message = "Dinner is required")
    private String dinner;

    private String specialNotes;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class FeedbackRequest {
        @NotBlank(message = "Day of week is required")
        private String dayOfWeek;

        @NotBlank(message = "Meal type is required")
        private String mealType; // BREAKFAST, LUNCH, SNACKS, DINNER

        @NotNull(message = "Rating is required")
        private Integer rating; // 1 to 5

        private String comment;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class FeedbackDto {
        private Long id;
        private Long studentId;
        private String studentName;
        private String dayOfWeek;
        private String mealType;
        private Integer rating;
        private String comment;
        private LocalDateTime createdAt;
    }
}
