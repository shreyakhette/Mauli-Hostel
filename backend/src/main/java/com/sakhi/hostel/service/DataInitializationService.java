package com.sakhi.hostel.service;

import com.sakhi.hostel.entity.*;
import com.sakhi.hostel.repository.*;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DataInitializationService implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializationService.class);

    private final UserRepository userRepository;
    private final WardenProfileRepository wardenProfileRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final HostelRepository hostelRepository;
    private final RoomRepository roomRepository;
    private final BedRepository bedRepository;
    private final NoticeRepository noticeRepository;
    private final ComplaintRepository complaintRepository;
    private final ComplaintCommentRepository complaintCommentRepository;
    private final AttendanceRepository attendanceRepository;
    private final LeaveApplicationRepository leaveRepository;
    private final BusRepository busRepository;
    private final BusScheduleRepository busScheduleRepository;
    private final MessMenuRepository messMenuRepository;
    private final EmergencyContactRepository emergencyContactRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.warden.default-username:warden}")
    private String defaultWardenUsername;

    @Value("${app.warden.default-password:Warden@Sakhi2026}")
    private String defaultWardenPassword;

    @Value("${app.warden.default-name:Kranti Bhoyar}")
    private String defaultWardenName;

    @Value("${app.warden.default-email:warden.kranti@sakhihostel.com}")
    private String defaultWardenEmail;

    @Value("${app.warden.default-phone:+91 98765 43210}")
    private String defaultWardenPhone;

    @Value("${app.seed-sample-data:true}")
    private boolean seedSampleData;

    @Override
    @Transactional
    public void run(String... args) {
        if (!seedSampleData && userRepository.count() > 0) {
            log.info("Sample seeding disabled or already seeded.");
            return;
        }

        log.info("Initializing Sakhi Girls Hostel database...");
        initHostelAndWarden();
        initRoomsAndBeds();
        initEmergencyContacts();
        initMessMenu();
        initBusSchedules();
        initSampleStudentsAndActivities();
        log.info("Sakhi Girls Hostel initialization complete!");
    }

    private void initHostelAndWarden() {
        if (hostelRepository.count() == 0) {
            Hostel hostel = Hostel.builder()
                    .name("Sakhi Girls Hostel")
                    .totalRooms(100)
                    .bedsPerRoom(4)
                    .totalFloors(4)
                    .totalCapacity(400)
                    .address("Mauli Group of Institutions Campus, Khamgaon Road, Shegaon, Maharashtra - 444503")
                    .contactNumber("+91 7265 252001")
                    .email("hostel@mgi.ac.in")
                    .build();
            hostelRepository.save(hostel);
        }

        if (!userRepository.existsByUsername(defaultWardenUsername)) {
            User wardenUser = User.builder()
                    .username(defaultWardenUsername)
                    .email(defaultWardenEmail)
                    .password(passwordEncoder.encode(defaultWardenPassword))
                    .role(Role.ROLE_WARDEN)
                    .enabled(true)
                    .build();
            wardenUser = userRepository.save(wardenUser);

            WardenProfile wardenProfile = WardenProfile.builder()
                    .user(wardenUser)
                    .fullName(defaultWardenName)
                    .email(defaultWardenEmail)
                    .phone(defaultWardenPhone)
                    .designation("Chief Warden")
                    .officeHours("9:00 AM - 6:00 PM (Emergency 24x7)")
                    .emergencyPhone("+91 98765 43211")
                    .profilePhotoUrl("https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80")
                    .build();
            wardenProfileRepository.save(wardenProfile);
            log.info("Warden initialized: {} (username: {})", defaultWardenName, defaultWardenUsername);
        }
    }

    private void initRoomsAndBeds() {
        if (roomRepository.count() > 0) {
            return;
        }

        log.info("Generating 100 rooms and 400 beds for Sakhi Girls Hostel...");
        List<Room> allRooms = new ArrayList<>(100);

        // 100 rooms across 4 floors: 25 rooms per floor
        // Floor 1: 101 to 125
        // Floor 2: 201 to 225
        // Floor 3: 301 to 325
        // Floor 4: 401 to 425
        int totalOccupiedTarget = 363; // target as per specs
        int currentOccupiedAssigned = 0;

        for (int floor = 1; floor <= 4; floor++) {
            for (int roomIdx = 1; roomIdx <= 25; roomIdx++) {
                String roomNum = String.format("%d%02d", floor, roomIdx);

                // Room 203 will specifically have 3 occupied beds and 1 available bed
                int roomOccupied;
                if ("203".equals(roomNum)) {
                    roomOccupied = 3;
                } else if (currentOccupiedAssigned + 4 <= totalOccupiedTarget) {
                    roomOccupied = 4; // full
                } else if (currentOccupiedAssigned < totalOccupiedTarget) {
                    roomOccupied = totalOccupiedTarget - currentOccupiedAssigned;
                } else {
                    roomOccupied = 0; // remaining available rooms
                }
                currentOccupiedAssigned += roomOccupied;

                Room.RoomStatus status = Room.RoomStatus.AVAILABLE;
                if (roomOccupied == 4) status = Room.RoomStatus.FULL;
                else if (roomOccupied > 0) status = Room.RoomStatus.PARTIAL;

                Room room = Room.builder()
                        .roomNumber(roomNum)
                        .floor(floor)
                        .capacity(4)
                        .occupiedCount(roomOccupied)
                        .status(status)
                        .beds(new ArrayList<>())
                        .build();

                room = roomRepository.save(room);

                for (int b = 1; b <= 4; b++) {
                    Bed.BedStatus bedStatus = (b <= roomOccupied) ? Bed.BedStatus.OCCUPIED : Bed.BedStatus.AVAILABLE;
                    Bed bed = Bed.builder()
                            .bedNumber(b)
                            .bedLabel("Bed " + b)
                            .status(bedStatus)
                            .room(room)
                            .build();
                    bed = bedRepository.save(bed);
                    room.getBeds().add(bed);
                }

                allRooms.add(room);
            }
        }
        log.info("Created 100 rooms with 400 beds. Total occupied: {}", currentOccupiedAssigned);
    }

    private void initEmergencyContacts() {
        if (emergencyContactRepository.count() > 0) return;

        List<EmergencyContact> contacts = List.of(
                EmergencyContact.builder().title("WARDEN").contactPerson("Kranti Bhoyar").phoneNumber("+91 98765 43210").altPhone("+91 98765 43211").location("Warden Residence, Block A").description("Immediate assistance for all student emergencies").orderIndex(1).isActive(true).build(),
                EmergencyContact.builder().title("HOSTEL OFFICE").contactPerson("Administrative Desk").phoneNumber("+91 712 2548900").altPhone("+91 712 2548901").location("Ground Floor, Main Gate").description("Hostel office & admissions desk").orderIndex(2).isActive(true).build(),
                EmergencyContact.builder().title("SECURITY").contactPerson("Campus Gate Security").phoneNumber("+91 98765 43220").altPhone("+91 98765 43221").location("Main Security Post 1 & 2").description("24x7 security control and surveillance room").orderIndex(3).isActive(true).build(),
                EmergencyContact.builder().title("HOSPITAL").contactPerson("City Medical Center").phoneNumber("+91 712 2890001").altPhone("+91 712 2890002").location("Civil Lines, 1.5 km").description("Nearest partner multispeciality hospital").orderIndex(4).isActive(true).build(),
                EmergencyContact.builder().title("AMBULANCE").contactPerson("Emergency Services").phoneNumber("108").altPhone("+91 712 2890108").location("City Emergency Dispatch").description("24x7 government & private ambulance dispatch").orderIndex(5).isActive(true).build(),
                EmergencyContact.builder().title("POLICE").contactPerson("Women Helpline / Police").phoneNumber("112").altPhone("1091").location("Civil Lines Police Station").description("Police emergency response & women helpline").orderIndex(6).isActive(true).build(),
                EmergencyContact.builder().title("FIRE").contactPerson("Fire Brigade").phoneNumber("101").altPhone("+91 712 2533333").location("Civil Station Fire Post").description("Fire and rescue control").orderIndex(7).isActive(true).build()
        );

        emergencyContactRepository.saveAll(contacts);
    }

    private void initMessMenu() {
        if (messMenuRepository.count() > 0) return;

        List<MessMenu> menus = List.of(
                MessMenu.builder().dayOfWeek("MONDAY").breakfast("Poha + Boiled Sprouts + Tea / Milk").lunch("Dal Tadka + Steamed Rice + Phulka Roti + Mixed Veg Sabzi + Curd").snacks("Tea / Coffee + Masala Biscuits").dinner("Paneer Butter Masala + Jeera Rice + Roti + Gulab Jamun").specialNotes("Fresh fruit salad available in morning").build(),
                MessMenu.builder().dayOfWeek("TUESDAY").breakfast("Idli Sambar + Coconut Chutney + Tea / Milk").lunch("Rajma Masala + Basmati Rice + Roti + Aloo Gobi + Salad").snacks("Green Tea / Lemon Tea + Veg Puff").dinner("Chole + Poori + Peas Pulao + Raita + Kheer").specialNotes("Special Tuesday College Special Menu").build(),
                MessMenu.builder().dayOfWeek("WEDNESDAY").breakfast("Aloo Paratha with Butter & Pickle + Tea / Milk").lunch("Gujarati Dal + Rice + Bhindi Masala + Phulka Roti + Buttermilk").snacks("Tea / Coffee + Samosa with Mint Chutney").dinner("Veg Biryani + Mirchi Ka Salan + Onion Raita + Ice Cream").specialNotes("Chef's special mid-week dinner").build(),
                MessMenu.builder().dayOfWeek("THURSDAY").breakfast("Upma with Coconut Chutney + Boiled Egg / Banana + Tea").lunch("Kadhi Pakora + Khichdi / Rice + Methi Thepla + Papad").snacks("Filter Coffee / Tea + Dry Bhel").dinner("Mushroom Curry + Tandoori Roti + Dal Makhani + Rice").specialNotes("Light traditional lunch").build(),
                MessMenu.builder().dayOfWeek("FRIDAY").breakfast("Masala Dosa with Sambar & Chutney + Tea / Milk").lunch("Dal Fry + Jeera Rice + Baingan Bharta + Chapati + Boondi Raita").snacks("Tea / Juice + Dhokla").dinner("Malai Kofta + Naan + Veg Pulao + Fruit Custard").specialNotes("Friday evening dessert festival").build(),
                MessMenu.builder().dayOfWeek("SATURDAY").breakfast("Pav Bhaji / Bread Butter Omelette + Tea / Milk").lunch("Moong Dal + Rice + Aloo Shimla Mirch + Roti + Cucumber Salad").snacks("Cold Coffee / Milkshake + French Fries").dinner("Veg Manchurian + Hakka Noodles + Fried Rice + Sweet Corn Soup").specialNotes("Indo-Chinese weekend special").build(),
                MessMenu.builder().dayOfWeek("SUNDAY").breakfast("Poori Bhaji with Halwa + Filter Coffee").lunch("Special Sunday Thali: Shahi Paneer + Dal Makhani + Kashmiri Pulao + Laccha Paratha + Rasgulla").snacks("Tea + Pakora").dinner("Light Khichdi + Kadhi + Roti + Aloo Sukhi + Buttermilk").specialNotes("Grand Sunday lunch feast").build()
        );

        messMenuRepository.saveAll(menus);
    }

    private void initBusSchedules() {
        if (busRepository.count() > 0) return;

        Bus bus1 = Bus.builder()
                .busNumber("MH-28-SK-2026")
                .routeName("Sakhi Hostel <-> Mauli Engineering Campus")
                .totalSeats(40)
                .driverName("Ramesh Patil")
                .driverPhone("+91 94231 10022")
                .active(true)
                .build();

        Bus bus2 = Bus.builder()
                .busNumber("MH-28-SK-2027")
                .routeName("Sakhi Hostel <-> Shegaon Railway Station & Town")
                .totalSeats(40)
                .driverName("Sunil Shinde")
                .driverPhone("+91 94231 10033")
                .active(true)
                .build();

        bus1 = busRepository.save(bus1);
        bus2 = busRepository.save(bus2);

        // Add Bus Schedules with special emphasis on Tuesday
        List<BusSchedule> schedules = List.of(
                BusSchedule.builder().bus(bus1).dayOfWeek("TUESDAY").route("Hostel -> College").departureTime("08:00 AM").returnTime("04:30 PM").totalSeats(40).availableSeats(18).status(BusSchedule.BusStatus.ON_TIME).notes("Hostel Main Gate pickup. Returns 4:30 PM.").build(),
                BusSchedule.builder().bus(bus1).dayOfWeek("MONDAY").route("Hostel -> College").departureTime("08:00 AM").returnTime("04:30 PM").totalSeats(40).availableSeats(12).status(BusSchedule.BusStatus.ON_TIME).notes("Scheduled run").build(),
                BusSchedule.builder().bus(bus1).dayOfWeek("WEDNESDAY").route("Hostel -> College").departureTime("08:00 AM").returnTime("04:30 PM").totalSeats(40).availableSeats(15).status(BusSchedule.BusStatus.ON_TIME).notes("Scheduled run").build(),
                BusSchedule.builder().bus(bus1).dayOfWeek("THURSDAY").route("Hostel -> College").departureTime("08:00 AM").returnTime("04:30 PM").totalSeats(40).availableSeats(22).status(BusSchedule.BusStatus.ON_TIME).notes("Scheduled run").build(),
                BusSchedule.builder().bus(bus1).dayOfWeek("FRIDAY").route("Hostel -> College").departureTime("08:00 AM").returnTime("04:30 PM").totalSeats(40).availableSeats(10).status(BusSchedule.BusStatus.ON_TIME).notes("Weekend return departs 3:30 PM").build(),
                BusSchedule.builder().bus(bus2).dayOfWeek("SATURDAY").route("Hostel -> City Library & Mall").departureTime("10:00 AM").returnTime("06:00 PM").totalSeats(40).availableSeats(25).status(BusSchedule.BusStatus.ON_TIME).notes("Weekend recreational shuttle").build(),
                BusSchedule.builder().bus(bus2).dayOfWeek("SUNDAY").route("Hostel -> City Center").departureTime("11:00 AM").returnTime("07:00 PM").totalSeats(40).availableSeats(30).status(BusSchedule.BusStatus.ON_TIME).notes("Sunday shopping & library trip").build()
        );

        busScheduleRepository.saveAll(schedules);
    }

    private void initSampleStudentsAndActivities() {
        if (noticeRepository.count() == 0) {
            List<Notice> notices = List.of(
                    Notice.builder()
                            .title("Hostel Inspection")
                            .content("Tomorrow at 10:00 AM, our Chief Warden Kranti Bhoyar and inspection committee will inspect all floors. All students are requested to keep their rooms clean, ensure corridors are clear, and cooperate with staff.")
                            .category(Notice.Category.GENERAL)
                            .priority(Notice.Priority.CRITICAL)
                            .isImportant(true)
                            .isPinned(true)
                            .publishDate(LocalDate.now())
                            .expiryDate(LocalDate.now().plusDays(3))
                            .createdBy("Kranti Bhoyar")
                            .build(),
                    Notice.builder()
                            .title("Tuesday Campus Shuttle Schedule")
                            .content("The morning shuttle to the Mauli Group of Institutions Engineering Campus will depart sharp at 8:00 AM tomorrow from Gate 1. 18 seats are currently open for reservation.")
                            .category(Notice.Category.GENERAL)
                            .priority(Notice.Priority.HIGH)
                            .isImportant(false)
                            .isPinned(true)
                            .publishDate(LocalDate.now())
                            .expiryDate(LocalDate.now().plusDays(2))
                            .createdBy("Kranti Bhoyar")
                            .build(),
                    Notice.builder()
                            .title("Mess Menu Feedback & Suggestions")
                            .content("The student mess committee invites all residents to submit their feedback on the updated weekly menu using the student portal.")
                            .category(Notice.Category.MESS)
                            .priority(Notice.Priority.NORMAL)
                            .isImportant(false)
                            .isPinned(false)
                            .publishDate(LocalDate.now().minusDays(1))
                            .createdBy("Kranti Bhoyar")
                            .build(),
                    Notice.builder()
                            .title("Evening Quiet Hours Policy")
                            .content("To support upcoming mid-semester examinations, strict silence hours begin at 10:00 PM across all wings. Reading hall remains open 24x7.")
                            .category(Notice.Category.ACADEMIC)
                            .priority(Notice.Priority.HIGH)
                            .isImportant(false)
                            .isPinned(false)
                            .publishDate(LocalDate.now().minusDays(2))
                            .createdBy("Kranti Bhoyar")
                            .build()
            );
            noticeRepository.saveAll(notices);
        }

        // Create Ananya Sharma and Room 203 roommates
        Room room203 = roomRepository.findByRoomNumber("203").orElse(null);
        if (room203 == null) return;

        List<Bed> beds203 = bedRepository.findByRoomIdOrderByBedNumberAsc(room203.getId());
        if (beds203.size() < 4) return;

        // Student 1: Priya Sharma (Bed 1)
        if (!userRepository.existsByUsername("priya")) {
            User priyaUser = userRepository.save(User.builder()
                    .username("priya")
                    .email("priya.sharma@example.com")
                    .password(passwordEncoder.encode("Priya@Sakhi2026"))
                    .role(Role.ROLE_STUDENT)
                    .build());

            Bed bed1 = beds203.get(0);
            bed1.setStatus(Bed.BedStatus.OCCUPIED);
            bedRepository.save(bed1);

            studentProfileRepository.save(StudentProfile.builder()
                    .user(priyaUser)
                    .studentId("STU00101")
                    .fullName("Priya Sharma")
                    .email("priya.sharma@example.com")
                    .mobile("+91 98220 11223")
                    .dateOfBirth(LocalDate.of(2004, 5, 14))
                    .bloodGroup("B+")
                    .department("Computer Engineering")
                    .course("B.Tech")
                    .academicYear("3rd Year")
                    .college("Mauli Group of Institutions College of Engineering, Shegaon")
                    .guardianName("Rakesh Sharma")
                    .guardianContact("+91 98220 99887")
                    .guardianRelationship("Father")
                    .emergencyContact("+91 98220 99887")
                    .address("Civil Lines, Pune")
                    .profilePhotoUrl("https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80")
                    .room(room203)
                    .bed(bed1)
                    .joiningDate(LocalDate.now().minusMonths(6))
                    .status("ACTIVE")
                    .build());
        }

        // Student 2: Ananya Sharma (Bed 2) - Primary Demo Student
        if (!userRepository.existsByUsername("ananya")) {
            User ananyaUser = userRepository.save(User.builder()
                    .username("ananya")
                    .email("ananya.sharma@example.com")
                    .password(passwordEncoder.encode("Student@Sakhi2026"))
                    .role(Role.ROLE_STUDENT)
                    .build());

            Bed bed2 = beds203.get(1);
            bed2.setStatus(Bed.BedStatus.OCCUPIED);
            bedRepository.save(bed2);

            StudentProfile ananyaProfile = studentProfileRepository.save(StudentProfile.builder()
                    .user(ananyaUser)
                    .studentId("STU00123")
                    .fullName("Ananya Sharma")
                    .email("ananya.sharma@example.com")
                    .mobile("+91 98330 44556")
                    .dateOfBirth(LocalDate.of(2004, 8, 22))
                    .bloodGroup("O+")
                    .department("Electronics & Telecommunication")
                    .course("B.Tech")
                    .academicYear("3rd Year")
                    .college("Mauli Group of Institutions College of Engineering, Shegaon")
                    .guardianName("Suresh Sharma")
                    .guardianContact("+91 98330 99112")
                    .guardianRelationship("Father")
                    .emergencyContact("+91 98330 99112")
                    .address("Shankar Nagar, Nagpur")
                    .profilePhotoUrl("https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80")
                    .room(room203)
                    .bed(bed2)
                    .joiningDate(LocalDate.now().minusMonths(8))
                    .status("ACTIVE")
                    .build());

            // Student 3: Sneha Patil (Bed 3)
            Bed bed3 = beds203.get(2);
            bed3.setStatus(Bed.BedStatus.OCCUPIED);
            bedRepository.save(bed3);

            User snehaUser = userRepository.save(User.builder()
                    .username("sneha")
                    .email("sneha.patil@example.com")
                    .password(passwordEncoder.encode("Sneha@Sakhi2026"))
                    .role(Role.ROLE_STUDENT)
                    .build());

            studentProfileRepository.save(StudentProfile.builder()
                    .user(snehaUser)
                    .studentId("STU00104")
                    .fullName("Sneha Patil")
                    .email("sneha.patil@example.com")
                    .mobile("+91 98440 22334")
                    .dateOfBirth(LocalDate.of(2004, 11, 10))
                    .bloodGroup("A+")
                    .department("Information Technology")
                    .course("B.Tech")
                    .academicYear("3rd Year")
                    .college("Mauli Group of Institutions College of Engineering, Shegaon")
                    .guardianName("Nitin Patil")
                    .guardianContact("+91 98440 88776")
                    .guardianRelationship("Father")
                    .emergencyContact("+91 98440 88776")
                    .address("Shivaji Park, Mumbai")
                    .profilePhotoUrl("https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80")
                    .room(room203)
                    .bed(bed3)
                    .joiningDate(LocalDate.now().minusMonths(6))
                    .status("ACTIVE")
                    .build());

            // Bed 4 in Room 203 is kept AVAILABLE (1 bed available)
            Bed bed4 = beds203.get(3);
            bed4.setStatus(Bed.BedStatus.AVAILABLE);
            bedRepository.save(bed4);

            room203.setOccupiedCount(3);
            room203.updateStatus();
            roomRepository.save(room203);

            // Seed Attendance for Ananya (92% attendance: 46 Present, 2 Absent, 2 Late = 50 total records)
            LocalDate curDate = LocalDate.now();
            for (int i = 1; i <= 50; i++) {
                LocalDate attDate = curDate.minusDays(i);
                Attendance.AttendanceStatus st = Attendance.AttendanceStatus.PRESENT;
                String rem = "Regular attendance";
                if (i == 12 || i == 34) {
                    st = Attendance.AttendanceStatus.ABSENT;
                    rem = "Absent due to illness";
                } else if (i == 5 || i == 23) {
                    st = Attendance.AttendanceStatus.LATE;
                    rem = "Late entry from lab session";
                }

                attendanceRepository.save(Attendance.builder()
                        .student(ananyaProfile)
                        .attendanceDate(attDate)
                        .status(st)
                        .remarks(rem)
                        .markedBy("Kranti Bhoyar")
                        .build());
            }

            // Seed 1 Pending Leave Application for Ananya
            leaveRepository.save(LeaveApplication.builder()
                    .student(ananyaProfile)
                    .fromDate(LocalDate.now().plusDays(2))
                    .toDate(LocalDate.now().plusDays(5))
                    .reason("Attending cousin's wedding ceremony in Pune")
                    .destination("Pune, Maharashtra")
                    .guardianContact("+91 98330 99112")
                    .additionalNotes("Travel by overnight train. Father has permitted.")
                    .status(LeaveApplication.LeaveStatus.PENDING)
                    .build());

            // Seed 2 Open Complaints for Ananya
            Complaint c1 = complaintRepository.save(Complaint.builder()
                    .ticketNumber("CMP-1001")
                    .title("Water leakage - Room 203")
                    .description("Mild water leakage under the wash basin sink in Room 203 bathroom. Requires plumber inspection.")
                    .category(Complaint.ComplaintCategory.WATER)
                    .status(Complaint.ComplaintStatus.IN_PROGRESS)
                    .priority(Complaint.Priority.HIGH)
                    .student(ananyaProfile)
                    .roomNumber("203")
                    .build());

            complaintCommentRepository.save(ComplaintComment.builder()
                    .complaint(c1)
                    .authorName("Kranti Bhoyar")
                    .authorRole("WARDEN")
                    .comment("Plumber assigned. Will attend tomorrow morning at 11:00 AM.")
                    .build());

            Complaint c2 = complaintRepository.save(Complaint.builder()
                    .ticketNumber("CMP-1002")
                    .title("Study lamp switch repair")
                    .description("The main plug socket next to Bed 2 is loose and causing sparking when plugging in study lamp.")
                    .category(Complaint.ComplaintCategory.ELECTRICITY)
                    .status(Complaint.ComplaintStatus.OPEN)
                    .priority(Complaint.Priority.MEDIUM)
                    .student(ananyaProfile)
                    .roomNumber("203")
                    .build());

            complaintCommentRepository.save(ComplaintComment.builder()
                    .complaint(c2)
                    .authorName("Kranti Bhoyar")
                    .authorRole("WARDEN")
                    .comment("Electrician Ramesh scheduled for inspection today between 4:00 PM and 5:00 PM.")
                    .build());

            Complaint c3 = complaintRepository.save(Complaint.builder()
                    .ticketNumber("CMP-1003")
                    .title("Wi-Fi connectivity drop in Room 203")
                    .description("Wi-Fi signal frequently disconnecting during evening study hours on 2nd Floor Wing B.")
                    .category(Complaint.ComplaintCategory.INTERNET)
                    .status(Complaint.ComplaintStatus.RESOLVED)
                    .priority(Complaint.Priority.MEDIUM)
                    .student(ananyaProfile)
                    .roomNumber("203")
                    .resolutionRemarks("Access Point AP-203 rebooted and 5GHz dual-band firmware updated. Tested download speed 82 Mbps.")
                    .resolvedAt(LocalDateTime.now().minusDays(1))
                    .build());

            complaintCommentRepository.save(ComplaintComment.builder()
                    .complaint(c3)
                    .authorName("Kranti Bhoyar")
                    .authorRole("WARDEN")
                    .comment("Campus IT network engineer visited and re-aligned the hallway repeater.")
                    .build());
        }
    }
}
