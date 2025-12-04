package org.camphub.be_camphub.repository;

import java.util.List;

import org.camphub.be_camphub.entity.ChatMessage;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ChatMessageRepository extends MongoRepository<ChatMessage, String> {
    List<ChatMessage> findByChatCodeOrderByTimestampAsc(String chatCode);
}
