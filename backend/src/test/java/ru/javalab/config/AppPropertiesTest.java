package ru.javalab.config;

import static org.junit.jupiter.api.Assertions.*;
import org.junit.jupiter.api.Test;

class AppPropertiesTest {
    private static final String HASH = "a".repeat(64);

    private AppProperties properties(boolean enabled, boolean approved, String consentHash, String privacyVersion) {
        return new AppProperties(
                new AppProperties.Registration(enabled, approved, 18),
                new AppProperties.Legal("Оператор Тест", "Россия, тестовый адрес", "privacy@example.ru",
                        privacyVersion, "1.0", "1.0", consentHash),
                new AppProperties.Session(true),
                new AppProperties.Runner(false, "", ""));
    }

    @Test
    void registrationIsDisabledByDefaultFlags() {
        assertFalse(properties(false, false, HASH, "1.0").canRegister());
        assertFalse(properties(true, false, HASH, "1.0").canRegister());
    }

    @Test
    void registrationNeedsFinalDocumentVersionsAndSha256() {
        assertFalse(properties(true, true, HASH, "2026-11-draft-1").canRegister());
        assertFalse(properties(true, true, "not-a-hash", "1.0").canRegister());
        assertTrue(properties(true, true, HASH, "1.0").canRegister());
    }

    @Test
    void registrationRequiresSecureCookies() {
        AppProperties readyButInsecure = new AppProperties(
                new AppProperties.Registration(true, true, 18),
                new AppProperties.Legal("Оператор Тест", "Россия, тестовый адрес", "privacy@example.ru",
                        "1.0", "1.0", "1.0", HASH),
                new AppProperties.Session(false),
                new AppProperties.Runner(false, "", ""));
        assertFalse(readyButInsecure.canRegister());
        assertTrue(readyButInsecure.registrationDisabledReason().contains("Secure cookies"));
    }
}
