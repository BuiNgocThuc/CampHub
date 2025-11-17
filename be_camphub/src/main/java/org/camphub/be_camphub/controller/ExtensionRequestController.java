package org.camphub.be_camphub.controller;

import java.util.UUID;

import org.camphub.be_camphub.dto.request.extension_req.ExtensionReqCreationRequest;
import org.camphub.be_camphub.dto.request.extension_req.ExtensionResponseRequest;
import org.camphub.be_camphub.dto.response.ApiResponse;
import org.camphub.be_camphub.dto.response.extension_req.ExtensionReqResponse;
import org.camphub.be_camphub.service.ExtensionRequestService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequestMapping("/extension-requests")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ExtensionRequestController {
    ExtensionRequestService service;

    @PostMapping
    ApiResponse<ExtensionReqResponse> createExtensionRequest(
            @RequestBody ExtensionReqCreationRequest request, @AuthenticationPrincipal Jwt jwt) {
        UUID lesseeId = UUID.fromString(jwt.getClaim("userId"));
        return ApiResponse.<ExtensionReqResponse>builder()
                .message("Create extension request successfully")
                .result(service.createExtensionRequest(lesseeId, request))
                .build();
    }

    @PostMapping("/approve")
    ApiResponse<ExtensionReqResponse> approveExtensionRequest(
            @RequestBody ExtensionResponseRequest request, @AuthenticationPrincipal Jwt jwt) {
        UUID lessorId = UUID.fromString(jwt.getClaim("userId"));
        return ApiResponse.<ExtensionReqResponse>builder()
                .message("Approve extension request successfully")
                .result(service.approveExtensionRequest(lessorId, request))
                .build();
    }

    @PostMapping("/reject")
    ApiResponse<ExtensionReqResponse> rejectExtensionRequest(
            @RequestBody ExtensionResponseRequest request, @AuthenticationPrincipal Jwt jwt) {
        UUID lessorId = UUID.fromString(jwt.getClaim("userId"));
        return ApiResponse.<ExtensionReqResponse>builder()
                .message("Reject extension request successfully")
                .result(service.rejectExtensionRequest(lessorId, request))
                .build();
    }

    @PostMapping("/{requestId}/cancel")
    ApiResponse<ExtensionReqResponse> cancelExtensionRequest(
            @PathVariable UUID requestId, @AuthenticationPrincipal Jwt jwt) {
        UUID lesseeId = UUID.fromString(jwt.getClaim("userId"));
        return ApiResponse.<ExtensionReqResponse>builder()
                .message("Cancel extension request successfully")
                .result(service.cancelExtensionRequest(lesseeId, requestId))
                .build();
    }
}
