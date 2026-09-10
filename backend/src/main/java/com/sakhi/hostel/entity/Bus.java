package com.sakhi.hostel.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "buses")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Bus {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 30)
    private String busNumber;

    @Column(nullable = false, length = 100)
    private String routeName;

    @Column(nullable = false)
    @Builder.Default
    private Integer totalSeats = 40;

    @Column(length = 100)
    private String driverName;

    @Column(length = 20)
    private String driverPhone;

    @Builder.Default
    @Column(nullable = false)
    private Boolean active = true;
}
