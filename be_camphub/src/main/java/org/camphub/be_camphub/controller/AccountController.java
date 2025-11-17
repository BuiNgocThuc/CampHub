package org.camphub.be_camphub.controller;

import java.util.List;
import java.util.UUID;

import org.camphub.be_camphub.dto.request.account.AccountCreationRequest;
import org.camphub.be_camphub.dto.request.account.AccountPatchRequest;
import org.camphub.be_camphub.dto.request.account.AccountUpdateRequest;
import org.camphub.be_camphub.dto.request.account.TopUpRequest;
import org.camphub.be_camphub.dto.response.ApiResponse;
import org.camphub.be_camphub.dto.response.account.AccountResponse;
import org.camphub.be_camphub.dto.response.account.TopUpResponse;
import org.camphub.be_camphub.service.AccountService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequestMapping("/accounts")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AccountController {
    AccountService accountService;

    // create account for admin
    @PostMapping
    ApiResponse<AccountResponse> createAccountForAdmin(@RequestBody AccountCreationRequest request) {
        return ApiResponse.<AccountResponse>builder()
                .message("Create account for admin Successfully")
                .result(accountService.createAdminAccount(request))
                .build();
    }

    // update account for admin
    @PutMapping("/{id}")
    ApiResponse<AccountResponse> updateAccountForAdmin(
            @PathVariable UUID id, @RequestBody AccountUpdateRequest request) {
        return ApiResponse.<AccountResponse>builder()
                .message("Update account Successfully")
                .result(accountService.updateAccount(id, request))
                .build();
    }

    // patch account
    @PatchMapping("/{id}")
    ApiResponse<AccountResponse> patchAccount(@PathVariable UUID id, @RequestBody AccountPatchRequest request) {
        return ApiResponse.<AccountResponse>builder()
                .message("Patch account Successfully")
                .result(accountService.patchAccount(id, request))
                .build();
    }

    @GetMapping
    ApiResponse<List<AccountResponse>> getAccounts() {
        return ApiResponse.<List<AccountResponse>>builder()
                .message("Get accounts Successfully")
                .result(accountService.getAccounts())
                .build();
    }

    @GetMapping("/{id}")
    ApiResponse<AccountResponse> getAccountById(@PathVariable UUID id) {
        return ApiResponse.<AccountResponse>builder()
                .message("Get account by id Successfully")
                .result(accountService.getAccountById(id))
                .build();
    }

    @PostMapping("/top-up")
    ApiResponse<TopUpResponse> topUpAccount(
            @AuthenticationPrincipal Jwt jwt,
            @RequestBody TopUpRequest request) {
        UUID accountId = UUID.fromString(jwt.getClaimAsString("account_id"));
        return ApiResponse.<TopUpResponse>builder()
                .message("Top up account Successfully")
                .result(accountService.topUpAccount(request, accountId))
                .build();
    }
}
