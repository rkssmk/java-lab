package ru.javalab.progress;

import jakarta.persistence.LockModeType;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface UserProgressRepository extends JpaRepository<UserProgress, UUID> {
    Optional<UserProgress> findByUserId(UUID userId);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select p from UserProgress p where p.userId = :userId")
    Optional<UserProgress> findByUserIdForUpdate(@Param("userId") UUID userId);
}
