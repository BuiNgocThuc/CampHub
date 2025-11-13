package org.camphub.be_camphub.repository;

import org.camphub.be_camphub.entity.ChatMessage;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ChatMessageRepository extends MongoRepository<ChatMessage, UUID> {
    List<ChatMessage> findByChatCodeOrderByTimestampAsc(String chatCode);
}
