package org.camphub.be_camphub.service;

import java.util.List;
import java.util.UUID;

import org.camphub.be_camphub.dto.response.item.ItemLogsResponse;

public interface ItemLogsService {
    List<ItemLogsResponse> getAllLogs();

    List<ItemLogsResponse> getLogsByItemId(UUID itemId);

    List<ItemLogsResponse> getLogsByAccountId(UUID accountId);
}
