package org.camphub.be_camphub.Utils;

import lombok.RequiredArgsConstructor;
import org.camphub.be_camphub.entity.Account;
import org.camphub.be_camphub.repository.AccountRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class PasswordMigrationRunner {

    private final AccountRepository accountRepository;
    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);

    public void run(String... args) throws Exception {
        List<Account> accounts = accountRepository.findAll();
        for (Account acc : accounts) {
            String rawPassword = acc.getPassword();
            if (!rawPassword.startsWith("$2a$")) {
                acc.setPassword(passwordEncoder.encode(rawPassword));
            }
        }
        accountRepository.saveAll(accounts);
        System.out.println("✅ Password migration completed");
    }
}
