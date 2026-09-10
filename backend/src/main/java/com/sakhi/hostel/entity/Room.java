package com.sakhi.hostel.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "rooms")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Room {

    public enum RoomStatus {
        AVAILABLE,
        PARTIAL,
        FULL,
        MAINTENANCE
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 20)
    private String roomNumber;

    @Column(nullable = false)
    private Integer floor;

    @Column(nullable = false)
    @Builder.Default
    private Integer capacity = 4;

    @Column(nullable = false)
    @Builder.Default
    private Integer occupiedCount = 0;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private RoomStatus status = RoomStatus.AVAILABLE;

    @OneToMany(mappedBy = "room", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonIgnoreProperties("room")
    @Builder.Default
    private List<Bed> beds = new ArrayList<>();

    public void updateStatus() {
        if (this.status == RoomStatus.MAINTENANCE) {
            return;
        }
        if (this.occupiedCount == 0) {
            this.status = RoomStatus.AVAILABLE;
        } else if (this.occupiedCount >= this.capacity) {
            this.status = RoomStatus.FULL;
        } else {
            this.status = RoomStatus.PARTIAL;
        }
    }
}
