package org.camphub.be_camphub.interceptor;

import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.camphub.be_camphub.Utils.SecurityUtils;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Slf4j
@Component
@RequiredArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE, makeFinal = true)
public class StompAuthChannelInterceptor implements ChannelInterceptor {
    SecurityUtils securityUtils;

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);
        log.info("preSend frame: command={}, headers={}", accessor.getCommand(), accessor.toNativeHeaderMap());
        if (StompCommand.CONNECT.equals(accessor.getCommand())) {

            String token = accessor.getFirstNativeHeader("Authorization");

            if (token == null) {
                Map<String,Object> sessionAttrs = accessor.getSessionAttributes();
                if (sessionAttrs != null) token = (String) sessionAttrs.get("jwt");
            }

            if (token != null && token.startsWith("Bearer ")) {
                token = token.substring(7);

                Jwt jwt = securityUtils.validateToken(token);
                if (jwt == null) {
                    log.warn("[STOMP] Invalid or expired token");
                    throw new IllegalArgumentException("Invalid or expired token");
                }

                Authentication auth =
                        new JwtAuthenticationToken(jwt, List.of(
                                new SimpleGrantedAuthority("ROLE_" + jwt.getClaim("userType"))
                        ),
                                jwt.getClaim("userId").toString());
                accessor.setUser(auth);
                log.info("[STOMP] Authenticated STOMP connection as userId={}", Optional.ofNullable(jwt.getClaim("userId")));
            } else {
                log.warn("[STOMP] No token found in CONNECT frame");

            }

        }

        return message;
    }
}
