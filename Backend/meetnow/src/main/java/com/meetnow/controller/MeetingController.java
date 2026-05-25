package com.meetnow.controller;

import com.meetnow.entity.MeetingRoom;
import com.meetnow.repository.MeetingRoomRepository;
import com.meetnow.service.AgoraTokenService;
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
public class MeetingController {

    private final MeetingRoomRepository meetingRoomRepository;
    private final AgoraTokenService agoraTokenService;

    /**
     * POST /api/meetings/create — Create a new meeting room (authenticated)
     */
    @PostMapping("/create")
    public ResponseEntity<?> createMeetingRoom(
            @RequestBody Map<String, String> request,
            @CurrentSecurityContext(expression = "authentication?.name") String email) {

        String roomId = request.get("roomId");
        if (roomId == null || roomId.trim().isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", true, "message", "Room ID is required"));
        }

        // Use the authenticated user's email as creator
        String creator = (email != null && !email.equals("anonymousUser"))
                ? email
                : request.getOrDefault("createdBy", "Guest");

        // Check if room already exists
        if (meetingRoomRepository.findByRoomId(roomId).isPresent()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", true, "message", "Room ID already exists"));
        }

        MeetingRoom meetingRoom = MeetingRoom.builder()
                .roomId(roomId)
                .roomName(request.getOrDefault("roomName", "Meeting Room"))
                .createdBy(creator)
                .active(true)
                .build();

        meetingRoomRepository.save(meetingRoom);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Meeting room created successfully");
        response.put("roomId", roomId);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * GET /api/meetings/validate/{roomId} — Check if a room exists (public)
     */
    @GetMapping("/validate/{roomId}")
    public ResponseEntity<?> validateRoom(@PathVariable String roomId) {
        if (meetingRoomRepository.findByRoomId(roomId).isPresent()) {
            return ResponseEntity.ok(Map.of("message", "Room is valid", "roomId", roomId));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", true, "message", "Room not found or invalid link"));
        }
    }

    /**
     * GET /api/meetings/token — Generate Agora RTC token for a channel (public)
     */
    @GetMapping("/token")
    public ResponseEntity<?> getAgoraToken(
            @RequestParam String channelName,
            @RequestParam int uid) {
        try {
            String token = agoraTokenService.generateRtcToken(channelName, uid);
            return ResponseEntity.ok(Map.of("token", token));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", true, "message", "Failed to generate token: " + e.getMessage()));
        }
    }
}
