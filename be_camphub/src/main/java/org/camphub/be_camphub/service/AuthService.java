package org.camphub.be_camphub.service;

import com.nimbusds.jose.JOSEException;
import org.camphub.be_camphub.dto.request.account.AccountCreationRequest;
import org.camphub.be_camphub.dto.request.auth.AuthRequest;
import org.camphub.be_camphub.dto.request.auth.RefreshTokenRequest;
import org.camphub.be_camphub.dto.request.auth.RegisterRequest;
import org.camphub.be_camphub.dto.response.account.AccountResponse;
import org.camphub.be_camphub.dto.response.auth.AuthResponse;
import org.camphub.be_camphub.dto.response.auth.RefreshTokenResponse;
import org.camphub.be_camphub.dto.response.auth.RegisterResponse;

import java.text.ParseException;
import java.util.UUID;

public interface AuthService {
    AuthResponse authenticate(AuthRequest request);
    RegisterResponse register(RegisterRequest request);
    RefreshTokenResponse refreshToken(RefreshTokenRequest refreshToken);
    AccountResponse getMyInfo(UUID accountId);
}
