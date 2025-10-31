package org.camphub.be_camphub.mapper;

import org.camphub.be_camphub.dto.response.extension_req.ExtensionReqResponse;
import org.camphub.be_camphub.entity.ExtensionRequest;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ExtensionRequestMapper {
    ExtensionReqResponse entityToResponse(ExtensionRequest extensionRequest);
}
