package org.camphub.be_camphub.controller;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.camphub.be_camphub.dto.response.ApiResponse;
import org.camphub.be_camphub.service.MediaService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/media")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class MediaController {
    MediaService mediaService;

    @GetMapping("/validate-hash")
    public ApiResponse<Boolean> checkImageHash(
            @RequestParam String hash,
            @RequestParam UUID itemId) {

        boolean isValid = mediaService.validateImageHash(hash, itemId);

        return ApiResponse.<Boolean>builder()
                .message("Image hash validation result")
                .result(isValid)
                .build();
    }
}
