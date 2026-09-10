package com.sakhi.hostel.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoomDto {

    private Long id;
    private String roomNumber;
    private Integer floor;
    private Integer capacity;
    private Integer occupiedCount;
    private Integer availableBeds;
    private String status; // AVAILABLE, PARTIAL, FULL, MAINTENANCE
    private List<BedDto> beds;
}
