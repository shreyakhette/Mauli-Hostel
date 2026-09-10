package com.sakhi.hostel.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "emergency_contacts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmergencyContact {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 50)
    private String title; // "WARDEN", "HOSTEL OFFICE", "SECURITY", "HOSPITAL", "AMBULANCE", "POLICE", "FIRE"

    @Column(length = 100)
    private String contactPerson;

    @Column(nullable = false, length = 30)
    private String phoneNumber;

    @Column(length = 30)
    private String altPhone;

    @Column(length = 150)
    private String location;

    @Column(length = 255)
    private String description;

    @Column(nullable = false)
    @Builder.Default
    private Integer orderIndex = 0;

    @Column(nullable = false)
    @Builder.Default
    private Boolean isActive = true;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
