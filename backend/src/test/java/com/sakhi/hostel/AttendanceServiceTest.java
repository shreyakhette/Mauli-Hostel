package com.sakhi.hostel;

import com.sakhi.hostel.dto.AttendanceDto;
import com.sakhi.hostel.dto.MarkAttendanceRequest;
import com.sakhi.hostel.dto.StudentAttendanceStatsDto;
import com.sakhi.hostel.entity.Role;
import com.sakhi.hostel.entity.StudentProfile;
import com.sakhi.hostel.entity.User;
import com.sakhi.hostel.repository.StudentProfileRepository;
import com.sakhi.hostel.repository.UserRepository;
import com.sakhi.hostel.service.AttendanceService;
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
class AttendanceServiceTest {

    @Autowired
    private AttendanceService attendanceService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StudentProfileRepository studentProfileRepository;

    @Test
    void testAttendanceMarkingAndStatsCalculation() {
        User user = userRepository.save(User.builder()
                .username("att_tester")
                .email("att@test.com")
                .password("TestPass123!")
                .role(Role.ROLE_STUDENT)
                .enabled(true)
                .build());

        StudentProfile student = studentProfileRepository.save(StudentProfile.builder()
                .user(user)
                .studentId("STU66666")
                .fullName("Attendance Tester")
                .email("att@test.com")
                .mobile("+91 94444 55555")
                .department("CSE")
                .course("B.Tech")
                .academicYear("3rd Year")
                .college("College")
                .guardianName("Guardian")
                .guardianContact("+91 94444 55555")
                .emergencyContact("+91 94444 55555")
                .joiningDate(LocalDate.now())
                .status("ACTIVE")
                .build());

        LocalDate today = LocalDate.now();
        LocalDate yesterday = today.minusDays(1);

        // Mark present for yesterday
        attendanceService.markAttendance(MarkAttendanceRequest.builder()
                .studentId(student.getId())
                .date(yesterday)
                .status("PRESENT")
                .remarks("On time")
                .build(), "Kranti Bhoyar");

        // Mark late for today
        AttendanceDto todayAtt = attendanceService.markAttendance(MarkAttendanceRequest.builder()
                .studentId(student.getId())
                .date(today)
                .status("LATE")
                .remarks("Late by 10 mins")
                .build(), "Kranti Bhoyar");

        assertEquals("LATE", todayAtt.getStatus());

        // Update today's attendance to PRESENT (should update existing record, not duplicate)
        AttendanceDto updatedToday = attendanceService.markAttendance(MarkAttendanceRequest.builder()
                .studentId(student.getId())
                .date(today)
                .status("PRESENT")
                .remarks("Late mark waived")
                .build(), "Kranti Bhoyar");

        assertEquals("PRESENT", updatedToday.getStatus());
        assertEquals(todayAtt.getId(), updatedToday.getId());

        // Check stats
        StudentAttendanceStatsDto stats = attendanceService.getStudentStats(student.getId());
        assertEquals(2, stats.getTotalMarkedDays());
        assertEquals(2, stats.getPresentCount());
        assertEquals(100.0, stats.getPercentage());
    }
}
