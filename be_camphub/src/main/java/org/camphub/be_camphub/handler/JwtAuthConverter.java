package org.camphub.be_camphub.handler;

import java.util.ArrayList;
import java.util.Collection;

import org.springframework.core.convert.converter.Converter;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Component;

@Component
public class JwtAuthConverter implements Converter<Jwt, AbstractAuthenticationToken> {

    @Override
    public AbstractAuthenticationToken convert(Jwt jwt) {
        String userType = jwt.getClaim("userType");
        Collection<GrantedAuthority> authorities = new ArrayList<>();

        if (userType != null) {
            authorities.add(new SimpleGrantedAuthority("ROLE_" + userType));
        }

        return new JwtAuthenticationToken(jwt, authorities);
    }
}
