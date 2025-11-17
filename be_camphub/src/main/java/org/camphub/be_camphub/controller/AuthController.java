package org.camphub.be_camphub.controller;

import com.nimbusds.jose.JOSEException;
import org.camphub.be_camphub.dto.request.auth.AuthRequest;
import org.camphub.be_camphub.dto.request.auth.RefreshTokenRequest;
import org.camphub.be_camphub.dto.request.auth.RegisterRequest;
import org.camphub.be_camphub.dto.response.ApiResponse;
import org.camphub.be_camphub.dto.response.account.AccountResponse;
import org.camphub.be_camphub.dto.response.auth.AuthResponse;
import org.camphub.be_camphub.dto.response.auth.RefreshTokenResponse;
import org.camphub.be_camphub.dto.response.auth.RegisterResponse;
import org.camphub.be_camphub.service.AuthService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.text.ParseException;
import java.util.UUID;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthController {
    AuthService authService;

    @PostMapping("/login")
    public ApiResponse<AuthResponse> login(@RequestBody AuthRequest request) {
        AuthResponse response = authService.authenticate(request);
        return ApiResponse.<AuthResponse>builder()
                .result(response)
                .message("User authenticated successfully")
                .build();
    }

    @PostMapping("/register")
    public ApiResponse<RegisterResponse> register(@RequestBody RegisterRequest request) {
        return ApiResponse.<RegisterResponse>builder()
                .result(authService.register(request))
                .message("User registered successfully")
                .build();
    }

    @PostMapping("/refresh-token")
    public ApiResponse<RefreshTokenResponse> refresh(@RequestBody RefreshTokenRequest request)
            throws ParseException, JOSEException {
        RefreshTokenResponse response = authService.refreshToken(request);
        return ApiResponse.<RefreshTokenResponse>builder()
                .result(response)
                .message("Access token refreshed")
                .build();
    }

    @PostMapping("/logout")
    public ApiResponse<Void> logout() {
        // Stateless JWT -> backend không cần làm gì
        return ApiResponse.<Void>builder()
                .message("Logged out successfully")
                .build();
    }

    @GetMapping("/my-info")
    public ApiResponse<AccountResponse> getMyInfo(@AuthenticationPrincipal Jwt jwt) {
        UUID myId = UUID.fromString(jwt.getClaimAsString("id"));
        AccountResponse response = authService.getMyInfo(myId);
        return ApiResponse.<AccountResponse>builder()
                .result(response)
                .message("User info retrieved successfully")
                .build();
    }

}
