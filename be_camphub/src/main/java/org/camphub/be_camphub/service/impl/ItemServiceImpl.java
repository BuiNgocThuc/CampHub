package org.camphub.be_camphub.service.impl;

import java.util.List;
import java.util.UUID;
import java.util.stream.Stream;

import org.camphub.be_camphub.dto.request.Item.ItemCreationRequest;
import org.camphub.be_camphub.dto.request.Item.ItemPatchRequest;
import org.camphub.be_camphub.dto.request.Item.ItemUpdateRequest;
import org.camphub.be_camphub.dto.response.item.ItemResponse;
import org.camphub.be_camphub.entity.Category;
import org.camphub.be_camphub.entity.Item;
import org.camphub.be_camphub.entity.ItemImage;
import org.camphub.be_camphub.entity.ItemLog;
import org.camphub.be_camphub.enums.ItemActionType;
import org.camphub.be_camphub.enums.ItemStatus;
import org.camphub.be_camphub.exception.AppException;
import org.camphub.be_camphub.exception.ErrorCode;
import org.camphub.be_camphub.mapper.ItemMapper;
import org.camphub.be_camphub.repository.*;
import org.camphub.be_camphub.service.ItemService;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE, makeFinal = true)
public class ItemServiceImpl implements ItemService {
    ItemRepository itemRepository;
    ItemImagesRepository itemImagesRepository;
    ItemLogsRepository itemLogsRepository;
    AccountRepository accountRepository;
    CategoryRepository categoryRepository;

    ItemMapper itemMapper;

    @Override
    public ItemResponse createItem(UUID ownerId, ItemCreationRequest request) {
        if (categoryRepository.existsById(request.getCategoryId())) {
            throw new AppException(ErrorCode.CATEGORY_NOT_FOUND);
        }

        Item item = itemMapper.creationRequestToEntity(request, ownerId);
        item.setStatus(ItemStatus.PENDING_APPROVAL);
        item = itemRepository.save(item);

        saveItemImages(item, request.getImageUrls());
        logAction(item.getId(), ownerId, ItemActionType.CREATE, null, item.getStatus(), "Owner created new item");
        return enrichItemResponse(item);
    }

    @Override
    public ItemResponse getItemById(UUID itemId) {
        Item item = itemRepository.findById(itemId).orElseThrow(() -> new AppException(ErrorCode.ITEM_NOT_FOUND));
        return enrichItemResponse(item);
    }

    @Override
    public List<ItemResponse> getAllItems(String status, UUID categoryId) {
        List<Item> items = itemRepository.findAll();

        Stream<Item> stream = items.stream();

        if (status != null) {
            stream = stream.filter(i -> i.getStatus().name().equalsIgnoreCase(status));
        }

        if (categoryId != null) {
            stream = stream.filter(i -> i.getCategoryId().equals(categoryId));
        }

        return stream.map(this::enrichItemResponse).toList();
    }

    @Override
    public ItemResponse updateItem(UUID itemId, ItemUpdateRequest request) {
        Item item = getItem(itemId);
        ItemStatus prevStatus = item.getStatus();
        if (prevStatus == ItemStatus.BANNED) {
            throw new AppException(ErrorCode.ITEM_BANNED_CANNOT_UPDATE);
        }
        itemMapper.updateRequestToEntity(item, request);
        item.setStatus(ItemStatus.PENDING_APPROVAL); // set lại trạng thái chờ duyệt khi có thay đổi
        item = itemRepository.save(item);

        updateItemImages(item, request.getImageUrls());
        logAction(
                item.getId(),
                item.getOwnerId(),
                ItemActionType.UPDATE,
                prevStatus,
                item.getStatus(),
                "Owner updated item details");
        return enrichItemResponse(item);
    }

    @Override
    public ItemResponse patchItem(UUID itemId, ItemPatchRequest request) {
        Item item = getItem(itemId);
        ItemStatus prevStatus = item.getStatus();
        if (prevStatus == ItemStatus.BANNED) {
            throw new AppException(ErrorCode.ITEM_BANNED_CANNOT_UPDATE);
        }
        itemMapper.patchRequestToEntity(item, request);
        item.setStatus(ItemStatus.PENDING_APPROVAL); // set lại trạng thái chờ duyệt khi có thay đổi
        item = itemRepository.save(item);

        if (request.getImageUrls() != null) {
            updateItemImages(item, request.getImageUrls());
        }

        logAction(
                item.getId(),
                item.getOwnerId(),
                ItemActionType.UPDATE,
                prevStatus,
                item.getStatus(),
                "Owner patched item details");

        return enrichItemResponse(item);
    }

    @Override
    public void deleteItem(UUID itemId) {
        Item item = getItem(itemId);
        ItemStatus prevStatus = item.getStatus();
        if (prevStatus != ItemStatus.AVAILABLE) {
            throw new AppException(ErrorCode.ITEM_CANNOT_DELETE);
        }
        item.setStatus(ItemStatus.DELETED);
        itemRepository.save(item);

        logAction(
                item.getId(),
                item.getOwnerId(),
                ItemActionType.DELETE,
                prevStatus,
                item.getStatus(),
                "Owner deleted the item");
    }

    @Override
    public ItemResponse approveItem(UUID itemId, boolean isApproved) {
        Item item = getItem(itemId);
        item.setStatus(isApproved ? ItemStatus.AVAILABLE : ItemStatus.REJECTED);
        item = itemRepository.save(item);
        logAction(
                item.getId(),
                null,
                isApproved ? ItemActionType.APPROVE : ItemActionType.REJECT,
                ItemStatus.PENDING_APPROVAL,
                item.getStatus(),
                isApproved ? "Admin approved the item" : "Admin rejected the item");
        return enrichItemResponse(item);
    }

    @Override
    public ItemResponse lockItem(UUID itemId, boolean isLocked) {
        Item item = getItem(itemId);
        // admin only ban  available item
        item.setStatus(isLocked ? ItemStatus.BANNED : ItemStatus.AVAILABLE);
        item = itemRepository.save(item);
        logAction(
                item.getId(),
                null,
                isLocked ? ItemActionType.LOCK : ItemActionType.UNLOCK,
                !isLocked
                        ? ItemStatus.BANNED
                        : ItemStatus.AVAILABLE, // previous status must be opposite of current status
                isLocked ? ItemStatus.BANNED : ItemStatus.AVAILABLE,
                isLocked ? "Admin banned the item" : "Admin unbanned the item");
        return enrichItemResponse(item);
    }

    //        ====== Private method ======
    private Item getItem(UUID itemId) {
        return itemRepository.findById(itemId).orElseThrow(() -> new AppException(ErrorCode.ITEM_NOT_FOUND));
    }

    private void saveItemImages(Item item, List<String> urls) {
        if (urls == null || urls.isEmpty()) return;
        List<ItemImage> images = urls.stream()
                .map(url ->
                        ItemImage.builder().itemId(item.getId()).imageUrl(url).build())
                .toList();

        itemImagesRepository.saveAll(images);
    }

    private void updateItemImages(Item item, List<String> urls) {
        itemImagesRepository.deleteAllByItemId(item.getId());
        saveItemImages(item, urls);
    }

    private ItemResponse enrichItemResponse(Item item) {
        ItemResponse response = itemMapper.entityToResponse(item);

        response.setOwnerName(accountRepository
                .findById(item.getOwnerId())
                .map(acc -> acc.getFirstname() + " " + acc.getLastname())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND)));

        response.setCategoryName(categoryRepository
                .findById(item.getCategoryId())
                .map(Category::getName)
                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND)));

        response.setImageUrls(itemImagesRepository.findAllByItemId(item.getId()).stream()
                .map(ItemImage::getImageUrl)
                .toList());

        return response;
    }

    // save item_logs
    private void logAction(
            UUID itemId,
            UUID accountId,
            ItemActionType action,
            ItemStatus previousStatus,
            ItemStatus currentStatus,
            String note) {
        itemLogsRepository.save(ItemLog.builder()
                .itemId(itemId)
                .accountId(accountId)
                .action(action)
                .previousStatus(previousStatus)
                .currentStatus(currentStatus)
                .note(note)
                .build());
    }
}
