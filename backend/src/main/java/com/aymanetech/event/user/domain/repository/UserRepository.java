package com.aymanetech.event.user.domain.repository;

import com.aymanetech.event.user.domain.entity.User;
import com.aymanetech.event.user.domain.vo.UserId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, UserId> {
    Optional<User> findByEmail(String email);
}