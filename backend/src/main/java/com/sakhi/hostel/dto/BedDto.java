package com.sakhi.hostel.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BedDto {

    private Long id;
    private Long roomId;
    private String roomNumber;
    private Integer bedNumber;
    private String bedLabel;
    private String status; // AVAILABLE, OCCUPIED, MAINTENANCE

    // Allocated student summary if occupied
    private Long studentId;
    private String studentSystemId; // e.g. "STU00123"
    private String studentName;
    private String studentDepartment;
    private String studentMobile;
    private String studentEmail;
}
