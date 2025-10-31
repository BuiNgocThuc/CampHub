package org.camphub.be_camphub.mapper;

import java.util.UUID;

import org.camphub.be_camphub.dto.request.Item.ItemCreationRequest;
import org.camphub.be_camphub.dto.request.Item.ItemPatchRequest;
import org.camphub.be_camphub.dto.request.Item.ItemUpdateRequest;
import org.camphub.be_camphub.dto.response.item.ItemResponse;
import org.camphub.be_camphub.entity.Item;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface ItemMapper {

    @Mapping(target = "ownerName", ignore = true) // sẽ set trong service
    @Mapping(target = "categoryName", ignore = true)
    @Mapping(target = "imageUrls", ignore = true)
    @Mapping(target = "price", expression = "java(java.math.BigDecimal.valueOf(item.getPricePerDay()))")
    @Mapping(target = "depositAmount", expression = "java(java.math.BigDecimal.valueOf(item.getDepositAmount()))")
    @Mapping(target = "status", expression = "java(item.getStatus().name())")
    ItemResponse entityToResponse(Item item);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "status", constant = "PENDING_APPROVAL")
    @Mapping(target = "ownerId", source = "ownerId")
    @Mapping(target = "categoryId", source = "request.categoryId")
    @Mapping(target = "createdAt", expression = "java(java.time.LocalDateTime.now())")
    @Mapping(target = "updatedAt", ignore = true)
    Item creationRequestToEntity(ItemCreationRequest request, UUID ownerId);

    void updateRequestToEntity(@MappingTarget Item item, ItemUpdateRequest request);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void patchRequestToEntity(@MappingTarget Item item, ItemPatchRequest request);
}
