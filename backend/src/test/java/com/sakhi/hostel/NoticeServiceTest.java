package com.sakhi.hostel;

import com.sakhi.hostel.dto.NoticeDto;
import com.sakhi.hostel.dto.NoticeRequest;
import com.sakhi.hostel.service.NoticeService;
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
class NoticeServiceTest {

    @Autowired
    private NoticeService noticeService;

    @Test
    void testNoticeCreationAndActiveFilter() {
        NoticeRequest req = NoticeRequest.builder()
                .title("Notice for Annual Fest")
                .content("Cultural fest auditions start next Monday in the recreation hall.")
                .category("EVENT")
                .priority("HIGH")
                .isPinned(true)
                .publishDate(LocalDate.now())
                .expiryDate(LocalDate.now().plusDays(10))
                .build();

        NoticeDto created = noticeService.createNotice(req, "Kranti Bhoyar");
        assertNotNull(created);
        assertEquals("Notice for Annual Fest", created.getTitle());
        assertTrue(created.getIsPinned());

        List<NoticeDto> active = noticeService.getActiveNotices("EVENT");
        assertFalse(active.isEmpty());
        assertTrue(active.stream().anyMatch(n -> n.getId().equals(created.getId())));

        // Delete notice
        noticeService.deleteNotice(created.getId());
        List<NoticeDto> afterDelete = noticeService.getActiveNotices("EVENT");
        assertFalse(afterDelete.stream().anyMatch(n -> n.getId().equals(created.getId())));
    }
}
