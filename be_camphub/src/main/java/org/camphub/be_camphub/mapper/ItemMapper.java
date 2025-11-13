package org.camphub.be_camphub.mapper;

import java.util.List;
import java.util.UUID;

import org.camphub.be_camphub.dto.request.Item.ItemCreationRequest;
import org.camphub.be_camphub.dto.request.Item.ItemPatchRequest;
import org.camphub.be_camphub.dto.request.Item.ItemUpdateRequest;
import org.camphub.be_camphub.dto.request.MediaResourceRequest;
import org.camphub.be_camphub.dto.response.item.ItemResponse;
import org.camphub.be_camphub.entity.Item;
import org.camphub.be_camphub.entity.MediaResource;
import org.mapstruct.*;
import java.util.Collections;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface ItemMapper {

    @Mapping(target = "price", source = "pricePerDay")
    @Mapping(target = "depositAmount", source = "depositAmount")
    @Mapping(target = "status", expression = "java(item.getStatus().name())")
    @Mapping(target = "imageUrls", source = "mediaUrls", qualifiedByName = "mediaListToUrls")
    @Mapping(target = "ownerName", ignore = true)
    @Mapping(target = "categoryName", ignore = true)
    ItemResponse entityToResponse(Item item);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "ownerId", source = "ownerId")
    @Mapping(target = "status", constant = "PENDING_APPROVAL")
    @Mapping(target = "createdAt", expression = "java(java.time.LocalDateTime.now())")
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "mediaUrls", expression = "java(mapMediaResources(request.getMediaUrls()))")
    Item creationRequestToEntity(ItemCreationRequest request, UUID ownerId);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "mediaUrls", expression = "java(mapMediaResources(request.getMediaUrls()))")
    void updateRequestToEntity(@MappingTarget Item item, ItemUpdateRequest request);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "mediaUrls", expression = "java(mapMediaResources(request.getMediaUrls()))")
    void patchRequestToEntity(@MappingTarget Item item, ItemPatchRequest request);

    default List<MediaResource> mapMediaResources(List<MediaResourceRequest> resources) {
        if (resources == null || resources.isEmpty()) return Collections.emptyList();
        return resources.stream()
                .map(r -> MediaResource.builder()
                        .url(r.getUrl())
                        .type(r.getType())
                        .build())
                .toList();
    }

    @Named("mediaListToUrls")
    default List<String> mapMediaUrls(List<MediaResource> mediaUrls) {
        if (mediaUrls == null) return java.util.Collections.emptyList();
        return mediaUrls.stream().map(MediaResource::getUrl).toList();
    }
}

