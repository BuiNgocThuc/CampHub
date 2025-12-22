package org.camphub.be_camphub.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.camphub.be_camphub.repository.MediaRepository;
import org.camphub.be_camphub.service.MediaService;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE, makeFinal = true)
public class MediaServiceImpl implements MediaService {
    MediaRepository mediaRepository;

    @Override
    public boolean validateImageHash(String fileHash, UUID itemId) {
        if (fileHash == null || fileHash.trim().isEmpty() || itemId == null) {
            return true;
        }

        boolean isDuplicate = mediaRepository.existsByFileHashAndItemId(fileHash, itemId);

        return !isDuplicate;
    }
}
