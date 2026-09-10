package com.sakhi.hostel;

import com.sakhi.hostel.dto.LeaveDto;
import com.sakhi.hostel.entity.Role;
import com.sakhi.hostel.entity.StudentProfile;
import com.sakhi.hostel.entity.User;
import com.sakhi.hostel.exception.BadRequestException;
import com.sakhi.hostel.repository.StudentProfileRepository;
import com.sakhi.hostel.repository.UserRepository;
import com.sakhi.hostel.service.LeaveService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
class LeaveServiceTest {

    @Autowired
    private LeaveService leaveService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StudentProfileRepository studentProfileRepository;

    @Test
    void testLeaveSubmissionAndApproval() {
        User user = userRepository.save(User.builder()
                .username("leave_tester")
                .email("leave@test.com")
                .password("TestPass123!")
                .role(Role.ROLE_STUDENT)
                .enabled(true)
                .build());

        StudentProfile student = studentProfileRepository.save(StudentProfile.builder()
                .user(user)
                .studentId("STU77777")
                .fullName("Leave Tester")
                .email("leave@test.com")
                .mobile("+91 93333 44444")
                .department("Mechanical")
                .course("B.Tech")
                .academicYear("3rd Year")
                .college("College")
                .guardianName("Guardian")
                .guardianContact("+91 93333 44444")
                .emergencyContact("+91 93333 44444")
                .joiningDate(LocalDate.now())
                .status("ACTIVE")
                .build());

        LeaveDto.ApplyRequest applyReq = LeaveDto.ApplyRequest.builder()
                .fromDate(LocalDate.now().plusDays(1))
                .toDate(LocalDate.now().plusDays(4))
                .reason("Family Function")
                .destination("Mumbai")
                .guardianContact("+91 93333 44444")
                .additionalNotes("Traveling by flight")
                .build();

        LeaveDto created = leaveService.applyLeave(student.getId(), applyReq);
        assertNotNull(created);
        assertEquals("PENDING", created.getStatus());

        // Warden approval
        LeaveDto.ReviewRequest reviewReq = LeaveDto.ReviewRequest.builder()
                .status("APPROVED")
                .remarks("Approved, travel safely")
                .build();

        LeaveDto reviewed = leaveService.reviewLeave(created.getId(), reviewReq, "Kranti Bhoyar");
        assertEquals("APPROVED", reviewed.getStatus());
        assertEquals("Approved, travel safely", reviewed.getWardenRemarks());
    }

    @Test
    void testInvalidLeaveDatesThrowsBadRequest() {
        User user = userRepository.save(User.builder()
                .username("leave_invalid_tester")
                .email("leave_inv@test.com")
                .password("TestPass123!")
                .role(Role.ROLE_STUDENT)
                .enabled(true)
                .build());

        StudentProfile student = studentProfileRepository.save(StudentProfile.builder()
                .user(user)
                .studentId("STU77778")
                .fullName("Leave Invalid")
                .email("leave_inv@test.com")
                .mobile("+91 93333 55555")
                .department("Civil")
                .course("B.Tech")
                .academicYear("2nd Year")
                .college("College")
                .guardianName("Guardian")
                .guardianContact("+91 93333 55555")
                .emergencyContact("+91 93333 55555")
                .joiningDate(LocalDate.now())
                .status("ACTIVE")
                .build());

        LeaveDto.ApplyRequest applyReq = LeaveDto.ApplyRequest.builder()
                .fromDate(LocalDate.now().plusDays(5))
                .toDate(LocalDate.now().plusDays(2)) // To date before from date!
                .reason("Invalid Dates")
                .destination("Delhi")
                .guardianContact("+91 93333 55555")
                .build();

        assertThrows(BadRequestException.class, () -> leaveService.applyLeave(student.getId(), applyReq));
    }
}
