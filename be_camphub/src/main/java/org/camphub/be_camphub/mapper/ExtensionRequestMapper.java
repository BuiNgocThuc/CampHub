package org.camphub.be_camphub.mapper;

import org.camphub.be_camphub.dto.response.extension_req.ExtensionReqResponse;
import org.camphub.be_camphub.entity.ExtensionRequest;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ExtensionRequestMapper {
    @Mapping(target = "lessorName", ignore = true)
    @Mapping(target = "lesseeName", ignore = true)
    @Mapping(target = "itemName", ignore = true)
    ExtensionReqResponse entityToResponse(ExtensionRequest extensionRequest);
}
