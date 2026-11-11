package ru.javalab.progress;

import tools.jackson.databind.JsonNode;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.MapsId;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.UUID;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import ru.javalab.auth.UserAccount;

@Entity
@Table(name = "user_progress")
public class UserProgress {
    @Id
    private UUID userId;
    @MapsId
    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id")
    private UserAccount user;
    @Column(nullable = false)
    private long revision;
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(nullable = false, columnDefinition = "jsonb")
    private JsonNode state;
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    protected UserProgress() {}

    public UserProgress(UserAccount user, JsonNode state) {
        this.user = user;
        this.userId = user.getId();
        this.state = state;
        this.revision = 1;
        this.updatedAt = Instant.now();
    }

    public long getRevision() { return revision; }
    public JsonNode getState() { return state; }
    public Instant getUpdatedAt() { return updatedAt; }
    public void update(JsonNode state) {
        this.state = state;
        this.revision++;
        this.updatedAt = Instant.now();
    }
}
