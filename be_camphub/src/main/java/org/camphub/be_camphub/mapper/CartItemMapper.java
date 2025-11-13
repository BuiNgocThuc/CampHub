package org.camphub.be_camphub.mapper;

import java.util.UUID;

import org.camphub.be_camphub.dto.request.cart.CartItemCreationRequest;
import org.camphub.be_camphub.dto.request.cart.CartItemPatchRequest;
import org.camphub.be_camphub.dto.request.cart.CartItemUpdateRequest;
import org.camphub.be_camphub.dto.response.cart.CartItemResponse;
import org.camphub.be_camphub.entity.CartItem;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface CartItemMapper {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "cartId", source = "cartId")
    @Mapping(
            target = "subtotal",
            expression =
                    "java(request.getPrice().multiply(new java.math.BigDecimal(request.getQuantity() * request.getRentalDays())))")
    CartItem creationRequestToEntity(CartItemCreationRequest request, UUID cartId);

    CartItemResponse entityToResponse(CartItem cartItem);

    void updateRequestToEntity(@MappingTarget CartItem cartItem, CartItemUpdateRequest request);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void patchRequestToEntity(@MappingTarget CartItem cartItem, CartItemPatchRequest request);
}
