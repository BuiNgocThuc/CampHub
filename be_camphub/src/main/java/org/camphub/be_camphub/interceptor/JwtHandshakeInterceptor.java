package org.camphub.be_camphub.interceptor;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.http.server.ServletServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;

import java.util.Map;

@Slf4j
@Component
@RequiredArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE, makeFinal = true)
public class JwtHandshakeInterceptor implements HandshakeInterceptor {
    @Override
    public boolean beforeHandshake(ServerHttpRequest request, ServerHttpResponse response, WebSocketHandler wsHandler, Map<String, Object> attributes) throws Exception {

        if (request instanceof ServletServerHttpRequest servletRequest) {
            HttpServletRequest servlet = servletRequest.getServletRequest();

            // Check Authorization header
            String authHeader = servlet.getHeader("Authorization");
            log.info("[Handshake] Authorization header: {}", authHeader);
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                attributes.put("jwt", authHeader.substring(7));
                return true;
            }

            // check query parameter "token"
            String tokenParam = servlet.getParameter("token");
            if (tokenParam != null && !tokenParam.isBlank()) {
                attributes.put("jwt", tokenParam);
                log.info("[Handshake] Found token in query param");
                return true;
            }

            log.warn("[Handshake] No token found, connection might be rejected");
            return false;
        }
        return true;
    }

    @Override
    public void afterHandshake(ServerHttpRequest request, ServerHttpResponse response, WebSocketHandler wsHandler, Exception exception) {
        if (exception != null) {
            log.error("[WebSocket] Handshake failed: {}", exception.getMessage());
        }
    }
}
