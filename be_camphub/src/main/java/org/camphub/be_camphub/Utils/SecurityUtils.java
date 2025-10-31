package org.camphub.be_camphub.Utils;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class SecurityUtils {
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
}
