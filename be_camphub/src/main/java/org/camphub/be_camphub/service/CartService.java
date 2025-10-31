package org.camphub.be_camphub.service;

import java.util.List;
import java.util.UUID;

import org.camphub.be_camphub.dto.request.cart.CartItemCreationRequest;
import org.camphub.be_camphub.dto.request.cart.CartItemPatchRequest;
import org.camphub.be_camphub.dto.request.cart.CartItemUpdateRequest;
import org.camphub.be_camphub.dto.response.cart.CartItemResponse;
import org.camphub.be_camphub.entity.CartItem;

public interface CartService {
    CartItemResponse addItemToCart(UUID accountId, CartItemCreationRequest request);

    CartItemResponse updateCartItem(UUID cartItemId, CartItemUpdateRequest request);

    CartItemResponse patchCartItem(UUID cartItemId, CartItemPatchRequest request);

    void removeCartItem(UUID cartItemId);

    void clearCart(UUID accountId);

    void removeMultipleCartItems(List<UUID> cartItemIds);

    List<CartItem> getValidCartItems(UUID accountId);
}
