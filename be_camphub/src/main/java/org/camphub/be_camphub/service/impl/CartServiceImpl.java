package org.camphub.be_camphub.service.impl;

import java.util.List;
import java.util.UUID;

import org.camphub.be_camphub.dto.request.cart.CartItemCreationRequest;
import org.camphub.be_camphub.dto.request.cart.CartItemPatchRequest;
import org.camphub.be_camphub.dto.request.cart.CartItemUpdateRequest;
import org.camphub.be_camphub.dto.response.cart.CartItemResponse;
import org.camphub.be_camphub.entity.Cart;
import org.camphub.be_camphub.entity.CartItem;
import org.camphub.be_camphub.exception.AppException;
import org.camphub.be_camphub.exception.ErrorCode;
import org.camphub.be_camphub.mapper.CartItemMapper;
import org.camphub.be_camphub.repository.CartItemRepository;
import org.camphub.be_camphub.repository.CartRepository;
import org.camphub.be_camphub.service.CartService;
import org.springframework.stereotype.Service;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CartServiceImpl implements CartService {
    CartItemRepository cartItemRepository;
    CartRepository cartRepository;
    CartItemMapper cartItemMapper;

    @Override
    public CartItemResponse addItemToCart(UUID accountId, CartItemCreationRequest request) {
        // find cart id
        Cart cart = cartRepository.findByAccountId(accountId).orElseGet(() -> {
            Cart newCart = Cart.builder().accountId(accountId).build();
            return cartRepository.save(newCart);
        });

        CartItem cartItem = cartItemMapper.creationRequestToEntity(request, cart.getId());

        return cartItemMapper.entityToResponse(cartItemRepository.save(cartItem));
    }

    @Override
    public CartItemResponse updateCartItem(UUID cartItemId, CartItemUpdateRequest request) {
        CartItem cartItem = cartItemRepository
                .findById(cartItemId)
                .orElseThrow(() -> new AppException(ErrorCode.CART_ITEM_NOT_FOUND));

        cartItemMapper.updateRequestToEntity(cartItem, request);

        CartItem updated = cartItemRepository.save(cartItem);
        return cartItemMapper.entityToResponse(updated);
    }

    @Override
    public CartItemResponse patchCartItem(UUID cartItemId, CartItemPatchRequest request) {
        CartItem cartItem = cartItemRepository
                .findById(cartItemId)
                .orElseThrow(() -> new AppException(ErrorCode.CART_ITEM_NOT_FOUND));

        cartItemMapper.patchRequestToEntity(cartItem, request);

        CartItem updated = cartItemRepository.save(cartItem);
        return cartItemMapper.entityToResponse(updated);
    }

    @Override
    public void removeCartItem(UUID cartItemId) {
        if (!cartItemRepository.existsById(cartItemId)) {
            throw new AppException(ErrorCode.CART_ITEM_NOT_FOUND);
        }
        cartItemRepository.deleteById(cartItemId);
    }

    @Override
    public void clearCart(UUID accountId) {
        List<CartItem> cartItems = cartItemRepository.findByCartId(accountId);
        cartItemRepository.deleteAll(cartItems);
    }

    @Override
    public void removeMultipleCartItems(List<UUID> cartItemIds) {
        if (cartItemIds == null || cartItemIds.isEmpty()) {
            throw new IllegalArgumentException("No cart item IDs provided");
        }
        List<CartItem> items = cartItemRepository.findAllById(cartItemIds);
        if (items.isEmpty()) {
            throw new AppException(ErrorCode.CART_ITEM_NOT_FOUND);
        }
        cartItemRepository.deleteAll(items);
    }

    @Override
    public List<CartItem> getValidCartItems(UUID accountId) {
        return List.of();
    }
}
