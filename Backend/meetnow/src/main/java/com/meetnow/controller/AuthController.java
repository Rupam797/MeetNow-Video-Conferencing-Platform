package com.meetnow.controller;

import com.meetnow.entity.User;
import com.meetnow.io.AuthResponse;
import com.meetnow.io.LoginRequest;
import com.meetnow.io.SignupRequest;
import com.meetnow.service.AppUserDetailsService;
import com.meetnow.service.UserService;
import com.meetnow.util.JwtUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.annotation.CurrentSecurityContext;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final AppUserDetailsService appUserDetailsService;
    private final UserService userService;
    private final JwtUtil jwtUtil;

    /**
     * POST /register — Create a new user account
     */
    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody SignupRequest request) {
        try {
            User user = userService.signup(request);

            // Auto-login after signup: generate JWT immediately
            final String jwtToken = jwtUtil.generateToken(user.getEmail());

            AuthResponse response = AuthResponse.builder()
                    .email(user.getEmail())
                    .name(user.getName())
                    .token(jwtToken)
                    .build();

            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (RuntimeException e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", true);
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    /**
     * POST /login — Authenticate and return JWT token
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail().toLowerCase().trim(),
                            request.getPassword()
                    )
            );

            final UserDetails userDetails = appUserDetailsService
                    .loadUserByUsername(request.getEmail());
            final String jwtToken = jwtUtil.generateToken(userDetails.getUsername());

            // Fetch user name from DB
            User user = userService.findByEmail(request.getEmail())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            AuthResponse response = AuthResponse.builder()
                    .email(user.getEmail())
                    .name(user.getName())
                    .token(jwtToken)
                    .build();

            return ResponseEntity.ok(response);

        } catch (BadCredentialsException e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", true);
            error.put("message", "Invalid email or password");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", true);
            error.put("message", "Authentication failed");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }
    }

    /**
     * GET /auth/me — Get current authenticated user info
     */
    @GetMapping("/auth/me")
    public ResponseEntity<?> getCurrentUser(
            @CurrentSecurityContext(expression = "authentication?.name") String email) {

        if (email == null || email.equals("anonymousUser")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", true, "message", "Not authenticated"));
        }

        User user = userService.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Map<String, Object> response = new HashMap<>();
        response.put("email", user.getEmail());
        response.put("name", user.getName());
        response.put("userId", user.getUserId());

        return ResponseEntity.ok(response);
    }
}
