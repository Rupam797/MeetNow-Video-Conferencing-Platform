package com.meetnow.service;

import com.meetnow.entity.User;
import com.meetnow.io.SignupRequest;
import com.meetnow.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public User signup(SignupRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        String role = "USER";
        if (request.getEmail().toLowerCase().trim().equals("admin@meetnow.com") || userRepository.count() == 0) {
            role = "ADMIN";
        }

        User user = User.builder()
                .userId(UUID.randomUUID().toString())
                .name(request.getName())
                .email(request.getEmail().toLowerCase().trim())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(role)
                .build();

        return userRepository.save(user);
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email.toLowerCase().trim());
    }
}
