package org.camphub.be_camphub.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.camphub.be_camphub.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryRepository extends JpaRepository<Category, UUID> {
    List<Category> findAllByIsDeletedFalse();

    Optional<Category> findByIdAndIsDeletedFalse(UUID id);
}
