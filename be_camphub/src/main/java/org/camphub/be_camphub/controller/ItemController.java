package org.camphub.be_camphub.controller;

import java.util.List;
import java.util.UUID;

import org.camphub.be_camphub.dto.request.Item.ItemCreationRequest;
import org.camphub.be_camphub.dto.request.Item.ItemPatchRequest;
import org.camphub.be_camphub.dto.request.Item.ItemUpdateRequest;
import org.camphub.be_camphub.dto.response.ApiResponse;
import org.camphub.be_camphub.dto.response.item.ItemResponse;
import org.camphub.be_camphub.service.ItemService;
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

    @PostMapping
    ApiResponse<ItemResponse> createItem(
            @RequestBody ItemCreationRequest request, @RequestHeader("X-Account-Id") UUID ownerId) {
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

    // only update item details (not status) for owner
    @PutMapping("/{id}")
    ApiResponse<ItemResponse> updateItem(@PathVariable UUID id, @RequestBody ItemUpdateRequest request) {
        return ApiResponse.<ItemResponse>builder()
                .message("Update item successfully")
                .result(itemService.updateItem(id, request))
                .build();
    }

    @PatchMapping("/{id}")
    ApiResponse<ItemResponse> patchItemStatus(@PathVariable UUID id, @RequestBody ItemPatchRequest request) {
        return ApiResponse.<ItemResponse>builder()
                .message("Patch item status successfully")
                .result(itemService.patchItem(id, request))
                .build();
    }

    @DeleteMapping("/{id}")
    ApiResponse<Void> deleteItem(@PathVariable UUID id) {
        itemService.deleteItem(id);
        return ApiResponse.<Void>builder().message("Delete item successfully").build();
    }

    // for admin
    @PutMapping("/{id}/approve")
    ApiResponse<ItemResponse> approveItem(
            @PathVariable UUID id, @RequestParam boolean isApproved // approved or rejected
            ) {
        return ApiResponse.<ItemResponse>builder()
                .message(isApproved ? "Item approved successfully" : "Item rejected successfully")
                .result(itemService.approveItem(id, isApproved))
                .build();
    }

    @PutMapping("/{id}/lock")
    ApiResponse<ItemResponse> lockItem(@PathVariable UUID id, @RequestParam boolean isLocked // banned or available
            ) {
        return ApiResponse.<ItemResponse>builder()
                .message(isLocked ? "Item locked successfully" : "Item unlocked successfully")
                .result(itemService.lockItem(id, isLocked))
                .build();
    }
}
