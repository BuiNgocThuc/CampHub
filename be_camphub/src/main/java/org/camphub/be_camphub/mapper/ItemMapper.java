package org.camphub.be_camphub.mapper;

import java.util.UUID;

import org.camphub.be_camphub.dto.request.Item.ItemCreationRequest;
import org.camphub.be_camphub.dto.request.Item.ItemPatchRequest;
import org.camphub.be_camphub.dto.request.Item.ItemUpdateRequest;
import org.camphub.be_camphub.dto.response.item.ItemResponse;
import org.camphub.be_camphub.entity.Item;
import org.mapstruct.*;

@Mapper(componentModel = "spring", uses = MediaResourceMapper.class)
public interface ItemMapper {

    @Mapping(target = "price", source = "pricePerDay")
    @Mapping(target = "depositAmount", source = "depositAmount")
    @Mapping(target = "status", expression = "java(item.getStatus().name())")
    @Mapping(target = "ownerName", ignore = true) // sẽ set trong service
    @Mapping(target = "categoryName", ignore = true) // sẽ set trong service
    @Mapping(target = "mediaUrls", qualifiedByName = "toResponse")
    ItemResponse entityToResponse(Item item);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "ownerId", source = "ownerId")
    @Mapping(target = "status", constant = "PENDING_APPROVAL")
    @Mapping(target = "createdAt", expression = "java(java.time.LocalDateTime.now())")
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "mediaUrls", qualifiedByName = "fromRequest")
    Item creationRequestToEntity(ItemCreationRequest request, UUID ownerId);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "ownerId", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "mediaUrls", qualifiedByName = "fromRequest")
    void updateRequestToEntity(@MappingTarget Item item, ItemUpdateRequest request);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "ownerId", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "mediaUrls", qualifiedByName = "fromRequest")
    void patchRequestToEntity(@MappingTarget Item item, ItemPatchRequest request);
}

