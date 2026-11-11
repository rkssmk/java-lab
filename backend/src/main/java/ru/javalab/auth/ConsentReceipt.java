package ru.javalab.auth;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "privacy_consent_receipts")
public class ConsentReceipt {
    @Id
    private UUID id;
    @Column(name = "user_id", nullable = false)
    private UUID userId;
    @Column(name = "consent_version", nullable = false, length = 40)
    private String consentVersion;
    @Column(name = "consent_sha256", nullable = false, length = 64)
    private String consentSha256;
    @Column(name = "accepted_at", nullable = false)
    private Instant acceptedAt;

    protected ConsentReceipt() {}

    public ConsentReceipt(UUID userId, String consentVersion, String consentSha256) {
        this.id = UUID.randomUUID();
        this.userId = userId;
        this.consentVersion = consentVersion;
        this.consentSha256 = consentSha256;
        this.acceptedAt = Instant.now();
    }
}
