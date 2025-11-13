package org.camphub.be_camphub.repository;

import java.util.Optional;
import java.util.UUID;

import org.camphub.be_camphub.entity.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface AccountRepository extends JpaRepository<Account, UUID> {
    boolean existsByUsername(String username);

    boolean existsByEmail(String email);

    Optional<Account> findByUsername(String username);

    @Query("SELECT a FROM Account  a WHERE a.username = 'SYSTEM_WALLET'")
    Optional<Account> findSystemWallet();
}
