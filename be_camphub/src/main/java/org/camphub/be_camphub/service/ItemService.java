package org.camphub.be_camphub.service;

import java.util.List;
import java.util.UUID;

import org.camphub.be_camphub.dto.request.Item.ItemCreationRequest;
import org.camphub.be_camphub.dto.request.Item.ItemPatchRequest;
import org.camphub.be_camphub.dto.request.Item.ItemUpdateRequest;
import org.camphub.be_camphub.dto.response.item.ItemResponse;

public interface ItemService {
    ItemResponse createItem(UUID ownerId, ItemCreationRequest request);

    ItemResponse getItemById(UUID itemId);

    List<ItemResponse> getAllItems(String status, UUID categoryId);

    ItemResponse updateItem(UUID ownerId, UUID itemId, ItemUpdateRequest request);

    ItemResponse patchItem(UUID ownerId, UUID itemId, ItemPatchRequest request);

    void deleteItem(UUID ownerId, UUID itemId);

    ItemResponse approveItem(UUID adminId, UUID itemId, boolean approved);

    ItemResponse lockItem(UUID adminId, UUID itemId, boolean locked);
}
