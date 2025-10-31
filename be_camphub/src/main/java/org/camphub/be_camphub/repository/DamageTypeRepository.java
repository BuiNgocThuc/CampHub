package org.camphub.be_camphub.repository;

import java.util.UUID;

import org.camphub.be_camphub.entity.DamageType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DamageTypeRepository extends JpaRepository<DamageType, UUID> {
    boolean existsByName(String name);
}
