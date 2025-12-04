package org.camphub.be_camphub.service.impl;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.camphub.be_camphub.dto.request.Item.ItemCreationRequest;
import org.camphub.be_camphub.dto.request.Item.ItemPatchRequest;
import org.camphub.be_camphub.dto.request.Item.ItemUpdateRequest;
import org.camphub.be_camphub.dto.request.notification.NotificationCreationRequest;
import org.camphub.be_camphub.dto.response.item.ItemResponse;
import org.camphub.be_camphub.entity.*;
import org.camphub.be_camphub.enums.ItemActionType;
import org.camphub.be_camphub.enums.ItemStatus;
import org.camphub.be_camphub.enums.NotificationType;
import org.camphub.be_camphub.enums.ReferenceType;
import org.camphub.be_camphub.exception.AppException;
import org.camphub.be_camphub.exception.ErrorCode;
import org.camphub.be_camphub.mapper.ItemMapper;
import org.camphub.be_camphub.repository.*;
import org.camphub.be_camphub.service.ItemService;
import org.camphub.be_camphub.service.NotificationService;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE, makeFinal = true)
public class ItemServiceImpl implements ItemService {
    ItemRepository itemRepository;
    ItemLogsRepository itemLogsRepository;
    AccountRepository accountRepository;
    CategoryRepository categoryRepository;

    ItemMapper itemMapper;
    NotificationService notificationService;

    @Override
    public ItemResponse createItem(UUID ownerId, ItemCreationRequest request) {
        if (!categoryRepository.existsById(request.getCategoryId())) {
            throw new AppException(ErrorCode.CATEGORY_NOT_FOUND);
        }

        Item item = itemMapper.creationRequestToEntity(request, ownerId);
        item.setStatus(ItemStatus.PENDING_APPROVAL);
        item.setCreatedAt(LocalDateTime.now());
        item.setUpdatedAt(LocalDateTime.now());
        item = itemRepository.save(item);

        logAction(
                item.getId(),
                ownerId,
                ItemActionType.CREATE,
                null,
                item.getStatus(),
                "Owner created a new item awaiting approval",
                item.getMediaUrls() != null ? new ArrayList<>(item.getMediaUrls()) : List.of());

        // thông báo cho admin có item mới chờ duyệt
        String itemName = item.getName();
        UUID referenceId = item.getId();
        accountRepository
                .findSystemWallet()
                .ifPresent(system -> notificationService.create(NotificationCreationRequest.builder()
                        .receiverId(system.getId())
                        .senderId(ownerId)
                        .type(NotificationType.BOOKING_CREATED)
                        .title("Sản phẩm mới chờ duyệt")
                        .content("Có sản phẩm \"" + itemName + "\" chờ duyệt.")
                        .referenceType(ReferenceType.ITEM)
                        .referenceId(referenceId)
                        .build()));

        return itemMapper.entityToResponse(item);
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

    // ----------------- UPDATE -----------------
    @Override
    public ItemResponse updateItem(UUID ownerId, UUID itemId, ItemUpdateRequest request) {
        Item item = getOwnedItem(itemId, ownerId);

        ItemStatus prevStatus = item.getStatus();
        itemMapper.updateRequestToEntity(item, request);

        item.setStatus(ItemStatus.PENDING_APPROVAL);
        item.setUpdatedAt(LocalDateTime.now());
        item = itemRepository.save(item);

        logAction(
                itemId,
                ownerId,
                ItemActionType.UPDATE,
                prevStatus,
                item.getStatus(),
                "Owner updated item details",
                item.getMediaUrls() != null ? new ArrayList<>(item.getMediaUrls()) : List.of());

        return itemMapper.entityToResponse(item);
    }

    // ----------------- PATCH -----------------
    @Override
    public ItemResponse patchItem(UUID ownerId, UUID itemId, ItemPatchRequest request) {
        Item item = getOwnedItem(itemId, ownerId);

        ItemStatus prevStatus = item.getStatus();
        itemMapper.patchRequestToEntity(item, request);

        item.setStatus(ItemStatus.PENDING_APPROVAL);
        item.setUpdatedAt(LocalDateTime.now());
        item = itemRepository.save(item);

        logAction(
                itemId,
                ownerId,
                ItemActionType.UPDATE,
                prevStatus,
                item.getStatus(),
                "Owner patched item details",
                item.getMediaUrls() != null ? new ArrayList<>(item.getMediaUrls()) : List.of());

        return itemMapper.entityToResponse(item);
    }

    @Override
    public void deleteItem(UUID ownerId, UUID itemId) {
        Item item = getOwnedItem(itemId, ownerId);

        if (item.getStatus() == ItemStatus.RENTED) {
            throw new AppException(ErrorCode.ITEM_CANNOT_DELETE);
        }

        ItemStatus prevStatus = item.getStatus();
        item.setStatus(ItemStatus.DELETED);
        item.setUpdatedAt(LocalDateTime.now());
        itemRepository.save(item);

        logAction(
                itemId,
                ownerId,
                ItemActionType.DELETE,
                prevStatus,
                ItemStatus.DELETED,
                "Owner marked item as deleted",
                List.of());
    }

    // ----------------- ADMIN APPROVE -----------------
    @Override
    public ItemResponse approveItem(UUID adminId, UUID itemId, boolean approved) {
        Item item = getItemOrThrow(itemId);

        ItemStatus prevStatus = item.getStatus();
        item.setStatus(approved ? ItemStatus.AVAILABLE : ItemStatus.REJECTED);
        item.setUpdatedAt(LocalDateTime.now());
        itemRepository.save(item);

        logAction(
                itemId,
                adminId,
                approved ? ItemActionType.APPROVE : ItemActionType.REJECT,
                prevStatus,
                item.getStatus(),
                approved ? "Admin approved item" : "Admin rejected item",
                item.getMediaUrls() != null ? new ArrayList<>(item.getMediaUrls()) : List.of());

        return itemMapper.entityToResponse(item);
    }

    // ----------------- ADMIN LOCK / UNLOCK -----------------
    @Override
    public ItemResponse lockItem(UUID adminId, UUID itemId, boolean locked) {
        Item item = getItemOrThrow(itemId);

        ItemStatus prevStatus = item.getStatus();
        item.setStatus(locked ? ItemStatus.BANNED : ItemStatus.AVAILABLE);
        item.setUpdatedAt(LocalDateTime.now());
        itemRepository.save(item);

        logAction(
                itemId,
                adminId,
                locked ? ItemActionType.LOCK : ItemActionType.UNLOCK,
                prevStatus,
                item.getStatus(),
                locked ? "Admin locked item" : "Admin unlocked item",
                item.getMediaUrls() != null ? new ArrayList<>(item.getMediaUrls()) : List.of());

        return itemMapper.entityToResponse(item);
    }

    @Override
    public List<ItemResponse> getItemsByOwnerId(UUID ownerId) {
        List<Item> items = itemRepository.findAllByOwnerId(ownerId);
        if (items.isEmpty()) return List.of();

        // 1. Lấy tên owner 1 lần (vì tất cả item cùng owner)
        String ownerName = accountRepository
                .findById(ownerId)
                .map(acc -> acc.getFirstname() + " " + acc.getLastname())
                .orElse("Người dùng đã xóa");

        // 2. Batch lấy tên tất cả category (chỉ 1 query)
        Set<UUID> categoryIds =
                items.stream().map(Item::getCategoryId).filter(Objects::nonNull).collect(Collectors.toSet());

        Map<UUID, String> categoryNameMap = categoryRepository.findAllById(categoryIds).stream()
                .collect(Collectors.toMap(Category::getId, Category::getName));

        // 3. Enrich nhanh như chớp
        return items.stream()
                .map(item -> {
                    ItemResponse resp = itemMapper.entityToResponse(item);
                    resp.setOwnerName(ownerName); // 1 lần duy nhất
                    resp.setCategoryName(categoryNameMap.getOrDefault(item.getCategoryId(), "Danh mục đã xóa"));
                    return resp;
                })
                .toList();
    }

    // ====== Private method ======
    private ItemResponse enrichItemResponse(Item item) {
        ItemResponse response = itemMapper.entityToResponse(item);

        Account owner = accountRepository
                .findById(item.getOwnerId())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        String categoryName = categoryRepository
                .findById(item.getCategoryId())
                .map(Category::getName)
                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));

        response.setOwnerName(owner.getFirstname() + " " + owner.getLastname());
        response.setOwnerAvatar(owner.getAvatar());
        response.setOwnerTrustScore(String.valueOf(owner.getTrustScore()));
        response.setCategoryName(categoryName);

        return response;
    }

    // save item_logs
    private void logAction(
            UUID itemId,
            UUID actorId,
            ItemActionType action,
            ItemStatus prevStatus,
            ItemStatus newStatus,
            String note,
            List<MediaResource> mediaResources) {
        ItemLog logEntry = ItemLog.builder()
                .itemId(itemId)
                .accountId(actorId)
                .action(action)
                .previousStatus(prevStatus)
                .currentStatus(newStatus)
                .note(note)
                .evidenceUrls(mediaResources != null ? mediaResources : List.of())
                .createdAt(LocalDateTime.now())
                .build();
        itemLogsRepository.save(logEntry);
    }

    // ----------------- UTILS -----------------
    private Item getItemOrThrow(UUID itemId) {
        return itemRepository.findById(itemId).orElseThrow(() -> new AppException(ErrorCode.ITEM_NOT_FOUND));
    }

    private Item getOwnedItem(UUID itemId, UUID ownerId) {
        Item item = getItemOrThrow(itemId);
        if (!item.getOwnerId().equals(ownerId)) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }
        return item;
    }
}
