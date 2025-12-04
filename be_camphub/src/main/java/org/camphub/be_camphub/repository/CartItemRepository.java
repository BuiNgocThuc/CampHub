package org.camphub.be_camphub.repository;

import java.util.List;
import java.util.UUID;

import org.camphub.be_camphub.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, UUID> {
    List<CartItem> findByCartId(UUID cartId);

    List<CartItem> findAllByIdIn(List<UUID> cartIds);

    @Query("SELECT ci FROM CartItem ci JOIN Cart c ON ci.cartId = c.id "
            + "WHERE ci.id IN :ids AND c.accountId = :ownerId")
    List<CartItem> findAllByCartIdInAndCartOwner(@Param("ids") List<UUID> ids, @Param("ownerId") UUID ownerId);

    Integer countByCartId(UUID cartId);

    CartItem findByCartIdAndItemId(UUID cartId, UUID itemId);
}
