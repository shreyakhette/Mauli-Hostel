package com.sakhi.hostel.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthResponse {

    private String token;
    @Builder.Default
    private String tokenType = "Bearer";

    private Long userId;
    private String username;
    private String email;
    private String role;

    // Profile summary
    private String fullName;
    private String studentId;
    private String roomNumber;
    private String bedLabel;
    private String designation;
    private String profilePhotoUrl;
}
