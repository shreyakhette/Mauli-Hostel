package com.sakhi.hostel.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "bus_schedules")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BusSchedule {

    public enum BusStatus {
        ON_TIME,
        DELAYED,
        CANCELLED
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bus_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Bus bus;

    @Column(nullable = false, length = 20)
    private String dayOfWeek; // "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"

    @Column(nullable = false, length = 150)
    private String route; // "Hostel -> College" or "College -> Hostel"

    @Column(nullable = false, length = 20)
    private String departureTime; // "08:00 AM"

    @Column(length = 20)
    private String returnTime; // "04:30 PM"

    @Column(nullable = false)
    @Builder.Default
    private Integer totalSeats = 40;

    @Column(nullable = false)
    @Builder.Default
    private Integer availableSeats = 18;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private BusStatus status = BusStatus.ON_TIME;

    @Column(length = 255)
    private String notes;
}
