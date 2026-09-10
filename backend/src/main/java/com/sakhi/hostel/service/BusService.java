package com.sakhi.hostel.service;

import com.sakhi.hostel.dto.BusDto;
import com.sakhi.hostel.entity.Bus;
import com.sakhi.hostel.entity.BusSchedule;
import com.sakhi.hostel.exception.ResourceNotFoundException;
import com.sakhi.hostel.repository.BusRepository;
import com.sakhi.hostel.repository.BusScheduleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BusService {

    private final BusRepository busRepository;
    private final BusScheduleRepository busScheduleRepository;

    @Transactional(readOnly = true)
    public List<BusDto.ScheduleDto> getAllSchedules() {
        return busScheduleRepository.findAllByOrderByIdAsc().stream()
                .map(this::mapScheduleToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<BusDto.ScheduleDto> getSchedulesByDay(String day) {
        return busScheduleRepository.findByDayOfWeekIgnoreCase(day).stream()
                .map(this::mapScheduleToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<BusDto> getAllBuses() {
        return busRepository.findAll().stream()
                .map(this::mapBusToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public BusDto.ScheduleDto createSchedule(BusDto.ScheduleRequest req) {
        Bus bus = busRepository.findById(req.getBusId())
                .orElseThrow(() -> new ResourceNotFoundException("Bus not found with ID: " + req.getBusId()));

        BusSchedule.BusStatus status = BusSchedule.BusStatus.ON_TIME;
        if (req.getStatus() != null) {
            try {
                status = BusSchedule.BusStatus.valueOf(req.getStatus().toUpperCase());
            } catch (IllegalArgumentException ignored) {}
        }

        BusSchedule schedule = BusSchedule.builder()
                .bus(bus)
                .dayOfWeek(req.getDayOfWeek().toUpperCase())
                .route(req.getRoute().trim())
                .departureTime(req.getDepartureTime().trim())
                .returnTime(req.getReturnTime())
                .totalSeats(req.getTotalSeats())
                .availableSeats(req.getAvailableSeats())
                .status(status)
                .notes(req.getNotes())
                .build();

        return mapScheduleToDto(busScheduleRepository.save(schedule));
    }

    @Transactional
    public BusDto.ScheduleDto updateSchedule(Long id, BusDto.ScheduleRequest req) {
        BusSchedule schedule = busScheduleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Bus schedule not found with ID: " + id));

        if (req.getBusId() != null) {
            Bus bus = busRepository.findById(req.getBusId())
                    .orElseThrow(() -> new ResourceNotFoundException("Bus not found with ID: " + req.getBusId()));
            schedule.setBus(bus);
        }

        if (req.getDayOfWeek() != null) schedule.setDayOfWeek(req.getDayOfWeek().toUpperCase());
        if (req.getRoute() != null) schedule.setRoute(req.getRoute().trim());
        if (req.getDepartureTime() != null) schedule.setDepartureTime(req.getDepartureTime().trim());
        if (req.getReturnTime() != null) schedule.setReturnTime(req.getReturnTime());
        if (req.getTotalSeats() != null) schedule.setTotalSeats(req.getTotalSeats());
        if (req.getAvailableSeats() != null) schedule.setAvailableSeats(req.getAvailableSeats());
        if (req.getNotes() != null) schedule.setNotes(req.getNotes());

        if (req.getStatus() != null) {
            try {
                schedule.setStatus(BusSchedule.BusStatus.valueOf(req.getStatus().toUpperCase()));
            } catch (IllegalArgumentException ignored) {}
        }

        return mapScheduleToDto(busScheduleRepository.save(schedule));
    }

    @Transactional
    public void deleteSchedule(Long id) {
        if (!busScheduleRepository.existsById(id)) {
            throw new ResourceNotFoundException("Bus schedule not found with ID: " + id);
        }
        busScheduleRepository.deleteById(id);
    }

    public BusDto.ScheduleDto mapScheduleToDto(BusSchedule s) {
        return BusDto.ScheduleDto.builder()
                .id(s.getId())
                .busId(s.getBus().getId())
                .busNumber(s.getBus().getBusNumber())
                .dayOfWeek(s.getDayOfWeek())
                .route(s.getRoute())
                .departureTime(s.getDepartureTime())
                .returnTime(s.getReturnTime())
                .totalSeats(s.getTotalSeats())
                .availableSeats(s.getAvailableSeats())
                .status(s.getStatus().name())
                .notes(s.getNotes())
                .build();
    }

    public BusDto mapBusToDto(Bus b) {
        return BusDto.builder()
                .id(b.getId())
                .busNumber(b.getBusNumber())
                .routeName(b.getRouteName())
                .totalSeats(b.getTotalSeats())
                .driverName(b.getDriverName())
                .driverPhone(b.getDriverPhone())
                .active(b.getActive())
                .build();
    }
}
