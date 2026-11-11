package ru.javalab.auth;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.security.SecureRandom;
import java.util.Base64;
import java.util.HexFormat;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import ru.javalab.config.AppProperties;
import ru.javalab.config.LegalDocumentVerifier;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final UserRepository users;
    private final ConsentReceiptRepository receipts;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final SecurityContextRepository contextRepository;
    private final CookieCsrfTokenRepository csrfRepository;
    private final AppProperties properties;
    private final AuthRateLimiter rateLimiter;
    private final LegalDocumentVerifier documents;
    private final SecureRandom secureRandom = new SecureRandom();

    public AuthController(UserRepository users, ConsentReceiptRepository receipts,
                          PasswordEncoder passwordEncoder, AuthenticationManager authenticationManager,
                          SecurityContextRepository contextRepository, CookieCsrfTokenRepository csrfRepository,
                          AppProperties properties, AuthRateLimiter rateLimiter, LegalDocumentVerifier documents) {
        this.users = users;
        this.receipts = receipts;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.contextRepository = contextRepository;
        this.csrfRepository = csrfRepository;
        this.properties = properties;
        this.rateLimiter = rateLimiter;
        this.documents = documents;
    }

    @GetMapping("/csrf")
    public Map<String, String> csrf(@org.springframework.web.bind.annotation.RequestAttribute("_csrf") CsrfToken token) {
        return Map.of("token", token.getToken());
    }

    @PostMapping("/register")
    @Transactional
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request, HttpServletRequest servletRequest) {
        String throttleKey = "register|" + servletRequest.getRemoteAddr();
        if (!rateLimiter.allowed(throttleKey)) {
            throw new ResponseStatusException(HttpStatus.TOO_MANY_REQUESTS, "Слишком много попыток регистрации. Попробуй позже.");
        }
        rateLimiter.failed(throttleKey); // Count every registration attempt, including successful requests.
        if (!properties.canRegister()) {
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE, properties.registrationDisabledReason());
        }
        if (!documents.areDocumentsReady(properties.legal().consentSha256())) {
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE,
                    documents.registrationBlockReason(properties.legal().consentSha256()));
        }
        if (!request.age18Confirmed() || !request.termsAccepted() || !request.privacyConsentAccepted()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Необходимо подтвердить возраст, правила и отдельно дать согласие на обработку данных.");
        }
        if (!properties.legal().consentVersion().equals(request.consentVersion())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Текст согласия обновился. Обнови страницу и прочитай его ещё раз.");
        }
        String username = request.username().trim();
        if (users.existsByUsernameIgnoreCase(username)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Такой логин уже занят.");
        }
        String recoveryCode = newRecoveryCode();
        UserAccount account = users.saveAndFlush(new UserAccount(
                username, passwordEncoder.encode(request.password()), passwordEncoder.encode(recoveryCode), properties.legal().termsVersion()));
        receipts.save(new ConsentReceipt(account.getId(), properties.legal().consentVersion(), consentHash()));
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("created", true, "username", account.getUsername(), "recoveryCode", recoveryCode));
    }

    @PostMapping("/login")
    public Map<String, Object> login(@Valid @RequestBody LoginRequest request,
                                     HttpServletRequest servletRequest,
                                     HttpServletResponse servletResponse) {
        String username = request.username().trim();
        String key = username.toLowerCase() + "|" + servletRequest.getRemoteAddr();
        if (!rateLimiter.allowed(key)) {
            throw new ResponseStatusException(HttpStatus.TOO_MANY_REQUESTS, "Слишком много попыток. Подожди 10 минут.");
        }
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(username, request.password()));
            HttpSession old = servletRequest.getSession(false);
            if (old != null) old.invalidate();
            servletRequest.getSession(true);
            servletRequest.changeSessionId();
            SecurityContext context = SecurityContextHolder.createEmptyContext();
            context.setAuthentication(authentication);
            SecurityContextHolder.setContext(context);
            contextRepository.saveContext(context, servletRequest, servletResponse);
            rateLimiter.succeeded(key);
            return Map.of("authenticated", true, "username", authentication.getName());
        } catch (BadCredentialsException ex) {
            rateLimiter.failed(key);
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Неверный логин или пароль.");
        }
    }

    @PostMapping("/recover")
    @Transactional
    public Map<String, Object> recover(@Valid @RequestBody RecoverRequest request, HttpServletRequest servletRequest) {
        String username = request.username().trim();
        String key = "recovery|" + username.toLowerCase() + "|" + servletRequest.getRemoteAddr();
        if (!rateLimiter.allowed(key)) {
            throw new ResponseStatusException(HttpStatus.TOO_MANY_REQUESTS, "Слишком много попыток. Подожди 10 минут.");
        }
        UserAccount user = users.findByUsernameIgnoreCase(username)
                .orElseThrow(() -> { rateLimiter.failed(key); return new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Неверный логин или ключ восстановления."); });
        if (!passwordEncoder.matches(request.recoveryCode(), user.getRecoveryCodeHash())) {
            rateLimiter.failed(key);
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Неверный логин или ключ восстановления.");
        }
        String newRecoveryCode = newRecoveryCode();
        user.setPasswordHash(passwordEncoder.encode(request.newPassword()));
        user.setRecoveryCodeHash(passwordEncoder.encode(newRecoveryCode));
        users.save(user);
        rateLimiter.succeeded(key);
        return Map.of("recovered", true, "recoveryCode", newRecoveryCode);
    }

    private String newRecoveryCode() {
        byte[] bytes = new byte[24];
        secureRandom.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

    @GetMapping("/me")
    public Map<String, Object> me(@org.springframework.security.core.annotation.AuthenticationPrincipal UserDetails principal) {
        UserAccount user = users.findByUsernameIgnoreCase(principal.getUsername()).orElseThrow();
        return Map.of("username", user.getUsername(), "createdAt", user.getCreatedAt().toString());
    }

    @PostMapping("/logout")
    public Map<String, Boolean> logout(HttpServletRequest request, HttpServletResponse response) {
        SecurityContextHolder.clearContext();
        HttpSession session = request.getSession(false);
        if (session != null) session.invalidate();
        csrfRepository.saveToken(null, request, response);
        return Map.of("loggedOut", true);
    }

    private String consentHash() {
        // The exact document hash is supplied by the operator after the final consent text is legally reviewed.
        return documents.currentConsentHash();
    }

    public record RegisterRequest(
            @NotBlank @Size(min = 3, max = 32) @Pattern(regexp = "[A-Za-z0-9_-]{3,32}") String username,
            @NotBlank @Size(min = 12, max = 128) String password,
            boolean age18Confirmed,
            boolean termsAccepted,
            boolean privacyConsentAccepted,
            @NotBlank String consentVersion
    ) {}

    public record RecoverRequest(@NotBlank @Size(min = 3, max = 32) String username,
                                 @NotBlank @Size(min = 20, max = 80) String recoveryCode,
                                 @NotBlank @Size(min = 12, max = 128) String newPassword) {}

    public record LoginRequest(
            @NotBlank @Size(min = 3, max = 32) String username,
            @NotBlank @Size(min = 1, max = 128) String password
    ) {}
}
