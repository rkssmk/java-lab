package ru.javalab.account;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import ru.javalab.auth.UserAccount;
import ru.javalab.auth.UserRepository;

@RestController
@RequestMapping("/api/account")
public class AccountController {
    private final UserRepository users;
    private final PasswordEncoder passwords;

    public AccountController(UserRepository users, PasswordEncoder passwords) {
        this.users = users;
        this.passwords = passwords;
    }

    @PostMapping("/password")
    @Transactional
    public Map<String, Boolean> changePassword(@AuthenticationPrincipal UserDetails principal,
                                               @Valid @RequestBody PasswordChangeRequest request) {
        UserAccount user = current(principal);
        if (!passwords.matches(request.currentPassword(), user.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Текущий пароль не подходит.");
        }
        user.setPasswordHash(passwords.encode(request.newPassword()));
        users.save(user);
        return Map.of("changed", true);
    }

    @DeleteMapping
    @Transactional
    public Map<String, Boolean> delete(@AuthenticationPrincipal UserDetails principal,
                                       @Valid @RequestBody DeleteRequest request,
                                       jakarta.servlet.http.HttpServletRequest servletRequest) {
        UserAccount user = current(principal);
        if (!passwords.matches(request.password(), user.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Пароль не подходит.");
        }
        // Database foreign keys cascade user progress and consent receipts.
        users.delete(user);
        SecurityContextHolder.clearContext();
        var session = servletRequest.getSession(false);
        if (session != null) session.invalidate();
        return Map.of("deleted", true);
    }

    private UserAccount current(UserDetails principal) {
        return users.findByUsernameIgnoreCase(principal.getUsername())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));
    }

    public record PasswordChangeRequest(@NotBlank String currentPassword,
                                        @NotBlank @Size(min = 12, max = 128) String newPassword) {}
    public record DeleteRequest(@NotBlank String password) {}
}
