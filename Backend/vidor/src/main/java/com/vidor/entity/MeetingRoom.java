package com.vidor.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document(collection = "meeting_rooms")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MeetingRoom {

    @Id
    private String id;

    @Indexed(unique = true)
    private String roomId;

    private String roomName;

    private String createdBy;

    @Builder.Default
    private boolean active = true;

    @CreatedDate
    private Instant createdAt;
}

