package org.camphub.be_camphub.mapper;

import org.camphub.be_camphub.dto.request.dispute.DisputeCreationRequest;
import org.camphub.be_camphub.dto.response.dispute.DisputeResponse;
import org.camphub.be_camphub.entity.Dispute;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = MediaResourceMapper.class)
public interface DisputeMapper {
    @Mapping(target = "damageTypeName", ignore = true)
    @Mapping(target = "compensationRate", ignore = true)
    @Mapping(target = "reporterName", ignore = true)
    @Mapping(target = "defenderName", ignore = true)
    @Mapping(target = "adminName", ignore = true)
    @Mapping(target = "evidenceUrls", source = "evidences", qualifiedByName = "toResponse")
    DisputeResponse entityToResponse(Dispute dispute);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "reporterId", ignore = true)
    @Mapping(target = "defenderId", ignore = true)
    @Mapping(target = "status", constant = "PENDING_REVIEW")
    @Mapping(target = "adminDecision", ignore = true)
    @Mapping(target = "compensationAmount", ignore = true)
    @Mapping(target = "adminNote", ignore = true)
    @Mapping(target = "adminId", ignore = true)
    @Mapping(target = "resolvedAt", ignore = true)
    @Mapping(target = "createdAt", expression = "java(java.time.LocalDateTime.now())")
    @Mapping(target = "evidences", source = "evidenceUrls", qualifiedByName = "fromRequest")
    @Mapping(target = "description", source = "note")
    Dispute creationRequestToEntity(DisputeCreationRequest request);
}
