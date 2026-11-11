package ru.javalab.common;

import static org.junit.jupiter.api.Assertions.*;
import java.nio.file.Path;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import ru.javalab.config.AppProperties;
import ru.javalab.config.LegalDocumentVerifier;

class PublicMetaControllerTest {
    @TempDir Path temp;

    @Test
    void publicMetadataWorksAndKeepsRegistrationDisabledWhenLegalProfileIsAbsent() {
        AppProperties properties = new AppProperties(
                new AppProperties.Registration(false, false, 18),
                null,
                new AppProperties.Session(true),
                new AppProperties.Runner(false, "", ""));
        PublicMetaController controller = new PublicMetaController(properties,
                new LegalDocumentVerifier(temp.toString()));

        var result = controller.get();
        assertEquals(Boolean.FALSE, result.get("registrationEnabled"));
        assertEquals("", result.get("privacyVersion"));
        assertEquals("Регистрация выключена администратором.", result.get("registrationDisabledReason"));
    }
}
