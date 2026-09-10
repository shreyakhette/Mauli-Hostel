package com.sakhi.hostel.service;

import com.sakhi.hostel.dto.HostelConfigDto;
import com.sakhi.hostel.dto.PasswordChangeRequest;
import com.sakhi.hostel.entity.Hostel;
import com.sakhi.hostel.entity.User;
import com.sakhi.hostel.exception.BadRequestException;
import com.sakhi.hostel.exception.ResourceNotFoundException;
import com.sakhi.hostel.repository.HostelRepository;
import com.sakhi.hostel.repository.RoomRepository;
import com.sakhi.hostel.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class SettingsService {

    private final HostelRepository hostelRepository;
    private final RoomRepository roomRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional(readOnly = true)
    public HostelConfigDto getHostelConfig() {
        Hostel hostel = hostelRepository.findAll().stream().findFirst()
                .orElseGet(() -> Hostel.builder()
                        .name("Sakhi Girls Hostel")
                        .totalRooms(100)
                        .bedsPerRoom(4)
                        .totalFloors(4)
                        .totalCapacity(400)
                        .address("Near City University Campus, Civil Lines, Nagpur")
                        .contactNumber("+91 712 2548900")
                        .email("contact@sakhihostel.com")
                        .build());

        Integer dbTotal = roomRepository.getTotalBedCapacity();
        Integer dbOccupied = roomRepository.getTotalOccupiedBeds();

        int total = dbTotal != null ? dbTotal : hostel.getTotalCapacity();
        int occupied = dbOccupied != null ? dbOccupied : 363;
        int available = Math.max(0, total - occupied);
        double occupancyRate = total > 0 ? Math.round(((double) occupied / total) * 1000.0) / 10.0 : 0.0;

        return HostelConfigDto.builder()
                .id(hostel.getId())
                .name(hostel.getName())
                .totalRooms(hostel.getTotalRooms())
                .bedsPerRoom(hostel.getBedsPerRoom())
                .totalFloors(hostel.getTotalFloors())
                .totalCapacity(total)
                .address(hostel.getAddress())
                .contactNumber(hostel.getContactNumber())
                .email(hostel.getEmail())
                .occupiedBeds(occupied)
                .availableBeds(available)
                .occupancyPercentage(occupancyRate)
                .build();
    }

    @Transactional
    public HostelConfigDto updateHostelConfig(HostelConfigDto dto) {
        Hostel hostel = hostelRepository.findAll().stream().findFirst()
                .orElseGet(() -> Hostel.builder().build());

        hostel.setName(dto.getName().trim());
        hostel.setTotalRooms(dto.getTotalRooms());
        hostel.setBedsPerRoom(dto.getBedsPerRoom());
        hostel.setTotalFloors(dto.getTotalFloors());
        hostel.setTotalCapacity(dto.getTotalRooms() * dto.getBedsPerRoom());

        if (dto.getAddress() != null) hostel.setAddress(dto.getAddress().trim());
        if (dto.getContactNumber() != null) hostel.setContactNumber(dto.getContactNumber().trim());
        if (dto.getEmail() != null) hostel.setEmail(dto.getEmail().trim());

        hostel = hostelRepository.save(hostel);
        return getHostelConfig();
    }

    @Transactional
    public void changePassword(Long userId, PasswordChangeRequest req) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));

        if (!passwordEncoder.matches(req.getCurrentPassword(), user.getPassword())) {
            throw new BadRequestException("Current password is incorrect.");
        }

        user.setPassword(passwordEncoder.encode(req.getNewPassword()));
        userRepository.save(user);
    }
}
