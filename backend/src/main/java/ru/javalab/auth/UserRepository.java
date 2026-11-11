package ru.javalab.auth;

import jakarta.persistence.LockModeType;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface UserRepository extends JpaRepository<UserAccount, UUID> {
    Optional<UserAccount> findByUsernameIgnoreCase(String username);
    boolean existsByUsernameIgnoreCase(String username);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select u from UserAccount u where lower(u.username) = lower(:username)")
    Optional<UserAccount> findLockedByUsername(@Param("username") String username);
}
