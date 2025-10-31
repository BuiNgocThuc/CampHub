package org.camphub.be_camphub.service.impl;

import org.camphub.be_camphub.Utils.SecurityUtils;
import org.camphub.be_camphub.dto.request.auth.AuthRequest;
import org.camphub.be_camphub.dto.response.auth.AuthResponse;
import org.camphub.be_camphub.exception.AppException;
import org.camphub.be_camphub.exception.ErrorCode;
import org.camphub.be_camphub.repository.UserRepository;
import org.camphub.be_camphub.service.AuthService;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE, makeFinal = true)
public class AuthServiceImpl implements AuthService {
    UserRepository userRepository;

    SecurityUtils securityUtils;

    // compare request password with the password stored in the database
    @Override
    public AuthResponse authenticate(AuthRequest request) {
        var user = userRepository
                .findByUsername(request.getUsername())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        boolean authenticated = securityUtils.checkMatchPassword(request.getPassword(), user.getPassword());

        if (!authenticated) {
            throw new AppException(ErrorCode.INVALID_PASSWORD);
        }

        return AuthResponse.builder().build();
    }
}
