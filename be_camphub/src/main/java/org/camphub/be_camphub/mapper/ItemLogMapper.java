package org.camphub.be_camphub.mapper;

import org.camphub.be_camphub.dto.response.item.ItemLogsResponse;
import org.camphub.be_camphub.entity.ItemLog;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ItemLogMapper {
    @Mapping(target = "account", ignore = true) // sẽ set trong service
    @Mapping(target = "action", expression = "java(itemLog.getAction().name())")
    @Mapping(
            target = "previousStatus",
            expression = "java(itemLog.getPreviousStatus() != null ? itemLog.getPreviousStatus().name() : null)")
    @Mapping(
            target = "currentStatus",
            expression = "java(itemLog.getCurrentStatus() != null ? itemLog.getCurrentStatus().name() : null)")
    @Mapping(
            target = "createdAt",
            expression = "java(itemLog.getCreatedAt() != null ? itemLog.getCreatedAt().toString() : null)")
    ItemLogsResponse entityToResponse(ItemLog itemLogs);
}
