package ru.javalab.config;

import static org.junit.jupiter.api.Assertions.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.security.MessageDigest;
import java.util.HexFormat;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;

class LegalDocumentVerifierTest {
    @TempDir Path temp;

    @Test
    void draftDocumentsNeverEnableRegistration() throws Exception {
        for (String file : new String[]{"privacy.html", "consent.html", "terms.html"}) {
            Files.writeString(temp.resolve(file), "<h1>ЧЕРНОВИК [OPERATOR_NAME]</h1>");
        }
        LegalDocumentVerifier verifier = new LegalDocumentVerifier(temp.toString());
        assertFalse(verifier.areDocumentsReady("a".repeat(64)));
    }

    @Test
    void finalDocumentsRequireMatchingConsentFileHash() throws Exception {
        Files.writeString(temp.resolve("privacy.html"), "<h1>Privacy policy final</h1>");
        Files.writeString(temp.resolve("terms.html"), "<h1>Terms final</h1>");
        Files.writeString(temp.resolve("consent.html"), "<h1>Consent final</h1>");
        String hash = HexFormat.of().formatHex(MessageDigest.getInstance("SHA-256")
                .digest(Files.readAllBytes(temp.resolve("consent.html"))));
        LegalDocumentVerifier verifier = new LegalDocumentVerifier(temp.toString());
        assertTrue(verifier.areDocumentsReady(hash));
        assertFalse(verifier.areDocumentsReady("b".repeat(64)));
    }
}
