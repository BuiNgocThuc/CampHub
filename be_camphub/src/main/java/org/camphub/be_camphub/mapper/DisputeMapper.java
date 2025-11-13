package org.camphub.be_camphub.mapper;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import org.camphub.be_camphub.dto.request.dispute.DisputeCreationRequest;
import org.camphub.be_camphub.dto.response.dispute.DisputeResponse;
import org.camphub.be_camphub.entity.Dispute;
import org.camphub.be_camphub.entity.MediaResource;
import org.camphub.be_camphub.enums.MediaType;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface DisputeMapper {
    @Mapping(target = "damageTypeName", ignore = true)
    @Mapping(target = "compensationRate", ignore = true)
    @Mapping(target = "evidenceUrls", expression = "java(parseEvidenceUrls(dispute.getEvidences()))")
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
    @Mapping(target = "evidences", expression = "java(toMediaResources(request.getEvidenceUrls()))")
    @Mapping(target = "damageTypeId", ignore = true) // sẽ set ở service
    @Mapping(target = "description", source = "note")
    Dispute creationRequestToEntity(DisputeCreationRequest request);

    default List<String> parseEvidenceUrls(List<MediaResource> evidences) {
        if (evidences == null) return Collections.emptyList();
        return evidences.stream()
                .map(MediaResource::getUrl)
                .collect(Collectors.toList());
    }


    default List<MediaResource> toMediaResources(List<String> urls) {
        if (urls == null || urls.isEmpty()) return List.of();
        return urls.stream()
                .map(url -> {
                    // Đoán type dựa trên phần mở rộng
                    String lower = url.toLowerCase();
                    MediaType type = (lower.endsWith(".mp4") || lower.endsWith(".mov") || lower.endsWith(".avi"))
                            ? MediaType.VIDEO
                            : MediaType.IMAGE;
                    return MediaResource.builder()
                            .url(url)
                            .type(type)
                            .build();
                })
                .toList();
    }
}
