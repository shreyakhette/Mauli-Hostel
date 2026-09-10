package com.sakhi.hostel.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RegisterRequest {

    // Step 1: Personal Information
    @NotBlank(message = "Full name is required")
    @Size(min = 2, max = 100, message = "Full name must be between 2 and 100 characters")
    private String fullName;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Mobile number is required")
    @Pattern(regexp = "^[0-9+ -]{10,15}$", message = "Invalid mobile number")
    private String mobile;

    private LocalDate dateOfBirth;
    private String bloodGroup;

    // Step 2: Academic Information
    @NotBlank(message = "Department is required")
    private String department;

    @NotBlank(message = "Course is required")
    private String course;

    @NotBlank(message = "Academic year is required")
    private String academicYear; // e.g. "1st Year", "2nd Year", "3rd Year", "4th Year"

    @NotBlank(message = "College name is required")
    private String college;

    // Step 3: Guardian Information
    @NotBlank(message = "Guardian name is required")
    private String guardianName;

    @NotBlank(message = "Guardian contact number is required")
    @Pattern(regexp = "^[0-9+ -]{10,15}$", message = "Invalid guardian contact number")
    private String guardianContact;

    private String guardianRelationship;

    @NotBlank(message = "Emergency contact is required")
    @Pattern(regexp = "^[0-9+ -]{10,15}$", message = "Invalid emergency contact number")
    private String emergencyContact;

    private String address;

    // Step 4: Account Credentials
    @NotBlank(message = "Username is required")
    @Size(min = 3, max = 30, message = "Username must be between 3 and 30 characters")
    private String username;

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;
}
