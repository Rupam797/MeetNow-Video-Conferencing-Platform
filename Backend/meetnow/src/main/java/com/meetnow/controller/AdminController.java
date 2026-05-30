package com.meetnow.controller;

import com.meetnow.entity.MeetingRoom;
import com.meetnow.entity.User;
import com.meetnow.repository.MeetingRoomRepository;
import com.meetnow.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final UserRepository userRepository;
    private final MeetingRoomRepository meetingRoomRepository;

    @GetMapping("/stats")
    public ResponseEntity<?> getStats() {
        long totalUsers = userRepository.count();
        List<MeetingRoom> rooms = meetingRoomRepository.findAll();
        long totalRooms = rooms.size();
        long activeRooms = rooms.stream().filter(MeetingRoom::isActive).count();
        long inactiveRooms = totalRooms - activeRooms;

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", totalUsers);
        stats.put("totalRooms", totalRooms);
        stats.put("activeRooms", activeRooms);
        stats.put("inactiveRooms", inactiveRooms);

        return ResponseEntity.ok(stats);
    }

    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers() {
        List<User> users = userRepository.findAll();
        List<Map<String, Object>> response = users.stream().map(user -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", user.getId());
            map.put("userId", user.getUserId());
            map.put("name", user.getName());
            map.put("email", user.getEmail());
            map.put("role", user.getRole());
            map.put("createdAt", user.getCreatedAt());
            return map;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    @PutMapping("/users/{id}/role")
    public ResponseEntity<?> updateUserRole(@PathVariable String id, @RequestBody Map<String, String> request) {
        String newRole = request.get("role");
        if (newRole == null || (!newRole.equals("USER") && !newRole.equals("ADMIN"))) {
            return ResponseEntity.badRequest().body(Map.of("error", true, "message", "Invalid role"));
        }

        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", true, "message", "User not found"));
        }

        User user = userOpt.get();
        user.setRole(newRole);
        userRepository.save(user);

        return ResponseEntity.ok(Map.of("message", "User role updated successfully", "id", id, "role", newRole));
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable String id) {
        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", true, "message", "User not found"));
        }

        userRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "User deleted successfully", "id", id));
    }

    @GetMapping("/rooms")
    public ResponseEntity<?> getAllRooms() {
        List<MeetingRoom> rooms = meetingRoomRepository.findAll();
        return ResponseEntity.ok(rooms);
    }

    @DeleteMapping("/rooms/{roomId}")
    public ResponseEntity<?> deleteRoom(@PathVariable String roomId) {
        Optional<MeetingRoom> roomOpt = meetingRoomRepository.findByRoomId(roomId);
        if (roomOpt.isEmpty()) {
            roomOpt = meetingRoomRepository.findById(roomId);
        }

        if (roomOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", true, "message", "Room not found"));
        }

        meetingRoomRepository.delete(roomOpt.get());
        return ResponseEntity.ok(Map.of("message", "Meeting room deleted successfully", "roomId", roomId));
    }
}

