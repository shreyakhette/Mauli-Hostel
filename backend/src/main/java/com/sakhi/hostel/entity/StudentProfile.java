package com.sakhi.hostel.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "student_profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    @JsonIgnoreProperties({"password", "hibernateLazyInitializer", "handler"})
    private User user;

    @Column(nullable = false, unique = true, length = 30)
    private String studentId;

    @Column(nullable = false, length = 100)
    private String fullName;

    @Column(nullable = false, length = 100)
    private String email;

    @Column(nullable = false, length = 20)
    private String mobile;

    private LocalDate dateOfBirth;

    @Column(length = 10)
    private String bloodGroup;

    // Academic Details
    @Column(nullable = false, length = 100)
    private String department;

    @Column(nullable = false, length = 50)
    private String course;

    @Column(nullable = false, length = 20)
    private String academicYear;

    @Column(nullable = false, length = 150)
    private String college;

    // Guardian Details
    @Column(nullable = false, length = 100)
    private String guardianName;

    @Column(nullable = false, length = 20)
    private String guardianContact;

    @Column(length = 50)
    private String guardianRelationship;

    @Column(nullable = false, length = 20)
    private String emergencyContact;

    @Column(length = 255)
    private String address;

    // Hostel Allocation
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id")
    @JsonIgnoreProperties({"beds", "hibernateLazyInitializer", "handler"})
    private Room room;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bed_id", unique = true)
    @JsonIgnoreProperties({"room", "student", "hibernateLazyInitializer", "handler"})
    private Bed bed;

    private LocalDate joiningDate;

    @Builder.Default
    @Column(length = 20)
    private String status = "ACTIVE";

    @Column(length = 255)
    private String profilePhotoUrl;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
