package com.sakhi.hostel.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "mess_menus")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MessMenu {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 20)
    private String dayOfWeek; // "MONDAY", "TUESDAY", etc.

    @Column(nullable = false, length = 255)
    private String breakfast;

    @Column(nullable = false, length = 255)
    private String lunch;

    @Column(nullable = false, length = 255)
    private String snacks;

    @Column(nullable = false, length = 255)
    private String dinner;

    @Column(length = 255)
    private String specialNotes;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
