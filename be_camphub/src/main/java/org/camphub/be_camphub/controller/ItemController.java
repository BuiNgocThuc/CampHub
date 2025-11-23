package org.camphub.be_camphub.controller;

import java.util.List;
import java.util.UUID;

import org.camphub.be_camphub.dto.request.Item.ItemCreationRequest;
import org.camphub.be_camphub.dto.request.Item.ItemPatchRequest;
import org.camphub.be_camphub.dto.request.Item.ItemUpdateRequest;
import org.camphub.be_camphub.dto.response.ApiResponse;
import org.camphub.be_camphub.dto.response.item.ItemResponse;
import org.camphub.be_camphub.service.ItemService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequestMapping("/items")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ItemController {
    ItemService itemService;

    @GetMapping("/my")
    ApiResponse<List<ItemResponse>> getMyItems(@AuthenticationPrincipal Jwt jwt) {
        UUID ownerId = UUID.fromString(jwt.getClaim("userId"));
        return ApiResponse.<List<ItemResponse>>builder()
                .message("Get my items successfully")
                .result(itemService.getItemsByOwnerId(ownerId))
                .build();
    }

    @PostMapping
    ApiResponse<ItemResponse> createItem(
            @RequestBody ItemCreationRequest request, @AuthenticationPrincipal Jwt jwt) {
        UUID ownerId = UUID.fromString(jwt.getClaim("userId"));
        return ApiResponse.<ItemResponse>builder()
                .message("Create item successfully")
                .result(itemService.createItem(ownerId, request))
                .build();
    }

    @GetMapping("/{id}")
    ApiResponse<ItemResponse> getItemById(@PathVariable UUID id) {
        return ApiResponse.<ItemResponse>builder()
                .message("Get item by id successfully")
                .result(itemService.getItemById(id))
                .build();
    }

    @GetMapping
    ApiResponse<List<ItemResponse>> getAllItems(
            @RequestParam(required = false) String status, @RequestParam(required = false) UUID categoryId) {
        return ApiResponse.<List<ItemResponse>>builder()
                .message("Get all items successfully")
                .result(itemService.getAllItems(status, categoryId))
                .build();
    }

    // Update item (owner)
    @PutMapping("/{id}")
    public ApiResponse<ItemResponse> updateItem(
            @PathVariable UUID id,
            @RequestBody ItemUpdateRequest request,
            @AuthenticationPrincipal Jwt jwt) {
        UUID ownerId = UUID.fromString(jwt.getClaim("userId"));
        return ApiResponse.<ItemResponse>builder()
                .message("Update item successfully")
                .result(itemService.updateItem(ownerId, id, request))
                .build();
    }

    // Patch item (owner)
    @PatchMapping("/{id}")
    public ApiResponse<ItemResponse> patchItem(
            @PathVariable UUID id,
            @RequestBody ItemPatchRequest request,
            @AuthenticationPrincipal Jwt jwt) {
        UUID ownerId = UUID.fromString(jwt.getClaim("userId"));
        return ApiResponse.<ItemResponse>builder()
                .message("Patch item successfully")
                .result(itemService.patchItem(ownerId, id, request))
                .build();
    }

    // Delete item (owner)
    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteItem(
            @PathVariable UUID id,
            @AuthenticationPrincipal Jwt jwt) {
        UUID ownerId = UUID.fromString(jwt.getClaim("userId"));
        itemService.deleteItem(ownerId, id);
        return ApiResponse.<Void>builder()
                .message("Delete item successfully")
                .build();
    }

    // Admin approve/reject item
    @PutMapping("/approve/{id}")
    public ApiResponse<ItemResponse> approveItem(
            @PathVariable UUID id,
            @RequestParam boolean isApproved,
            @AuthenticationPrincipal Jwt jwt) {
        UUID adminId = UUID.fromString(jwt.getClaim("userId"));
        return ApiResponse.<ItemResponse>builder()
                .message(isApproved ? "Item approved successfully" : "Item rejected successfully")
                .result(itemService.approveItem(adminId, id, isApproved))
                .build();
    }

    // Admin lock/unlock item
    @PutMapping("/lock/{id}")
    public ApiResponse<ItemResponse> lockItem(
            @PathVariable UUID id,
            @RequestParam boolean isLocked,
            @AuthenticationPrincipal Jwt jwt) {
        UUID adminId = UUID.fromString(jwt.getClaim("userId"));
        return ApiResponse.<ItemResponse>builder()
                .message(isLocked ? "Item locked successfully" : "Item unlocked successfully")
                .result(itemService.lockItem(adminId, id, isLocked))
                .build();
    }
}
