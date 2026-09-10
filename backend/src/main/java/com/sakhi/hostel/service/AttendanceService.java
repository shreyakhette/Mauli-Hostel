package com.sakhi.hostel.service;

import com.sakhi.hostel.dto.AttendanceDto;
import com.sakhi.hostel.dto.MarkAttendanceRequest;
import com.sakhi.hostel.dto.StudentAttendanceStatsDto;
import com.sakhi.hostel.entity.Attendance;
import com.sakhi.hostel.entity.StudentProfile;
import com.sakhi.hostel.exception.ResourceNotFoundException;
import com.sakhi.hostel.repository.AttendanceRepository;
import com.sakhi.hostel.repository.StudentProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final StudentProfileRepository studentProfileRepository;

    @Transactional
    public AttendanceDto markAttendance(MarkAttendanceRequest req, String markedBy) {
        StudentProfile student = studentProfileRepository.findById(req.getStudentId())
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with ID: " + req.getStudentId()));

        Attendance.AttendanceStatus status = Attendance.AttendanceStatus.valueOf(req.getStatus().toUpperCase());

        Optional<Attendance> existingOpt = attendanceRepository.findByStudentIdAndAttendanceDate(student.getId(), req.getDate());
        Attendance attendance;

        if (existingOpt.isPresent()) {
            attendance = existingOpt.get();
            attendance.setStatus(status);
            attendance.setRemarks(req.getRemarks());
            attendance.setMarkedBy(markedBy);
        } else {
            attendance = Attendance.builder()
                    .student(student)
                    .attendanceDate(req.getDate())
                    .status(status)
                    .remarks(req.getRemarks())
                    .markedBy(markedBy)
                    .build();
        }

        attendance = attendanceRepository.save(attendance);
        return mapToDto(attendance);
    }

    @Transactional
    public List<AttendanceDto> markBulkAttendance(MarkAttendanceRequest.BulkRequest req, String markedBy) {
        List<AttendanceDto> results = new ArrayList<>();
        for (MarkAttendanceRequest.StudentEntry entry : req.getEntries()) {
            MarkAttendanceRequest singleReq = MarkAttendanceRequest.builder()
                    .studentId(entry.getStudentId())
                    .date(req.getDate())
                    .status(entry.getStatus())
                    .remarks(entry.getRemarks())
                    .build();
            results.add(markAttendance(singleReq, markedBy));
        }
        return results;
    }

    @Transactional(readOnly = true)
    public List<AttendanceDto> getAttendanceByDate(LocalDate date) {
        List<StudentProfile> allStudents = studentProfileRepository.findAll();
        List<Attendance> existing = attendanceRepository.findByAttendanceDate(date);

        // Map student ID to attendance record
        var existingMap = existing.stream()
                .collect(Collectors.toMap(a -> a.getStudent().getId(), a -> a));

        List<AttendanceDto> result = new ArrayList<>();
        for (StudentProfile s : allStudents) {
            if (existingMap.containsKey(s.getId())) {
                result.add(mapToDto(existingMap.get(s.getId())));
            } else {
                result.add(AttendanceDto.builder()
                        .studentId(s.getId())
                        .studentSystemId(s.getStudentId())
                        .studentName(s.getFullName())
                        .roomNumber(s.getRoom() != null ? s.getRoom().getRoomNumber() : "Unassigned")
                        .date(date)
                        .status("UNMARKED")
                        .build());
            }
        }
        return result;
    }

    @Transactional(readOnly = true)
    public StudentAttendanceStatsDto getStudentStats(Long studentId) {
        StudentProfile student = studentProfileRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with ID: " + studentId));

        long present = attendanceRepository.countByStudentIdAndStatus(studentId, Attendance.AttendanceStatus.PRESENT);
        long absent = attendanceRepository.countByStudentIdAndStatus(studentId, Attendance.AttendanceStatus.ABSENT);
        long late = attendanceRepository.countByStudentIdAndStatus(studentId, Attendance.AttendanceStatus.LATE);
        long leave = attendanceRepository.countByStudentIdAndStatus(studentId, Attendance.AttendanceStatus.ON_LEAVE);
        long total = attendanceRepository.countByStudentId(studentId);

        double percentage = 100.0;
        if (total > 0) {
            // Present and Late count towards attended percentage (e.g. late = partial or present)
            percentage = Math.round(((double) (present + late) / total) * 1000.0) / 10.0;
        }

        List<AttendanceDto> history = attendanceRepository.findByStudentIdOrderByAttendanceDateDesc(studentId).stream()
                .limit(30)
                .map(this::mapToDto)
                .collect(Collectors.toList());

        return StudentAttendanceStatsDto.builder()
                .studentId(student.getId())
                .studentName(student.getFullName())
                .totalMarkedDays(total)
                .presentCount(present)
                .absentCount(absent)
                .lateCount(late)
                .leaveCount(leave)
                .percentage(percentage)
                .recentHistory(history)
                .build();
    }

    public AttendanceDto mapToDto(Attendance a) {
        return AttendanceDto.builder()
                .id(a.getId())
                .studentId(a.getStudent().getId())
                .studentSystemId(a.getStudent().getStudentId())
                .studentName(a.getStudent().getFullName())
                .roomNumber(a.getStudent().getRoom() != null ? a.getStudent().getRoom().getRoomNumber() : "Unassigned")
                .date(a.getAttendanceDate())
                .status(a.getStatus().name())
                .remarks(a.getRemarks())
                .markedBy(a.getMarkedBy())
                .markedAt(a.getMarkedAt())
                .build();
    }
}
