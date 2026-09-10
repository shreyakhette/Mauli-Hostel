package com.sakhi.hostel.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "hostels")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Hostel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false)
    private Integer totalRooms;

    @Column(nullable = false)
    private Integer bedsPerRoom;

    @Column(nullable = false)
    private Integer totalFloors;

    @Column(nullable = false)
    private Integer totalCapacity;

    @Column(length = 255)
    private String address;

    @Column(length = 30)
    private String contactNumber;

    @Column(length = 100)
    private String email;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
