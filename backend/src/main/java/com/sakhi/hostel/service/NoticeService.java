package com.sakhi.hostel.service;

import com.sakhi.hostel.dto.NoticeDto;
import com.sakhi.hostel.dto.NoticeRequest;
import com.sakhi.hostel.entity.Notice;
import com.sakhi.hostel.entity.Notification;
import com.sakhi.hostel.entity.User;
import com.sakhi.hostel.exception.ResourceNotFoundException;
import com.sakhi.hostel.repository.NoticeRepository;
import com.sakhi.hostel.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NoticeService {

    private final NoticeRepository noticeRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    @Transactional(readOnly = true)
    public List<NoticeDto> getActiveNotices(String categoryStr) {
        Notice.Category category = null;
        if (categoryStr != null && !categoryStr.isBlank()) {
            try {
                category = Notice.Category.valueOf(categoryStr.toUpperCase());
            } catch (IllegalArgumentException ignored) {}
        }
        return noticeRepository.findActiveNotices(LocalDate.now(), category).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<NoticeDto> getAllNotices() {
        return noticeRepository.findAllByOrderByIsPinnedDescCreatedAtDesc().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public NoticeDto getNoticeById(Long id) {
        Notice notice = noticeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notice not found with ID: " + id));
        return mapToDto(notice);
    }

    @Transactional
    public NoticeDto createNotice(NoticeRequest req, String createdBy) {
        Notice.Category category = Notice.Category.GENERAL;
        if (req.getCategory() != null && !req.getCategory().isBlank()) {
            try {
                category = Notice.Category.valueOf(req.getCategory().toUpperCase());
            } catch (IllegalArgumentException ignored) {}
        }

        Notice.Priority priority = Notice.Priority.NORMAL;
        if (req.getPriority() != null && !req.getPriority().isBlank()) {
            try {
                priority = Notice.Priority.valueOf(req.getPriority().toUpperCase());
            } catch (IllegalArgumentException ignored) {}
        }

        Notice notice = Notice.builder()
                .title(req.getTitle().trim())
                .content(req.getContent().trim())
                .category(category)
                .priority(priority)
                .isPinned(req.getIsPinned() != null ? req.getIsPinned() : false)
                .isImportant(req.getIsImportant() != null ? req.getIsImportant() : (priority == Notice.Priority.HIGH || priority == Notice.Priority.CRITICAL || priority == Notice.Priority.URGENT))
                .publishDate(req.getPublishDate() != null ? req.getPublishDate() : LocalDate.now())
                .expiryDate(req.getExpiryDate())
                .createdBy(createdBy)
                .build();

        notice = noticeRepository.save(notice);

        // If high priority or important, notify all students
        if (notice.getIsImportant() || notice.getPriority() == Notice.Priority.HIGH || notice.getPriority() == Notice.Priority.CRITICAL || notice.getPriority() == Notice.Priority.URGENT) {
            List<User> students = userRepository.findByRole(com.sakhi.hostel.entity.Role.ROLE_STUDENT);
            for (User student : students) {
                notificationService.createNotification(
                        student,
                        "Important Notice: " + notice.getTitle(),
                        notice.getContent().length() > 100 ? notice.getContent().substring(0, 97) + "..." : notice.getContent(),
                        Notification.NotificationType.NOTICE,
                        "/student/notices"
                );
            }
        }

        return mapToDto(notice);
    }

    @Transactional
    public NoticeDto updateNotice(Long id, NoticeRequest req) {
        Notice notice = noticeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notice not found with ID: " + id));

        notice.setTitle(req.getTitle().trim());
        notice.setContent(req.getContent().trim());

        if (req.getCategory() != null) {
            try {
                notice.setCategory(Notice.Category.valueOf(req.getCategory().toUpperCase()));
            } catch (IllegalArgumentException ignored) {}
        }

        if (req.getPriority() != null) {
            try {
                notice.setPriority(Notice.Priority.valueOf(req.getPriority().toUpperCase()));
            } catch (IllegalArgumentException ignored) {}
        }

        if (req.getIsPinned() != null) notice.setIsPinned(req.getIsPinned());
        if (req.getIsImportant() != null) notice.setIsImportant(req.getIsImportant());
        if (req.getPublishDate() != null) notice.setPublishDate(req.getPublishDate());
        if (req.getExpiryDate() != null) notice.setExpiryDate(req.getExpiryDate());

        return mapToDto(noticeRepository.save(notice));
    }

    @Transactional
    public void deleteNotice(Long id) {
        if (!noticeRepository.existsById(id)) {
            throw new ResourceNotFoundException("Notice not found with ID: " + id);
        }
        noticeRepository.deleteById(id);
    }

    public NoticeDto mapToDto(Notice n) {
        return NoticeDto.builder()
                .id(n.getId())
                .title(n.getTitle())
                .content(n.getContent())
                .category(n.getCategory().name())
                .priority(n.getPriority().name())
                .isPinned(n.getIsPinned())
                .isImportant(n.getIsImportant())
                .publishDate(n.getPublishDate())
                .expiryDate(n.getExpiryDate())
                .createdBy(n.getCreatedBy())
                .createdAt(n.getCreatedAt())
                .build();
    }
}
