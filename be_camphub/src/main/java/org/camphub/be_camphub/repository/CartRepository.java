package org.camphub.be_camphub.repository;

import java.util.Optional;
import java.util.UUID;

import org.camphub.be_camphub.entity.Cart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CartRepository extends JpaRepository<Cart, UUID> {
    Optional<Cart> findByAccountId(UUID accountId);
}
