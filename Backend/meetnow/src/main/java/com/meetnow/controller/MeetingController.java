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
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/api/meetings")
@RequiredArgsConstructor
public class MeetingController {

    private final MeetingRoomRepository meetingRoomRepository;
    private final AgoraTokenService agoraTokenService;

    // In-memory participant name registry: channelName -> (uid -> name)
    private static final ConcurrentHashMap<String, ConcurrentHashMap<String, String>> participantRegistry = new ConcurrentHashMap<>();

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

    /**
     * POST /api/meetings/participants/register — Register participant name for a channel
     */
    @PostMapping("/participants/register")
    public ResponseEntity<?> registerParticipant(@RequestBody Map<String, String> request) {
        String channelName = request.get("channelName");
        String uid = request.get("uid");
        String name = request.get("name");

        if (channelName == null || uid == null || name == null) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", true, "message", "channelName, uid, and name are required"));
        }

        participantRegistry
                .computeIfAbsent(channelName, k -> new ConcurrentHashMap<>())
                .put(uid, name);

        return ResponseEntity.ok(Map.of("message", "Participant registered"));
    }

    /**
     * GET /api/meetings/participants/{channelName} — Get all participant names for a channel
     */
    @GetMapping("/participants/{channelName}")
    public ResponseEntity<?> getParticipants(@PathVariable String channelName) {
        Map<String, String> participants = participantRegistry.getOrDefault(channelName, new ConcurrentHashMap<>());
        return ResponseEntity.ok(participants);
    }

    /**
     * POST /api/meetings/participants/unregister — Remove participant from registry when they leave
     */
    @PostMapping("/participants/unregister")
    public ResponseEntity<?> unregisterParticipant(@RequestBody Map<String, String> request) {
        String channelName = request.get("channelName");
        String uid = request.get("uid");

        if (channelName != null && uid != null) {
            ConcurrentHashMap<String, String> channelParticipants = participantRegistry.get(channelName);
            if (channelParticipants != null) {
                channelParticipants.remove(uid);
                if (channelParticipants.isEmpty()) {
                    participantRegistry.remove(channelName);
                }
            }
        }

        return ResponseEntity.ok(Map.of("message", "Participant unregistered"));
    }
}
