package org.camphub.be_camphub.service;

import org.camphub.be_camphub.dto.request.auth.AuthRequest;
import org.camphub.be_camphub.dto.response.auth.AuthResponse;

public interface AuthService {
    AuthResponse authenticate(AuthRequest request);
}
