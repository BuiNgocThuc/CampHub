package org.camphub.be_camphub.mapper;

import java.util.Arrays;
import java.util.List;

import org.camphub.be_camphub.dto.request.dispute.DisputeCreationRequest;
import org.camphub.be_camphub.dto.response.dispute.DisputeResponse;
import org.camphub.be_camphub.entity.Dispute;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

@Mapper(componentModel = "spring")
public interface DisputeMapper {
    @Mapping(target = "damageTypeName", source = "damageType.name")
    @Mapping(target = "compensationRate", source = "damageType.compensationRate")
    @Mapping(target = "evidenceUrls", expression = "java(parseEvidenceUrls(dispute.getEvidenceUrls()))")
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
    @Mapping(target = "evidenceUrls", expression = "java(toEvidenceJson(request.getEvidenceUrls()))")
    @Mapping(target = "damageType", ignore = true) // sẽ set ở service
    Dispute creationRequestToEntity(DisputeCreationRequest request);

    default List<String> parseEvidenceUrls(String json) {
        if (json == null || json.isBlank()) return List.of();
        try {
            ObjectMapper mapper = new ObjectMapper();
            return mapper.readValue(json, new TypeReference<>() {});
        } catch (Exception e) {
            return Arrays.asList(json.split(","));
        }
    }

    default String toEvidenceJson(List<String> urls) {
        if (urls == null || urls.isEmpty()) return null;
        try {
            ObjectMapper mapper = new ObjectMapper();
            return mapper.writeValueAsString(urls);
        } catch (Exception e) {
            return String.join(",", urls);
        }
    }
}
