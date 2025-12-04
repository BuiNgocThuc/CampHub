package org.camphub.be_camphub.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.camphub.be_camphub.entity.ChatRoom;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface ChatRoomRepository extends MongoRepository<ChatRoom, String> {
    Optional<ChatRoom> findByChatCode(String chatCode);

    @Query("{'participantIds': {$all: ?0, $size: 2}}")
    Optional<ChatRoom> findByParticipantIdsContainsAll(List<UUID> participantIds);

    @Query("{ 'participantIds': ?0 }")
    List<ChatRoom> findByParticipantIdsContaining(UUID userId);
}
