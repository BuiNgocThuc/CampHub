package org.camphub.be_camphub.service.impl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.camphub.be_camphub.Utils.SecurityUtils;
import org.camphub.be_camphub.dto.request.account.AccountCreationRequest;
import org.camphub.be_camphub.dto.request.account.AccountPatchRequest;
import org.camphub.be_camphub.dto.request.account.AccountUpdateRequest;
import org.camphub.be_camphub.dto.response.account.AccountResponse;
import org.camphub.be_camphub.entity.Account;
import org.camphub.be_camphub.enums.UserStatus;
import org.camphub.be_camphub.enums.UserType;
import org.camphub.be_camphub.exception.AppException;
import org.camphub.be_camphub.exception.ErrorCode;
import org.camphub.be_camphub.mapper.AccountMapper;
import org.camphub.be_camphub.repository.AccountRepository;
import org.camphub.be_camphub.service.AccountService;
import org.springframework.stereotype.Service;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AccountServiceImpl implements AccountService {
    AccountRepository accountRepository;
    AccountMapper accountMapper;

    SecurityUtils securityUtils;

    @Override
    public List<AccountResponse> getAccounts() {
        return accountRepository.findAll().stream()
                .map(accountMapper::entityToResponse)
                .toList();
    }

    @Override
    public AccountResponse getAccountById(UUID id) {
        return accountMapper.entityToResponse(
                accountRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND)));
    }

    private Account createAccount(AccountCreationRequest request, UserType userType) {
        if (accountRepository.existsByUsername(request.getUsername())) {
            throw new AppException(ErrorCode.USERNAME_EXISTED);
        }

        Account account = accountMapper.creationRequestToEntity(request);

        account.setPassword(securityUtils.encryptPassword(request.getPassword()));
        account.setUserType(userType);
        account.setStatus(UserStatus.ACTIVE);
        if (userType == UserType.USER) {
            account.setTrustScore(100);
            account.setCoinBalance(0.0);
        }

        return accountRepository.save(account);
    }

    @Override
    public AccountResponse createUserAccount(AccountCreationRequest request) {
        Account account = createAccount(request, UserType.USER);
        return accountMapper.entityToResponse(account);
    }

    @Override
    public AccountResponse createAdminAccount(AccountCreationRequest request) {
        Account account = createAccount(request, UserType.ADMIN);
        return accountMapper.entityToResponse(account);
    }

    @Override
    public AccountResponse updateAccount(UUID id, AccountUpdateRequest request) {
        Account account = accountRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        accountMapper.updateRequestToEntity(account, request);
        return accountMapper.entityToResponse(accountRepository.save(account));
    }

    @Override
    public AccountResponse patchAccount(UUID id, AccountPatchRequest request) {
        Account account = accountRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        accountMapper.patchRequestToEntity(account, request);
        return accountMapper.entityToResponse(accountRepository.save(account));
    }

    @Override
    public void deleteAccount(UUID id) {
        Account account = accountRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        account.setDeletedAt(LocalDateTime.now());
        accountRepository.save(account);
    }

    @Override
    public Account getMyInfo() {
        return null;
    }
}
