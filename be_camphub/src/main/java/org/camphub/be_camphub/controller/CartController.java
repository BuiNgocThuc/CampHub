package org.camphub.be_camphub.controller;

import java.util.List;
import java.util.UUID;

import jakarta.validation.Valid;

import org.camphub.be_camphub.dto.request.cart.CartItemCreationRequest;
import org.camphub.be_camphub.dto.request.cart.CartItemDeleteRequest;
import org.camphub.be_camphub.dto.request.cart.CartItemPatchRequest;
import org.camphub.be_camphub.dto.request.cart.CartItemUpdateRequest;
import org.camphub.be_camphub.dto.response.ApiResponse;
import org.camphub.be_camphub.dto.response.cart.CartItemResponse;
import org.camphub.be_camphub.service.CartService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequestMapping("cart")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CartController {

    CartService cartService;

    @PostMapping("/items")
    public ApiResponse<CartItemResponse> addItemToCart(
            @RequestBody @Valid CartItemCreationRequest request, @AuthenticationPrincipal Jwt jwt) {
        UUID accountId = UUID.fromString(jwt.getClaim("userId"));
        CartItemResponse response = cartService.addItemToCart(accountId, request);
        return ApiResponse.<CartItemResponse>builder()
                .message("Add item to cart successfully")
                .result(response)
                .build();
    }

    @PutMapping("/items/{cartItemId}")
    public ApiResponse<CartItemResponse> updateCartItem(
            @PathVariable UUID cartItemId, @RequestBody @Valid CartItemUpdateRequest request) {
        CartItemResponse response = cartService.updateCartItem(cartItemId, request);
        return ApiResponse.<CartItemResponse>builder()
                .message("Update cart item successfully")
                .result(response)
                .build();
    }

    @PatchMapping("/items/{cartItemId}")
    public ApiResponse<CartItemResponse> patchCartItem(
            @PathVariable UUID cartItemId, @RequestBody @Valid CartItemPatchRequest request) {
        CartItemResponse response = cartService.patchCartItem(cartItemId, request);
        return ApiResponse.<CartItemResponse>builder()
                .message("Patch cart item successfully")
                .result(response)
                .build();
    }

    @DeleteMapping("/items")
    public ApiResponse<Void> removeMultipleCartItems(@RequestBody CartItemDeleteRequest request) {
        cartService.removeMultipleCartItems(request.getCartItemIds());
        return ApiResponse.<Void>builder()
                .message("Remove multiple cart items successfully")
                .build();
    }

    @DeleteMapping("/items/{cartItemId}")
    public ApiResponse<Void> removeCartItem(@PathVariable UUID cartItemId) {
        cartService.removeCartItem(cartItemId);
        return ApiResponse.<Void>builder()
                .message("Remove cart item successfully")
                .build();
    }

    @DeleteMapping("/clear")
    public ApiResponse<Void> clearCart(@AuthenticationPrincipal Jwt jwt) {
        UUID accountId = UUID.fromString(jwt.getClaim("userId"));
        cartService.clearCart(accountId);
        return ApiResponse.<Void>builder().message("Clear cart successfully").build();
    }

    @GetMapping("/items")
    public ApiResponse<List<CartItemResponse>> getCartItems(@AuthenticationPrincipal Jwt jwt) {
        UUID accountId = UUID.fromString(jwt.getClaim("userId"));
        return ApiResponse.<List<CartItemResponse>>builder()
                .message("Get cart items successfully")
                .result(cartService.getValidCartItems(accountId))
                .build();
    }

    @GetMapping("/items/count")
    public ApiResponse<Integer> getCartItemCount(@AuthenticationPrincipal Jwt jwt) {
        UUID accountId = UUID.fromString(jwt.getClaim("userId"));
        Integer count = cartService.getCartItemCount(accountId);
        return ApiResponse.<Integer>builder()
                .message("Get cart item count successfully")
                .result(count)
                .build();
    }

    @GetMapping("/items/{cartItemId}/validate-quantity")
    public ApiResponse<Boolean> validateQuantity(@PathVariable UUID cartItemId, @RequestParam Integer quantity) {
        boolean isValid = cartService.validateQuantity(cartItemId, quantity);
        return ApiResponse.<Boolean>builder()
                .message(isValid ? "Quantity is valid" : "Insufficient item quantity")
                .result(isValid)
                .build();
    }
}
