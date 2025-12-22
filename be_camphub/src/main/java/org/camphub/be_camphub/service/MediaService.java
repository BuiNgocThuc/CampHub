package org.camphub.be_camphub.service;

import java.util.UUID;

public interface MediaService {
    boolean validateImageHash(String fileHash, UUID itemId);
}
