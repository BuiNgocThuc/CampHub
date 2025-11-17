package org.camphub.be_camphub.Utils;

import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import lombok.experimental.NonFinal;
import org.camphub.be_camphub.entity.Account;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import lombok.extern.slf4j.Slf4j;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.UUID;

@Slf4j
@Component
public class SecurityUtils {
    @NonFinal
    @Value("${jwt.signerKey}")
    protected String SIGNER_KEY;

    // encrypt password function
    public String encryptPassword(String password) {
        log.info("Password: {}", password);
        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);
        return passwordEncoder.encode(password);
    }

    // check match password function
    public boolean checkMatchPassword(String password, String encodedPassword) {
        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);
        return passwordEncoder.matches(password, encodedPassword);
    }

    public String generateToken(Account account, long expirationMinutes) {
        JWSHeader header = new JWSHeader(JWSAlgorithm.HS512);
        JWTClaimsSet claims = new JWTClaimsSet.Builder()
                .subject(account.getUsername())
                .issuer("CampHub.com")
                .issueTime(new Date())
                .expirationTime(Date.from(Instant.now().plus(expirationMinutes, ChronoUnit.MINUTES)))
                .claim("userId", account.getId())
                .claim("userType", account.getUserType().name())
                .build();

        JWSObject jws = new JWSObject(header, new Payload(claims.toJSONObject()));

        try {
            jws.sign(new MACSigner(SIGNER_KEY.getBytes()));
            return jws.serialize();
        } catch (JOSEException e) {
            throw new RuntimeException("Cannot create token", e);
        }
    }

    public String generateAccessToken(Account user) {
        return generateToken(user, 60);
    }

    public String generateRefreshToken(Account user) {
        return generateToken(user, 60 * 24 * 7);
    }

    public UUID introspectToken(String token) {
        try {
            SignedJWT signedJWT = SignedJWT.parse(token);
            JWSVerifier verifier = new MACVerifier(SIGNER_KEY.getBytes());

            boolean verified = signedJWT.verify(verifier);
            Date expiryTime = signedJWT.getJWTClaimsSet().getExpirationTime();

            if (verified && expiryTime.after(new Date())) {
                String userIdStr = (String) signedJWT.getJWTClaimsSet().getClaim("userId");
                return UUID.fromString(userIdStr);
            }
            return null;
        } catch (Exception e) {
            log.error("Error introspecting token", e);
            return null;
        }
    }
}
