package com.meetnow.controller;

import com.meetnow.entity.MeetingRoom;
import com.meetnow.repository.MeetingRoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.CurrentSecurityContext;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/meetings")
@RequiredArgsConstructor
public class MeetingRoomController {

    private final MeetingRoomRepository meetingRoomRepository;

    @PostMapping("/create")
    public ResponseEntity<?> createMeetingRoom(@RequestBody Map<String, String> request,
                                               @CurrentSecurityContext(expression = "authentication?.name") String email) {
        String roomId = request.get("roomId");
        if (roomId == null || roomId.trim().isEmpty()) {
            Map<String, String> err = new HashMap<>();
            err.put("message", "Room ID is required");
            return ResponseEntity.badRequest().body(err);
        }
        
        String requestedCreator = request.get("createdBy");
        String creator;
        if (email != null && !email.equals("anonymousUser")) {
            creator = email;
        } else if (requestedCreator != null && !requestedCreator.trim().isEmpty()) {
            creator = requestedCreator;
        } else {
            creator = "Guest";
        }

        if (meetingRoomRepository.findByRoomId(roomId).isPresent()) {
            Map<String, String> err = new HashMap<>();
            err.put("message", "Room ID already exists");
            return ResponseEntity.badRequest().body(err);
        }

        MeetingRoom meetingRoom = MeetingRoom.builder()
                .roomId(roomId)
                .createdBy(creator)
                .build();
                
        meetingRoomRepository.save(meetingRoom);

        Map<String, String> success = new HashMap<>();
        success.put("message", "Meeting room created successfully");
        success.put("roomId", roomId);
        return ResponseEntity.status(HttpStatus.CREATED).body(success);
    }

    @GetMapping("/validate/{roomId}")
    public ResponseEntity<?> validateMeetingRoom(@PathVariable String roomId) {
        if (meetingRoomRepository.findByRoomId(roomId).isPresent()) {
            Map<String, String> success = new HashMap<>();
            success.put("message", "Room is valid");
            return ResponseEntity.ok().body(success);
        } else {
            Map<String, String> err = new HashMap<>();
            err.put("message", "Room not found or invalid link");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(err);
        }
    }
}
