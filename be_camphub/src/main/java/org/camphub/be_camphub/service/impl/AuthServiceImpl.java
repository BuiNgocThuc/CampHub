package org.camphub.be_camphub.service.impl;

import org.camphub.be_camphub.Utils.SecurityUtils;
import org.camphub.be_camphub.dto.request.account.AccountCreationRequest;
import org.camphub.be_camphub.dto.request.auth.AuthRequest;
import org.camphub.be_camphub.dto.response.account.AccountResponse;
import org.camphub.be_camphub.dto.response.auth.AuthResponse;
import org.camphub.be_camphub.entity.Account;
import org.camphub.be_camphub.exception.AppException;
import org.camphub.be_camphub.exception.ErrorCode;
import org.camphub.be_camphub.mapper.AccountMapper;
import org.camphub.be_camphub.repository.AccountRepository;
import org.camphub.be_camphub.service.AuthService;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE, makeFinal = true)
public class AuthServiceImpl implements AuthService {
    AccountRepository accountRepository;
    AccountMapper accountMapper;
    SecurityUtils securityUtils;

    // compare request password with the password stored in the database
    @Override
    public AuthResponse authenticate(AuthRequest request) {
        var user = accountRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        boolean authenticated = securityUtils.checkMatchPassword(request.getPassword(), user.getPassword());

        if (!authenticated)
            throw new AppException(ErrorCode.UNAUTHENTICATED);

        String accessToken = securityUtils.generateAccessToken(user);
        String refreshToken = securityUtils.generateRefreshToken(user);

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .isAuthenticated(true)
                .expiresIn(60 * 60 * 1000) // 1h
                .build();
    }

    @Override
    public AccountResponse register(AccountCreationRequest request) {
        if (accountRepository.existsByUsername(request.getUsername())) {
            throw new AppException(ErrorCode.USERNAME_EXISTED);
        }
        if (accountRepository.existsByEmail(request.getEmail())) {
            throw new AppException(ErrorCode.EMAIL_EXISTED);
        }

        String encryptedPassword = securityUtils.encryptPassword(request.getPassword());
        request.setPassword(encryptedPassword);

        Account account = accountMapper.creationRequestToEntity(request);

        Account saved = accountRepository.save(account);

        return accountMapper.entityToResponse(saved);
    }
}
