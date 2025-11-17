package org.camphub.be_camphub.mapper;

import org.camphub.be_camphub.dto.request.MediaResourceRequest;
import org.camphub.be_camphub.dto.response.MediaResourceResponse;
import org.camphub.be_camphub.entity.MediaResource;
import org.mapstruct.Named;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class MediaResourceMapper {
    // Request -> Entity
    @Named("fromRequest")
    public List<MediaResource> fromRequest(List<MediaResourceRequest> requests) {
        if (requests == null || requests.isEmpty()) return Collections.emptyList();
        return requests.stream()
                .map(r -> MediaResource.builder()
                        .url(r.getUrl())
                        .type(r.getType())
                        .build())
                .collect(Collectors.toList());
    }

    // Entity -> Response
    @Named("toResponse")
    public List<MediaResourceResponse> toResponse(List<MediaResource> entities) {
        if (entities == null || entities.isEmpty()) return Collections.emptyList();
        return entities.stream()
                .map(e -> MediaResourceResponse.builder()
                        .url(e.getUrl())
                        .type(e.getType().name())
                        .build())
                .collect(Collectors.toList());
    }

}
