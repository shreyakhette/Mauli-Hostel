package com.sakhi.hostel.service;

import com.sakhi.hostel.dto.MessMenuDto;
import com.sakhi.hostel.entity.MessFeedback;
import com.sakhi.hostel.entity.MessMenu;
import com.sakhi.hostel.entity.StudentProfile;
import com.sakhi.hostel.exception.ResourceNotFoundException;
import com.sakhi.hostel.repository.MessFeedbackRepository;
import com.sakhi.hostel.repository.MessMenuRepository;
import com.sakhi.hostel.repository.StudentProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MessService {

    private final MessMenuRepository messMenuRepository;
    private final MessFeedbackRepository messFeedbackRepository;
    private final StudentProfileRepository studentProfileRepository;

    private static final List<String> DAYS_ORDER = List.of(
            "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"
    );

    @Transactional(readOnly = true)
    public List<MessMenuDto> getWeeklyMenu() {
        return messMenuRepository.findAll().stream()
                .sorted(Comparator.comparingInt(m -> {
                    int idx = DAYS_ORDER.indexOf(m.getDayOfWeek().toUpperCase());
                    return idx >= 0 ? idx : 99;
                }))
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public MessMenuDto getMenuByDay(String day) {
        MessMenu menu = messMenuRepository.findByDayOfWeekIgnoreCase(day)
                .orElseThrow(() -> new ResourceNotFoundException("Mess menu not found for " + day));
        return mapToDto(menu);
    }

    @Transactional
    public MessMenuDto updateMenu(String day, MessMenuDto dto) {
        MessMenu menu = messMenuRepository.findByDayOfWeekIgnoreCase(day)
                .orElseGet(() -> MessMenu.builder().dayOfWeek(day.toUpperCase()).build());

        menu.setBreakfast(dto.getBreakfast().trim());
        menu.setLunch(dto.getLunch().trim());
        menu.setSnacks(dto.getSnacks().trim());
        menu.setDinner(dto.getDinner().trim());
        menu.setSpecialNotes(dto.getSpecialNotes());

        return mapToDto(messMenuRepository.save(menu));
    }

    @Transactional
    public MessMenuDto.FeedbackDto submitFeedback(Long studentProfileId, MessMenuDto.FeedbackRequest req) {
        StudentProfile student = studentProfileRepository.findById(studentProfileId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with ID: " + studentProfileId));

        MessFeedback feedback = MessFeedback.builder()
                .student(student)
                .dayOfWeek(req.getDayOfWeek().toUpperCase())
                .mealType(req.getMealType().toUpperCase())
                .rating(req.getRating())
                .comment(req.getComment())
                .build();

        feedback = messFeedbackRepository.save(feedback);

        return MessMenuDto.FeedbackDto.builder()
                .id(feedback.getId())
                .studentId(student.getId())
                .studentName(student.getFullName())
                .dayOfWeek(feedback.getDayOfWeek())
                .mealType(feedback.getMealType())
                .rating(feedback.getRating())
                .comment(feedback.getComment())
                .createdAt(feedback.getCreatedAt())
                .build();
    }

    @Transactional(readOnly = true)
    public List<MessMenuDto.FeedbackDto> getFeedbackByDay(String day) {
        return messFeedbackRepository.findByDayOfWeekIgnoreCase(day).stream()
                .map(f -> MessMenuDto.FeedbackDto.builder()
                        .id(f.getId())
                        .studentId(f.getStudent().getId())
                        .studentName(f.getStudent().getFullName())
                        .dayOfWeek(f.getDayOfWeek())
                        .mealType(f.getMealType())
                        .rating(f.getRating())
                        .comment(f.getComment())
                        .createdAt(f.getCreatedAt())
                        .build())
                .collect(Collectors.toList());
    }

    public MessMenuDto mapToDto(MessMenu m) {
        return MessMenuDto.builder()
                .id(m.getId())
                .dayOfWeek(m.getDayOfWeek())
                .breakfast(m.getBreakfast())
                .lunch(m.getLunch())
                .snacks(m.getSnacks())
                .dinner(m.getDinner())
                .specialNotes(m.getSpecialNotes())
                .build();
    }
}
