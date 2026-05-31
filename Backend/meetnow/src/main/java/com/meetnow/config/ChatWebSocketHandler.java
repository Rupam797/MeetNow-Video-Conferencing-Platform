package com.meetnow.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;

@Slf4j
@Component
public class ChatWebSocketHandler extends TextWebSocketHandler {

    // Map of roomId -> List of active WebSocket sessions
    private final ConcurrentHashMap<String, CopyOnWriteArrayList<WebSocketSession>> roomSessions = new ConcurrentHashMap<>();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        String roomId = getRoomId(session);
        if (roomId == null || roomId.trim().isEmpty()) {
            log.warn("Connection attempt without valid roomId. Closing session: {}", session.getId());
            session.close(CloseStatus.BAD_DATA);
            return;
        }

        roomSessions.computeIfAbsent(roomId, k -> new CopyOnWriteArrayList<>()).add(session);
        log.info("WebSocket connection established. Session: {}, Room: {}, Total active in room: {}", 
                session.getId(), roomId, roomSessions.get(roomId).size());
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        String roomId = getRoomId(session);
        if (roomId == null) {
            return;
        }

        CopyOnWriteArrayList<WebSocketSession> sessions = roomSessions.get(roomId);
        if (sessions == null) {
            return;
        }

        log.debug("Received message from session {} in room {}: {}", session.getId(), roomId, message.getPayload());

        // Broadcast to all other sessions in the same room
        for (WebSocketSession targetSession : sessions) {
            if (targetSession.isOpen() && !targetSession.getId().equals(session.getId())) {
                try {
                    targetSession.sendMessage(message);
                } catch (IOException e) {
                    log.error("Failed to send message to session {}: {}", targetSession.getId(), e.getMessage());
                }
            }
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        String roomId = getRoomId(session);
        if (roomId != null) {
            CopyOnWriteArrayList<WebSocketSession> sessions = roomSessions.get(roomId);
            if (sessions != null) {
                sessions.remove(session);
                log.info("WebSocket connection closed. Session: {}, Room: {}, Total active remaining: {}", 
                        session.getId(), roomId, sessions.size());
                if (sessions.isEmpty()) {
                    roomSessions.remove(roomId);
                }
            }
        }
    }

    @Override
    public void handleTransportError(WebSocketSession session, Throwable exception) throws Exception {
        log.error("WebSocket transport error for session {}: {}", session.getId(), exception.getMessage());
        try {
            session.close(CloseStatus.SERVER_ERROR);
        } catch (IOException ignored) {}
    }

    /**
     * Helper to extract roomId from the WebSocket URI path.
     * URI pattern: /ws/chat/{roomId}
     */
    private String getRoomId(WebSocketSession session) {
        if (session.getUri() == null) {
            return null;
        }
        String path = session.getUri().getPath();
        if (path == null) {
            return null;
        }
        String[] parts = path.split("/");
        if (parts.length > 0) {
            return parts[parts.length - 1];
        }
        return null;
    }
}
