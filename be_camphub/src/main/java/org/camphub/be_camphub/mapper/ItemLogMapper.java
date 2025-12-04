package org.camphub.be_camphub.mapper;

import org.camphub.be_camphub.dto.response.item.ItemLogsResponse;
import org.camphub.be_camphub.entity.ItemLog;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(
        componentModel = "spring",
        uses = {Utils_Mapper.class, MediaResourceMapper.class})
public interface ItemLogMapper {
    @Mapping(target = "account", ignore = true) // sẽ set trong service
    @Mapping(target = "itemName", ignore = true) // sẽ set trong service
    @Mapping(target = "action", source = "action", qualifiedByName = "enumToString")
    @Mapping(target = "previousStatus", source = "previousStatus", qualifiedByName = "enumToString")
    @Mapping(target = "currentStatus", source = "currentStatus", qualifiedByName = "enumToString")
    @Mapping(target = "createdAt", source = "createdAt", qualifiedByName = "localDateTimeToString")
    @Mapping(target = "media", source = "evidenceUrls", qualifiedByName = "toResponse")
    ItemLogsResponse entityToResponse(ItemLog itemLog);
}
