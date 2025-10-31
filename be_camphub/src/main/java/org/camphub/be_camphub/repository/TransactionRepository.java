package org.camphub.be_camphub.repository;

import java.util.UUID;

import org.camphub.be_camphub.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, UUID> {}
