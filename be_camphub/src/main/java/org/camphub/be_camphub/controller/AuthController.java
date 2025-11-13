package org.camphub.be_camphub.controller;

import org.camphub.be_camphub.dto.request.account.AccountCreationRequest;
import org.camphub.be_camphub.dto.request.auth.AuthRequest;
import org.camphub.be_camphub.dto.response.ApiResponse;
import org.camphub.be_camphub.dto.response.account.AccountResponse;
import org.camphub.be_camphub.dto.response.auth.AuthResponse;
import org.camphub.be_camphub.service.AuthService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

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
    public ApiResponse<AccountResponse> register(@RequestBody AccountCreationRequest request) {
        authService.register(request);
        return ApiResponse.<AccountResponse>builder()
                .result(authService.register(request))
                .message("User registered successfully")
                .build();
    }
}
