package org.camphub.be_camphub.service;

import java.util.UUID;

import org.camphub.be_camphub.dto.request.auth.AuthRequest;
import org.camphub.be_camphub.dto.request.auth.RefreshTokenRequest;
import org.camphub.be_camphub.dto.request.auth.RegisterRequest;
import org.camphub.be_camphub.dto.response.auth.AuthResponse;
import org.camphub.be_camphub.dto.response.auth.MyInfoResponse;
import org.camphub.be_camphub.dto.response.auth.RefreshTokenResponse;
import org.camphub.be_camphub.dto.response.auth.RegisterResponse;

public interface AuthService {
    AuthResponse authenticate(AuthRequest request);

    RegisterResponse register(RegisterRequest request);

    RefreshTokenResponse refreshToken(RefreshTokenRequest refreshToken);

    MyInfoResponse getMyInfo(UUID accountId);
}
