package org.camphub.be_camphub.mapper;

import org.camphub.be_camphub.dto.response.chat.ChatRoomResponse;
import org.camphub.be_camphub.entity.ChatRoom;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ChatRoomMapper {
    @Mapping(target = "receiverUsername", source = "receiverUsername")
    @Mapping(target = "avatarUrl", source = "avatarUrl")
    ChatRoomResponse toChatRoomResponse(ChatRoom entity, String receiverUsername, String avatarUrl);
}
