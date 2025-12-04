package org.camphub.be_camphub.controller;

import java.util.List;
import java.util.UUID;

import jakarta.validation.Valid;

import org.camphub.be_camphub.dto.request.return_req.AdminDecisionRequest;
import org.camphub.be_camphub.dto.request.return_req.LesseeSubmitReturnRequest;
import org.camphub.be_camphub.dto.request.return_req.LessorConfirmReturnRequest;
import org.camphub.be_camphub.dto.request.return_req.ReturnReqCreationRequest;
import org.camphub.be_camphub.dto.response.ApiResponse;
import org.camphub.be_camphub.dto.response.return_req.ReturnReqResponse;
import org.camphub.be_camphub.service.ReturnRequestService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/return-requests")
@RequiredArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE, makeFinal = true)
public class ReturnRequestController {
    ReturnRequestService returnRequestService;

    /**
     * Lessee tạo yêu cầu trả hàng (bắt đầu quy trình)
     */
    @PostMapping("/create")
    public ApiResponse<ReturnReqResponse> createReturnRequest(
            @AuthenticationPrincipal Jwt jwt, @RequestBody @Valid ReturnReqCreationRequest request) {
        UUID ownerId = UUID.fromString(jwt.getClaim("userId"));
        return ApiResponse.<ReturnReqResponse>builder()
                .message("Create return request successfully")
                .result(returnRequestService.createReturnRequest(ownerId, request))
                .build();
    }

    /**
     * Lessee gửi bằng chứng đóng gói + xác nhận đã gửi hàng
     */
    @PostMapping("/lessee/submit-return")
    public ApiResponse<ReturnReqResponse> lesseeSubmitReturn(
            @AuthenticationPrincipal Jwt jwt, @RequestBody @Valid LesseeSubmitReturnRequest request) {
        UUID lesseeId = UUID.fromString(jwt.getClaim("userId"));

        return ApiResponse.<ReturnReqResponse>builder()
                .message("Submit return packing successfully")
                .result(returnRequestService.lesseeSubmitReturn(lesseeId, request))
                .build();
    }

    /**
     * Lessor xác nhận đã nhận hàng trả
     */
    @PostMapping("/lessor/confirm")
    public ApiResponse<ReturnReqResponse> lessorConfirmReturn(
            @AuthenticationPrincipal Jwt jwt, @RequestBody @Valid LessorConfirmReturnRequest request) {
        UUID lessorId = UUID.fromString(jwt.getClaim("userId"));

        return ApiResponse.<ReturnReqResponse>builder()
                .message("Lessor confirmed returned item successfully")
                .result(returnRequestService.lessorConfirmReturn(lessorId, request))
                .build();
    }

    /**
     * Admin phê duyệt hoặc từ chối hoàn tiền
     */
    @PostMapping("/admin/decision")
    public ApiResponse<ReturnReqResponse> adminDecision(
            @AuthenticationPrincipal Jwt jwt, @RequestBody @Valid AdminDecisionRequest request) {
        UUID adminId = UUID.fromString(jwt.getClaim("userId"));

        return ApiResponse.<ReturnReqResponse>builder()
                .message("Admin processed return request successfully")
                .result(returnRequestService.adminDecision(adminId, request))
                .build();
    }

    /**
     * Lấy danh sách yêu cầu đang chờ xử lý (cho admin dashboard)
     */
    @GetMapping("/pending")
    public ApiResponse<List<ReturnReqResponse>> getPendingRequests() {
        return ApiResponse.<List<ReturnReqResponse>>builder()
                .message("Fetch pending return requests successfully")
                .result(returnRequestService.getPendingRequests())
                .build();
    }

    // Lấy tất cả yêu cầu trả hàng (cho admin)
    @GetMapping
    public ApiResponse<List<ReturnReqResponse>> getAllReturnRequests() {
        log.info("Fetching all return requests");
        return ApiResponse.<List<ReturnReqResponse>>builder()
                .message("Fetch all return requests successfully")
                .result(returnRequestService.getAllReturnRequests())
                .build();
    }
}
