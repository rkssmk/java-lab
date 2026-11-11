package ru.javalab.auth;

import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ConsentReceiptRepository extends JpaRepository<ConsentReceipt, UUID> {}
