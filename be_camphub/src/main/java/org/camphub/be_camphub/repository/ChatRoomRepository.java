package org.camphub.be_camphub.repository;

import org.camphub.be_camphub.entity.ChatRoom;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ChatRoomRepository extends MongoRepository<ChatRoom, UUID> {
    Optional<ChatRoom> findByChatCode(String chatCode);

    @Query("{'participantIds': {$all: ?0, $size: 2}}")
    Optional<ChatRoom> findByParticipantIdsIn(List<UUID> participantIds);
}
