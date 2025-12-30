package org.camphub.be_camphub.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.camphub.be_camphub.repository.MediaRepository;
import org.camphub.be_camphub.service.MediaService;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE, makeFinal = true)
public class MediaServiceImpl implements MediaService {
    MediaRepository mediaRepository;

    @Override
    public boolean validateImageHash(String fileHash) {
        if (fileHash == null || fileHash.trim().isEmpty()) {
            return true;
        }
        String cleanHash = fileHash.trim();

        int count = mediaRepository.checkHashGlobal(cleanHash);

        return count == 0;
    }
}
