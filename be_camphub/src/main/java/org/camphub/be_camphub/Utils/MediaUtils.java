package org.camphub.be_camphub.Utils;

import org.camphub.be_camphub.enums.MediaType;
import org.springframework.stereotype.Component;

@Component
public class MediaUtils {
    public MediaType detectMediaType(String url) {
        if (url == null) return MediaType.IMAGE;
        String lower = url.toLowerCase();
        if (lower.endsWith(".mp4") || lower.endsWith(".mov") || lower.endsWith(".avi")) {
            return MediaType.VIDEO;
        }
        return MediaType.IMAGE;
    }
}
