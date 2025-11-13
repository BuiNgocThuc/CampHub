package org.camphub.be_camphub.service.impl;

import java.util.List;
import java.util.UUID;

import org.camphub.be_camphub.dto.response.item.ItemLogsResponse;
import org.camphub.be_camphub.entity.ItemLog;
import org.camphub.be_camphub.mapper.ItemLogMapper;
import org.camphub.be_camphub.repository.AccountRepository;
import org.camphub.be_camphub.repository.ItemLogsRepository;
import org.camphub.be_camphub.service.ItemLogsService;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE, makeFinal = true)
public class ItemLogsServiceImpl implements ItemLogsService {
    ItemLogsRepository itemLogsRepository;
    ItemLogMapper itemLogMapper;
    AccountRepository accountRepository;

    @Override
    public List<ItemLogsResponse> getAllLogs() {
        List<ItemLog> logs = itemLogsRepository.findAllByOrderByCreatedAtDesc();
        return enrichLogs(logs);
    }

    @Override
    public List<ItemLogsResponse> getLogsByItemId(UUID itemId) {
        List<ItemLog> itemLogs = itemLogsRepository.findAllByItemIdOrderByCreatedAtDesc(itemId);
        return enrichLogs(itemLogs);
    }

    @Override
    public List<ItemLogsResponse> getLogsByAccountId(UUID accountId) {
        List<ItemLog> logs = itemLogsRepository.findAllByAccountIdOrderByCreatedAtDesc(accountId);
        return enrichLogs(logs);
    }

    private List<ItemLogsResponse> enrichLogs(List<ItemLog> logs) {
        return logs.stream()
                .map(log -> {
                    ItemLogsResponse response = itemLogMapper.entityToResponse(log);
                    String accountName = accountRepository
                            .findById(log.getAccountId())
                            .map(a -> a.getFirstname() + " " + a.getLastname())
                            .orElse("Unknown");
                    response.setAccount(accountName);
                    return response;
                })
                .toList();
    }
}
