package org.camphub.be_camphub.repository;

import java.util.List;
import java.util.UUID;

import org.camphub.be_camphub.entity.ItemImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ItemImagesRepository extends JpaRepository<ItemImage, UUID> {
    List<ItemImage> findAllByItemId(UUID itemId);

    void deleteAllByItemId(UUID itemId);
}
