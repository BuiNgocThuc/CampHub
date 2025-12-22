package org.camphub.be_camphub.Utils;

import java.util.List;

import org.camphub.be_camphub.entity.Account;
import org.camphub.be_camphub.repository.AccountRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

// @Component
@RequiredArgsConstructor
@Slf4j
public class PasswordMigrationRunner implements CommandLineRunner {

    private final AccountRepository accountRepository;
    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);

    private static final String NEW_PASSWORD = "camphub123";

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        log.info("========== BẮT ĐẦU RESET MẬT KHẨU CHO TẤT CẢ USER ==========");

        List<Account> accounts = accountRepository.findAll();

        if (accounts.isEmpty()) {
            log.warn("Không tìm thấy tài khoản nào để reset mật khẩu.");
            return;
        }

        for (Account account : accounts) {
            String hashedPassword = passwordEncoder.encode(NEW_PASSWORD);
            account.setPassword(hashedPassword);
            log.info("Đã cập nhật mật khẩu cho user: {}", account.getUsername());
        }

        accountRepository.saveAll(accounts);

        log.info("========== HOÀN TẤT: ĐÃ ĐỔI PASS {} TÀI KHOẢN THÀNH '{}' ==========", accounts.size(), NEW_PASSWORD);
    }
}
