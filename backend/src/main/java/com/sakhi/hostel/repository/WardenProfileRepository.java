package com.sakhi.hostel.repository;

import com.sakhi.hostel.entity.User;
import com.sakhi.hostel.entity.WardenProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface WardenProfileRepository extends JpaRepository<WardenProfile, Long> {
    Optional<WardenProfile> findByUser(User user);
    Optional<WardenProfile> findByEmail(String email);
}
