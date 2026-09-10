package com.sakhi.hostel.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "beds", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"room_id", "bed_number"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Bed {

    public enum BedStatus {
        AVAILABLE,
        OCCUPIED,
        MAINTENANCE
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "bed_number", nullable = false)
    private Integer bedNumber;

    @Column(nullable = false, length = 20)
    private String bedLabel; // "Bed 1", "Bed 2", etc.

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private BedStatus status = BedStatus.AVAILABLE;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id", nullable = false)
    @JsonIgnoreProperties({"beds", "hibernateLazyInitializer", "handler"})
    private Room room;

    @OneToOne(mappedBy = "bed", fetch = FetchType.LAZY)
    @JsonIgnoreProperties({"bed", "user", "hibernateLazyInitializer", "handler"})
    private StudentProfile student;
}
