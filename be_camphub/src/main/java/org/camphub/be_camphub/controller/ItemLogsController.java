package org.camphub.be_camphub.controller;

import java.util.List;
import java.util.UUID;

import org.camphub.be_camphub.dto.response.ApiResponse;
import org.camphub.be_camphub.dto.response.item.ItemLogsResponse;
import org.camphub.be_camphub.service.ItemLogsService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequestMapping("/item_logs")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ItemLogsController {
    ItemLogsService itemLogsService;

    @GetMapping
    public ApiResponse<List<ItemLogsResponse>> getAllLogs() {
        return ApiResponse.<List<ItemLogsResponse>>builder()
                .message("Get all item logs successfully")
                .result(itemLogsService.getAllLogs())
                .build();
    }

    @GetMapping("/item/{itemId}")
    public ApiResponse<List<ItemLogsResponse>> getLogsByItemId(@PathVariable UUID itemId) {
        return ApiResponse.<List<ItemLogsResponse>>builder()
                .message("Get item logs by item id successfully")
                .result(itemLogsService.getLogsByItemId(itemId))
                .build();
    }

    @GetMapping("/account/{accountId}")
    public ApiResponse<List<ItemLogsResponse>> getLogsByAccountId(@PathVariable UUID accountId) {
        return ApiResponse.<List<ItemLogsResponse>>builder()
                .message("Get item logs by account id successfully")
                .result(itemLogsService.getLogsByAccountId(accountId))
                .build();
    }
}
