package org.camphub.be_camphub.controller;

import java.util.List;
import java.util.UUID;

import jakarta.validation.Valid;

import org.camphub.be_camphub.dto.request.dispute.AdminReviewDisputeRequest;
import org.camphub.be_camphub.dto.request.dispute.DisputeCreationRequest;
import org.camphub.be_camphub.dto.response.ApiResponse;
import org.camphub.be_camphub.dto.response.dispute.DisputeResponse;
import org.camphub.be_camphub.service.DisputeService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequestMapping("/disputes")
@RequiredArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE, makeFinal = true)
public class DisputeController {
    DisputeService disputeService;

    @PostMapping("/create")
    public ApiResponse<DisputeResponse> createDispute(
            @AuthenticationPrincipal Jwt jwt, @RequestBody @Valid DisputeCreationRequest request) {
        UUID lessorId = UUID.fromString(jwt.getClaim("userId"));
        return ApiResponse.<DisputeResponse>builder()
                .message("Dispute created successfully")
                .result(disputeService.createDispute(lessorId, request))
                .build();
    }

    @PostMapping("/admin-review")
    public ApiResponse<DisputeResponse> adminReviewDispute(
            @AuthenticationPrincipal Jwt jwt, @RequestBody @Valid AdminReviewDisputeRequest request) {
        UUID adminId = UUID.fromString(jwt.getClaim("userId"));
        return ApiResponse.<DisputeResponse>builder()
                .message("Admin reviewed dispute successfully")
                .result(disputeService.adminReviewDispute(adminId, request))
                .build();
    }

    @GetMapping("/pending")
    public ApiResponse<List<DisputeResponse>> getPendingDisputes() {
        return ApiResponse.<List<DisputeResponse>>builder()
                .message("Pending disputes fetched successfully")
                .result(disputeService.getPendingDisputes())
                .build();
    }
}
