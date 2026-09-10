package com.sakhi.hostel.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "mess_feedback")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MessFeedback {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    @JsonIgnoreProperties({"user", "room", "bed", "hibernateLazyInitializer", "handler"})
    private StudentProfile student;

    @Column(nullable = false, length = 20)
    private String dayOfWeek;

    @Column(nullable = false, length = 30)
    private String mealType; // "BREAKFAST", "LUNCH", "SNACKS", "DINNER"

    @Column(nullable = false)
    private Integer rating; // 1 to 5

    @Column(length = 500)
    private String comment;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;
}
