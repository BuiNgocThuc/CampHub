package org.camphub.be_camphub.service.impl;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.camphub.be_camphub.dto.request.cart.CartItemCreationRequest;
import org.camphub.be_camphub.dto.request.cart.CartItemPatchRequest;
import org.camphub.be_camphub.dto.request.cart.CartItemUpdateRequest;
import org.camphub.be_camphub.dto.response.cart.CartItemResponse;
import org.camphub.be_camphub.entity.Cart;
import org.camphub.be_camphub.entity.CartItem;
import org.camphub.be_camphub.entity.Item;
import org.camphub.be_camphub.exception.AppException;
import org.camphub.be_camphub.exception.ErrorCode;
import org.camphub.be_camphub.mapper.CartItemMapper;
import org.camphub.be_camphub.repository.CartItemRepository;
import org.camphub.be_camphub.repository.CartRepository;
import org.camphub.be_camphub.repository.ItemRepository;
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
    ItemRepository itemRepository;

    @Override
    public CartItemResponse addItemToCart(UUID accountId, CartItemCreationRequest request) {
        // find cart id
        Cart cart = cartRepository.findByAccountId(accountId).orElseGet(() -> {
            Cart newCart = Cart.builder()
                    .accountId(accountId)
                    .createdAt(LocalDateTime.now())
                    .build();
            return cartRepository.save(newCart);
        });

        // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
        CartItem existingCartItem = cartItemRepository.findByCartIdAndItemId(cart.getId(), request.getItemId());

        CartItem cartItem;
        if (existingCartItem != null) {
            // Nếu đã có, tăng số lượng lên 1
            existingCartItem.setQuantity(existingCartItem.getQuantity() + 1);
            cartItem = existingCartItem;
        } else {
            // Nếu chưa có, tạo mới với quantity từ request (mặc định 1 nếu null)
            Integer quantity = request.getQuantity() != null ? request.getQuantity() : 1;
            CartItemCreationRequest requestWithQuantity = CartItemCreationRequest.builder()
                    .itemId(request.getItemId())
                    .quantity(quantity)
                    .rentalDays(request.getRentalDays())
                    .price(request.getPrice())
                    .build();
            cartItem = cartItemMapper.creationRequestToEntity(requestWithQuantity, cart.getId());
        }

        // Kiểm tra số lượng có vượt quá số lượng sản phẩm không
        validateQuantityInternal(cartItem.getItemId(), cartItem.getQuantity());

        // Tính lại subtotal sau khi cập nhật quantity
        if (existingCartItem != null) {
            cartItem.setSubtotal(cartItem.getPrice()
                    .multiply(BigDecimal.valueOf(cartItem.getQuantity()))
                    .multiply(BigDecimal.valueOf(cartItem.getRentalDays())));
        }

        return enrichCartItemResponse(cartItemRepository.save(cartItem));
    }

    @Override
    public CartItemResponse updateCartItem(UUID cartItemId, CartItemUpdateRequest request) {
        CartItem cartItem = cartItemRepository
                .findById(cartItemId)
                .orElseThrow(() -> new AppException(ErrorCode.CART_ITEM_NOT_FOUND));

        cartItemMapper.updateRequestToEntity(cartItem, request);

        // Kiểm tra số lượng có vượt quá số lượng sản phẩm không
        validateQuantityInternal(cartItem.getItemId(), cartItem.getQuantity());

        CartItem updated = cartItemRepository.save(cartItem);
        return enrichCartItemResponse(updated);
    }

    @Override
    public CartItemResponse patchCartItem(UUID cartItemId, CartItemPatchRequest request) {
        CartItem cartItem = cartItemRepository
                .findById(cartItemId)
                .orElseThrow(() -> new AppException(ErrorCode.CART_ITEM_NOT_FOUND));

        cartItemMapper.patchRequestToEntity(cartItem, request);

        // Kiểm tra số lượng có vượt quá số lượng sản phẩm không
        validateQuantityInternal(cartItem.getItemId(), cartItem.getQuantity());

        CartItem updated = cartItemRepository.save(cartItem);
        return enrichCartItemResponse(updated);
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
    public List<CartItemResponse> getValidCartItems(UUID accountId) {
        Cart cart =
                cartRepository.findByAccountId(accountId).orElseThrow(() -> new AppException(ErrorCode.CART_NOT_FOUND));

        List<CartItem> cartItems = cartItemRepository.findByCartId(cart.getId());
        return cartItems.stream().map(this::enrichCartItemResponse).toList();
    }

    @Override
    public Integer getCartItemCount(UUID accountId) {
        Cart cart =
                cartRepository.findByAccountId(accountId).orElseThrow(() -> new AppException(ErrorCode.CART_NOT_FOUND));

        return cartItemRepository.countByCartId(cart.getId());
    }

    @Override
    public boolean validateQuantity(UUID cartItemId, Integer quantity) {
        CartItem cartItem = cartItemRepository
                .findById(cartItemId)
                .orElseThrow(() -> new AppException(ErrorCode.CART_ITEM_NOT_FOUND));

        try {
            validateQuantityInternal(cartItem.getItemId(), quantity);
            return true;
        } catch (AppException e) {
            if (e.getErrorCode() == ErrorCode.INSUFFICIENT_ITEM_QUANTITY) {
                return false;
            }
            throw e;
        }
    }

    /**
     * Kiểm tra số lượng sản phẩm có đủ không
     *
     * @param itemId       ID của sản phẩm
     * @param cartQuantity Số lượng muốn thêm vào giỏ hàng
     * @throws AppException nếu số lượng không đủ
     */
    private void validateQuantityInternal(UUID itemId, Integer cartQuantity) {
        Item item = itemRepository.findById(itemId).orElseThrow(() -> new AppException(ErrorCode.ITEM_NOT_FOUND));

        Integer itemQuantity = item.getQuantity();

        if (itemQuantity == null || itemQuantity < cartQuantity) {
            throw new AppException(ErrorCode.INSUFFICIENT_ITEM_QUANTITY);
        }
    }

    private CartItemResponse enrichCartItemResponse(CartItem cartItem) {
        CartItemResponse response = cartItemMapper.entityToResponse(cartItem);
        // Load Item
        Item item = itemRepository
                .findById(cartItem.getItemId())
                .orElseThrow(() -> new AppException(ErrorCode.ITEM_NOT_FOUND));
        Integer itemQuantity = item.getQuantity();
        int cartQuantity = cartItem.getQuantity();

        boolean isAvailable = itemQuantity != null && itemQuantity >= cartQuantity;
        String itemName = item.getName();
        String itemImage = item.getMediaUrls().isEmpty()
                ? null
                : item.getMediaUrls().get(0).getUrl();
        Double depositAmount = item.getDepositAmount();

        response.setIsAvailable(isAvailable);
        response.setItemName(itemName);
        response.setItemImage(itemImage);
        response.setDepositAmount(depositAmount != null ? BigDecimal.valueOf(depositAmount) : BigDecimal.ZERO);
        return response;
    }
}
