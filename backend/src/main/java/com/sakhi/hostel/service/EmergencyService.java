package com.sakhi.hostel.service;

import com.sakhi.hostel.dto.EmergencyContactDto;
import com.sakhi.hostel.entity.EmergencyContact;
import com.sakhi.hostel.exception.ResourceNotFoundException;
import com.sakhi.hostel.repository.EmergencyContactRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EmergencyService {

    private final EmergencyContactRepository contactRepository;

    @Transactional(readOnly = true)
    public List<EmergencyContactDto> getActiveContacts() {
        return contactRepository.findByIsActiveTrueOrderByOrderIndexAsc().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<EmergencyContactDto> getAllContacts() {
        return contactRepository.findAllByOrderByOrderIndexAsc().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public EmergencyContactDto createContact(EmergencyContactDto dto) {
        EmergencyContact contact = EmergencyContact.builder()
                .title(dto.getTitle().trim().toUpperCase())
                .contactPerson(dto.getContactPerson() != null ? dto.getContactPerson().trim() : null)
                .phoneNumber(dto.getPhoneNumber().trim())
                .altPhone(dto.getAltPhone())
                .location(dto.getLocation())
                .description(dto.getDescription())
                .orderIndex(dto.getOrderIndex() != null ? dto.getOrderIndex() : 0)
                .isActive(dto.getIsActive() != null ? dto.getIsActive() : true)
                .build();

        return mapToDto(contactRepository.save(contact));
    }

    @Transactional
    public EmergencyContactDto updateContact(Long id, EmergencyContactDto dto) {
        EmergencyContact contact = contactRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Emergency contact not found with ID: " + id));

        contact.setTitle(dto.getTitle().trim().toUpperCase());
        contact.setContactPerson(dto.getContactPerson());
        contact.setPhoneNumber(dto.getPhoneNumber().trim());
        contact.setAltPhone(dto.getAltPhone());
        contact.setLocation(dto.getLocation());
        contact.setDescription(dto.getDescription());
        if (dto.getOrderIndex() != null) contact.setOrderIndex(dto.getOrderIndex());
        if (dto.getIsActive() != null) contact.setIsActive(dto.getIsActive());

        return mapToDto(contactRepository.save(contact));
    }

    @Transactional
    public void deleteContact(Long id) {
        if (!contactRepository.existsById(id)) {
            throw new ResourceNotFoundException("Emergency contact not found with ID: " + id);
        }
        contactRepository.deleteById(id);
    }

    public EmergencyContactDto mapToDto(EmergencyContact c) {
        return EmergencyContactDto.builder()
                .id(c.getId())
                .title(c.getTitle())
                .contactPerson(c.getContactPerson())
                .phoneNumber(c.getPhoneNumber())
                .altPhone(c.getAltPhone())
                .location(c.getLocation())
                .description(c.getDescription())
                .orderIndex(c.getOrderIndex())
                .isActive(c.getIsActive())
                .build();
    }
}
