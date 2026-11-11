package ru.javalab.auth;

import static org.junit.jupiter.api.Assertions.*;
import org.junit.jupiter.api.Test;

class AuthRateLimiterTest {
    @Test
    void blocksAfterEightFailedAttemptsInWindow() {
        AuthRateLimiter limiter = new AuthRateLimiter();
        String key = "login|user|127.0.0.1";
        for (int i = 0; i < 8; i++) {
            assertTrue(limiter.allowed(key));
            limiter.failed(key);
        }
        assertFalse(limiter.allowed(key));
    }

    @Test
    void successfulAuthenticationClearsFailureBucket() {
        AuthRateLimiter limiter = new AuthRateLimiter();
        String key = "login|user|127.0.0.1";
        for (int i = 0; i < 8; i++) limiter.failed(key);
        assertFalse(limiter.allowed(key));
        limiter.succeeded(key);
        assertTrue(limiter.allowed(key));
    }
}
