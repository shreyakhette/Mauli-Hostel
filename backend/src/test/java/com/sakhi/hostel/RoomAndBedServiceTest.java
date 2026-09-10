package com.sakhi.hostel;

import com.sakhi.hostel.dto.BedDto;
import com.sakhi.hostel.dto.RoomDto;
import com.sakhi.hostel.entity.Role;
import com.sakhi.hostel.entity.StudentProfile;
import com.sakhi.hostel.entity.User;
import com.sakhi.hostel.repository.BedRepository;
import com.sakhi.hostel.repository.RoomRepository;
import com.sakhi.hostel.repository.StudentProfileRepository;
import com.sakhi.hostel.repository.UserRepository;
import com.sakhi.hostel.service.BedService;
import com.sakhi.hostel.service.RoomService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
class RoomAndBedServiceTest {

    @Autowired
    private RoomService roomService;

    @Autowired
    private BedService bedService;

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private BedRepository bedRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StudentProfileRepository studentProfileRepository;

    @Test
    void testRoomCreationAndBedAssignment() {
        RoomDto newRoom = RoomDto.builder()
                .roomNumber("999")
                .floor(4)
                .capacity(4)
                .build();

        RoomDto created = roomService.createRoom(newRoom);
        assertNotNull(created);
        assertEquals("999", created.getRoomNumber());
        assertEquals(4, created.getBeds().size());

        // Create a test student
        User studentUser = userRepository.save(User.builder()
                .username("test_alloc")
                .email("alloc@test.com")
                .password("TestPass123!")
                .role(Role.ROLE_STUDENT)
                .enabled(true)
                .build());

        StudentProfile student = studentProfileRepository.save(StudentProfile.builder()
                .user(studentUser)
                .studentId("STU99999")
                .fullName("Test Allocation Student")
                .email("alloc@test.com")
                .mobile("+91 90000 00000")
                .department("Civil")
                .course("B.Tech")
                .academicYear("1st Year")
                .college("Engineering College")
                .guardianName("Guardian")
                .guardianContact("+91 90000 00000")
                .emergencyContact("+91 90000 00000")
                .joiningDate(LocalDate.now())
                .status("ACTIVE")
                .build());

        // Assign bed 1 in room 999
        Long bedId = created.getBeds().get(0).getId();
        BedDto assigned = bedService.assignBed(bedId, student.getId());
        assertEquals("OCCUPIED", assigned.getStatus());
        assertEquals(student.getFullName(), assigned.getStudentName());

        // Verify room occupied count increased
        RoomDto refreshedRoom = roomService.getRoomById(created.getId());
        assertEquals(1, refreshedRoom.getOccupiedCount());

        // Unassign bed
        BedDto unassigned = bedService.unassignBed(bedId);
        assertEquals("AVAILABLE", unassigned.getStatus());
        assertNull(unassigned.getStudentId());

        refreshedRoom = roomService.getRoomById(created.getId());
        assertEquals(0, refreshedRoom.getOccupiedCount());
    }
}
