package org.camphub.be_camphub.mapper;

import org.camphub.be_camphub.dto.request.return_req.ReturnReqCreationRequest;
import org.camphub.be_camphub.dto.response.return_req.ReturnReqResponse;
import org.camphub.be_camphub.entity.ReturnRequest;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = MediaResourceMapper.class)
public interface ReturnRequestMapper {
    @Mapping(target = "lesseeName", ignore = true)
    @Mapping(target = "lessorName", ignore = true)
    @Mapping(target = "itemName", ignore = true)
    @Mapping(target = "evidenceUrls", source = "evidenceUrls", qualifiedByName = "toResponse")
    ReturnReqResponse entityToResponse(ReturnRequest returnRequest);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "lesseeId", ignore = true) // set trong service
    @Mapping(target = "lessorId", ignore = true) // set trong service
    @Mapping(target = "status", constant = "PENDING")
    @Mapping(target = "adminNote", ignore = true)
    @Mapping(target = "resolvedAt", ignore = true)
    @Mapping(target = "createdAt", ignore = true) // Auto @CreatedDate
    @Mapping(target = "updatedAt", ignore = true) // Auto @LastModifiedDate
    @Mapping(target = "lessorConfirmedAt", ignore = true)
    @Mapping(target = "adminReviewedAt", ignore = true)
    @Mapping(target = "refundedAt", ignore = true)
    @Mapping(target = "evidenceUrls", source = "evidenceUrls", qualifiedByName = "fromRequest")
    ReturnRequest creationRequestToEntity(ReturnReqCreationRequest request);
}
