package org.camphub.be_camphub.Utils;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import org.camphub.be_camphub.dto.request.MediaResourceRequest;
import org.camphub.be_camphub.entity.MediaResource;
import org.springframework.stereotype.Component;

@Component
public class MediaUtils {
    public List<MediaResource> fromRequest(List<MediaResourceRequest> requests) {
        if (requests == null || requests.isEmpty()) return Collections.emptyList();
        return requests.stream()
                .map(r -> MediaResource.builder()
                        .url(r.getUrl())
                        .type(r.getType())
                        .build())
                .collect(Collectors.toList());
    }
}
