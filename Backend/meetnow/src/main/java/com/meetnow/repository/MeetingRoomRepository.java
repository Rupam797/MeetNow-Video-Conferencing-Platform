package com.meetnow.repository;

import com.meetnow.entity.MeetingRoom;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MeetingRoomRepository extends MongoRepository<MeetingRoom, String> {

    Optional<MeetingRoom> findByRoomId(String roomId);

    List<MeetingRoom> findByCreatedBy(String email);
}

