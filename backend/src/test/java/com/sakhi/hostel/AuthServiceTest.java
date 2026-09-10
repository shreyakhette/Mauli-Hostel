package com.sakhi.hostel;

import com.sakhi.hostel.dto.AuthResponse;
import com.sakhi.hostel.dto.LoginRequest;
import com.sakhi.hostel.dto.RegisterRequest;
import com.sakhi.hostel.entity.Role;
import com.sakhi.hostel.entity.User;
import com.sakhi.hostel.exception.ConflictException;
import com.sakhi.hostel.repository.UserRepository;
import com.sakhi.hostel.service.AuthService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
class AuthServiceTest {

    @Autowired
    private AuthService authService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @BeforeEach
    void setUp() {
        if (!userRepository.existsByUsername("test_warden")) {
            userRepository.save(User.builder()
                    .username("test_warden")
                    .email("warden.test@sakhi.com")
                    .password(passwordEncoder.encode("WardenPass123!"))
                    .role(Role.ROLE_WARDEN)
                    .enabled(true)
                    .build());
        }
    }

    @Test
    void testStudentRegistrationAndLogin() {
        RegisterRequest registerReq = RegisterRequest.builder()
                .fullName("Pooja Verma")
                .email("pooja.verma@example.com")
                .mobile("+91 99887 76655")
                .dateOfBirth(LocalDate.of(2004, 3, 10))
                .bloodGroup("O+")
                .department("Computer Science")
                .course("B.Tech")
                .academicYear("2nd Year")
                .college("Engineering College")
                .guardianName("Sunil Verma")
                .guardianContact("+91 99887 11223")
                .guardianRelationship("Father")
                .emergencyContact("+91 99887 11223")
                .address("Ramdaspeth, Nagpur")
                .username("pooja_v")
                .password("Pooja@2026")
                .build();

        AuthResponse regResponse = authService.registerStudent(registerReq);
        assertNotNull(regResponse);
        assertNotNull(regResponse.getToken());
        assertEquals("pooja_v", regResponse.getUsername());
        assertEquals("ROLE_STUDENT", regResponse.getRole());
        assertTrue(regResponse.getStudentId().startsWith("STU"));

        // Test Login
        LoginRequest loginReq = LoginRequest.builder()
                .username("pooja_v")
                .password("Pooja@2026")
                .build();

        AuthResponse loginResp = authService.login(loginReq);
        assertNotNull(loginResp);
        assertNotNull(loginResp.getToken());
        assertEquals("pooja_v", loginResp.getUsername());
    }

    @Test
    void testDuplicateRegistrationThrowsConflict() {
        RegisterRequest req1 = RegisterRequest.builder()
                .fullName("Rhea Sen")
                .email("rhea.sen@example.com")
                .mobile("+91 99112 23344")
                .department("IT")
                .course("MCA")
                .academicYear("1st Year")
                .college("College of Tech")
                .guardianName("Arun Sen")
                .guardianContact("+91 99112 00000")
                .emergencyContact("+91 99112 00000")
                .username("rhea_unique")
                .password("Password@123")
                .build();

        authService.registerStudent(req1);

        // Attempt registering with same username
        RegisterRequest req2 = RegisterRequest.builder()
                .fullName("Another Person")
                .email("another@example.com")
                .mobile("+91 99112 99999")
                .department("IT")
                .course("MCA")
                .academicYear("1st Year")
                .college("College of Tech")
                .guardianName("Arun")
                .guardianContact("+91 99112 00000")
                .emergencyContact("+91 99112 00000")
                .username("rhea_unique")
                .password("Password@123")
                .build();

        assertThrows(ConflictException.class, () -> authService.registerStudent(req2));
    }
}
