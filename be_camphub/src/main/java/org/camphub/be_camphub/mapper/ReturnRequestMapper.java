package org.camphub.be_camphub.mapper;

import org.camphub.be_camphub.dto.response.return_req.ReturnReqResponse;
import org.camphub.be_camphub.entity.MediaResource;
import org.camphub.be_camphub.entity.ReturnRequest;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ReturnRequestMapper {

    @Mapping(target = "evidenceUrls", expression = "java(mapEvidenceUrls(returnRequest.getEvidenceUrls()))")
    ReturnReqResponse entityToResponse(ReturnRequest returnRequest);

    // Convert List<MediaResource> -> List<String>
    default List<String> mapEvidenceUrls(List<MediaResource> evidences) {
        if (evidences == null || evidences.isEmpty()) return List.of();
        return evidences.stream()
                .map(MediaResource::getUrl)
                .toList();
    }
}
