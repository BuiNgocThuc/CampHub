package org.camphub.be_camphub.controller;

import java.util.List;
import java.util.UUID;

import org.camphub.be_camphub.dto.request.account.AccountCreationRequest;
import org.camphub.be_camphub.dto.request.account.AccountPatchRequest;
import org.camphub.be_camphub.dto.request.account.AccountUpdateRequest;
import org.camphub.be_camphub.dto.response.ApiResponse;
import org.camphub.be_camphub.dto.response.account.AccountResponse;
import org.camphub.be_camphub.service.AccountService;
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
        AccountResponse accountResponse = accountService.createAdminAccount(request);
        return ApiResponse.<AccountResponse>builder()
                .message("Create account for admin Successfully")
                .result(accountResponse)
                .build();
    }

    // update account for admin
    @PutMapping("/{id}")
    ApiResponse<AccountResponse> updateAccountForAdmin(
            @PathVariable UUID id, @RequestBody AccountUpdateRequest request) {
        AccountResponse accountResponse = accountService.updateAccount(id, request);
        return ApiResponse.<AccountResponse>builder()
                .message("Update account Successfully")
                .result(accountResponse)
                .build();
    }

    // patch account
    @PatchMapping("/{id}")
    ApiResponse<AccountResponse> patchAccount(@PathVariable UUID id, @RequestBody AccountPatchRequest request) {
        AccountResponse accountResponse = accountService.patchAccount(id, request);
        return ApiResponse.<AccountResponse>builder()
                .message("Patch account Successfully")
                .result(accountResponse)
                .build();
    }

    @GetMapping
    ApiResponse<List<AccountResponse>> getAccounts() {
        List<AccountResponse> accounts = accountService.getAccounts();
        return ApiResponse.<List<AccountResponse>>builder()
                .message("Get accounts Successfully")
                .result(accounts)
                .build();
    }

    @GetMapping("/{id}")
    ApiResponse<AccountResponse> getAccountById(@PathVariable UUID id) {
        AccountResponse accountResponse = accountService.getAccountById(id);
        return ApiResponse.<AccountResponse>builder()
                .message("Get account by id Successfully")
                .result(accountResponse)
                .build();
    }
}
