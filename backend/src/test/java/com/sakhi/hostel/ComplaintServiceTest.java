package com.sakhi.hostel;

import com.sakhi.hostel.dto.ComplaintDto;
import com.sakhi.hostel.dto.ComplaintRequest;
import com.sakhi.hostel.dto.ComplaintStatusUpdateRequest;
import com.sakhi.hostel.entity.Role;
import com.sakhi.hostel.entity.StudentProfile;
import com.sakhi.hostel.entity.User;
import com.sakhi.hostel.repository.StudentProfileRepository;
import com.sakhi.hostel.repository.UserRepository;
import com.sakhi.hostel.service.ComplaintService;
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
class ComplaintServiceTest {

    @Autowired
    private ComplaintService complaintService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StudentProfileRepository studentProfileRepository;

    @Test
    void testComplaintLifecycle() {
        User user = userRepository.save(User.builder()
                .username("complaint_tester")
                .email("complaint@test.com")
                .password("TestPass123!")
                .role(Role.ROLE_STUDENT)
                .enabled(true)
                .build());

        StudentProfile student = studentProfileRepository.save(StudentProfile.builder()
                .user(user)
                .studentId("STU88888")
                .fullName("Complaint Tester")
                .email("complaint@test.com")
                .mobile("+91 91111 22222")
                .department("Electrical")
                .course("B.Tech")
                .academicYear("2nd Year")
                .college("College")
                .guardianName("Guardian")
                .guardianContact("+91 91111 22222")
                .emergencyContact("+91 91111 22222")
                .joiningDate(LocalDate.now())
                .status("ACTIVE")
                .build());

        ComplaintRequest req = ComplaintRequest.builder()
                .title("Fan regulator broken")
                .description("The ceiling fan regulator speed cannot be changed.")
                .category("ELECTRICITY")
                .priority("MEDIUM")
                .roomNumber("203")
                .build();

        ComplaintDto created = complaintService.createComplaint(student.getId(), req);
        assertNotNull(created);
        assertEquals("OPEN", created.getStatus());
        assertTrue(created.getTicketNumber().startsWith("CMP-"));

        // Update status to IN_PROGRESS
        ComplaintStatusUpdateRequest statusReq = ComplaintStatusUpdateRequest.builder()
                .status("IN_PROGRESS")
                .resolutionRemarks("Electrician scheduled")
                .build();

        ComplaintDto updated = complaintService.updateComplaintStatus(created.getId(), statusReq, "Kranti Bhoyar");
        assertEquals("IN_PROGRESS", updated.getStatus());

        // Add Comment
        ComplaintDto withComment = complaintService.addComment(created.getId(), "Electrician will visit at 2 PM", "Kranti Bhoyar", "WARDEN");
        assertEquals(1, withComment.getComments().size());
        assertEquals("Kranti Bhoyar", withComment.getComments().get(0).getAuthorName());
    }
}
