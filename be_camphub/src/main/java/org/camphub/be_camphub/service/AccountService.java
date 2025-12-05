package org.camphub.be_camphub.service;

import java.util.List;
import java.util.UUID;

import org.camphub.be_camphub.dto.request.account.AccountCreationRequest;
import org.camphub.be_camphub.dto.request.account.AccountPatchRequest;
import org.camphub.be_camphub.dto.request.account.AccountUpdateRequest;
import org.camphub.be_camphub.dto.request.account.TopUpRequest;
import org.camphub.be_camphub.dto.response.account.AccountResponse;
import org.camphub.be_camphub.dto.response.account.TopUpResponse;

public interface AccountService {
    List<AccountResponse> getAccounts();

    AccountResponse getAccountById(UUID id);

    AccountResponse createUserAccount(AccountCreationRequest request);

    AccountResponse createAdminAccount(AccountCreationRequest request);

    AccountResponse updateAccount(UUID id, AccountUpdateRequest request);

    AccountResponse patchAccount(UUID id, AccountPatchRequest request);

    TopUpResponse topUpAccount(TopUpRequest request, UUID accountId);
}
