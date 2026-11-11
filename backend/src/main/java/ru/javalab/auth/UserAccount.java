package ru.javalab.auth;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "app_users")
public class UserAccount {
    @Id
    private UUID id;
    @Column(nullable = false, length = 32)
    private String username;
    @Column(name = "password_hash", nullable = false, length = 255)
    private String passwordHash;
    @Column(name = "recovery_code_hash", nullable = false, length = 255)
    private String recoveryCodeHash;
    @Column(nullable = false)
    private boolean enabled = true;
    @Column(name = "age_18_confirmed_at", nullable = false)
    private Instant age18ConfirmedAt;
    @Column(name = "terms_version", nullable = false, length = 40)
    private String termsVersion;
    @Column(name = "terms_accepted_at", nullable = false)
    private Instant termsAcceptedAt;
    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    protected UserAccount() {}

    public UserAccount(String username, String passwordHash, String recoveryCodeHash, String termsVersion) {
        this.id = UUID.randomUUID();
        this.username = username;
        this.passwordHash = passwordHash;
        this.recoveryCodeHash = recoveryCodeHash;
        this.termsVersion = termsVersion;
        this.age18ConfirmedAt = Instant.now();
        this.termsAcceptedAt = Instant.now();
        this.createdAt = Instant.now();
    }

    public UUID getId() { return id; }
    public String getUsername() { return username; }
    public String getPasswordHash() { return passwordHash; }
    public boolean isEnabled() { return enabled; }
    public Instant getCreatedAt() { return createdAt; }
    public String getTermsVersion() { return termsVersion; }
    public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }
    public String getRecoveryCodeHash() { return recoveryCodeHash; }
    public void setRecoveryCodeHash(String value) { this.recoveryCodeHash = value; }
}
