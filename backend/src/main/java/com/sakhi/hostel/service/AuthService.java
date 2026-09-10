package com.sakhi.hostel.service;

import com.sakhi.hostel.dto.AuthResponse;
import com.sakhi.hostel.dto.LoginRequest;
import com.sakhi.hostel.dto.RegisterRequest;
import com.sakhi.hostel.entity.*;
import com.sakhi.hostel.exception.BadRequestException;
import com.sakhi.hostel.exception.ConflictException;
import com.sakhi.hostel.exception.ResourceNotFoundException;
import com.sakhi.hostel.repository.*;
import com.sakhi.hostel.security.JwtTokenProvider;
import com.sakhi.hostel.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private static final Logger log = LoggerFactory.getLogger(AuthService.class);

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final WardenProfileRepository wardenProfileRepository;
    private final BedRepository bedRepository;
    private final RoomRepository roomRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;
    private final NotificationService notificationService;

    @Transactional
    public AuthResponse registerStudent(RegisterRequest req) {
        if (userRepository.existsByUsername(req.getUsername())) {
            throw new ConflictException("Username '" + req.getUsername() + "' is already taken.");
        }
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new ConflictException("Email '" + req.getEmail() + "' is already registered.");
        }

        // 1. Create User
        User user = User.builder()
                .username(req.getUsername().trim())
                .email(req.getEmail().trim().toLowerCase())
                .password(passwordEncoder.encode(req.getPassword()))
                .role(Role.ROLE_STUDENT)
                .enabled(true)
                .build();
        user = userRepository.save(user);

        // 2. Generate unique Student ID: STU + 5 digits
        long count = studentProfileRepository.count() + 1;
        String generatedStudentId = String.format("STU%05d", count);
        while (studentProfileRepository.existsByStudentId(generatedStudentId)) {
            count++;
            generatedStudentId = String.format("STU%05d", count);
        }

        // 3. Create Student Profile
        StudentProfile profile = StudentProfile.builder()
                .user(user)
                .studentId(generatedStudentId)
                .fullName(req.getFullName().trim())
                .email(req.getEmail().trim().toLowerCase())
                .mobile(req.getMobile().trim())
                .dateOfBirth(req.getDateOfBirth())
                .bloodGroup(req.getBloodGroup())
                .department(req.getDepartment().trim())
                .course(req.getCourse().trim())
                .academicYear(req.getAcademicYear().trim())
                .college(req.getCollege().trim())
                .guardianName(req.getGuardianName().trim())
                .guardianContact(req.getGuardianContact().trim())
                .guardianRelationship(req.getGuardianRelationship())
                .emergencyContact(req.getEmergencyContact().trim())
                .address(req.getAddress())
                .joiningDate(LocalDate.now())
                .status("ACTIVE")
                .build();

        // 4. Automatically find and assign the first available bed if present
        Optional<Bed> availableBedOpt = bedRepository.findAll().stream()
                .filter(b -> b.getStatus() == Bed.BedStatus.AVAILABLE)
                .findFirst();

        if (availableBedOpt.isPresent()) {
            Bed bed = availableBedOpt.get();
            Room room = bed.getRoom();

            bed.setStatus(Bed.BedStatus.OCCUPIED);
            bedRepository.save(bed);

            room.setOccupiedCount(room.getOccupiedCount() + 1);
            room.updateStatus();
            roomRepository.save(room);

            profile.setBed(bed);
            profile.setRoom(room);
        }

        profile = studentProfileRepository.save(profile);

        // Send welcome notification
        notificationService.createNotification(
                user,
                "Welcome to Sakhi Girls Hostel!",
                "Your registration is complete. Student ID: " + generatedStudentId +
                        (profile.getRoom() != null ? " | Room: " + profile.getRoom().getRoomNumber() + " (" + profile.getBed().getBedLabel() + ")" : ""),
                Notification.NotificationType.SYSTEM,
                "/student/profile"
        );

        log.info("Registered new student: {} with ID: {}", profile.getFullName(), profile.getStudentId());

        // Generate JWT token directly
        String token = tokenProvider.generateTokenFromUsername(user.getUsername(), user.getId(), user.getRole().name());

        return AuthResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .userId(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole().name())
                .fullName(profile.getFullName())
                .studentId(profile.getStudentId())
                .roomNumber(profile.getRoom() != null ? profile.getRoom().getRoomNumber() : "Unassigned")
                .bedLabel(profile.getBed() != null ? profile.getBed().getBedLabel() : "Unassigned")
                .build();
    }

    public AuthResponse login(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getUsername().trim(),
                        loginRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();

        User user = userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // If role was explicitly chosen on frontend, ensure it matches
        if (loginRequest.getRole() != null && !loginRequest.getRole().isBlank()) {
            String expectedRole = "ROLE_" + loginRequest.getRole().toUpperCase();
            if (!user.getRole().name().equalsIgnoreCase(expectedRole)) {
                throw new BadRequestException("Invalid role selected for user " + user.getUsername());
            }
        }

        String token = tokenProvider.generateToken(authentication);

        AuthResponse.AuthResponseBuilder respBuilder = AuthResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .userId(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole().name());

        if (user.getRole() == Role.ROLE_STUDENT) {
            studentProfileRepository.findByUser(user).ifPresent(s -> {
                respBuilder.fullName(s.getFullName())
                        .studentId(s.getStudentId())
                        .roomNumber(s.getRoom() != null ? s.getRoom().getRoomNumber() : "Unassigned")
                        .bedLabel(s.getBed() != null ? s.getBed().getBedLabel() : "Unassigned")
                        .profilePhotoUrl(s.getProfilePhotoUrl());
            });
        } else if (user.getRole() == Role.ROLE_WARDEN) {
            wardenProfileRepository.findByUser(user).ifPresent(w -> {
                respBuilder.fullName(w.getFullName())
                        .designation(w.getDesignation())
                        .profilePhotoUrl(w.getProfilePhotoUrl());
            });
        }

        return respBuilder.build();
    }
}
