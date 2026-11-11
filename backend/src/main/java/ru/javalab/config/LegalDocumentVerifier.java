package ru.javalab.config;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.HexFormat;
import java.util.Locale;
import java.util.regex.Pattern;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

/**
 * Fail-closed check for the public legal documents. This is a technical guard,
 * not a legal review: an operator must still have a qualified lawyer review the content.
 */
@Component
public class LegalDocumentVerifier {
    private static final Pattern PLACEHOLDER = Pattern.compile("\\[[A-ZА-Я0-9_ .:/-]{2,}\\]", Pattern.CASE_INSENSITIVE);
    private final Path publicDirectory;

    public LegalDocumentVerifier(@Value("${javalab.public-dir:/app/public}") String publicDirectory) {
        this.publicDirectory = Path.of(publicDirectory).toAbsolutePath().normalize();
    }

    public boolean areDocumentsReady(String configuredConsentHash) {
        return isFinalDocument("privacy.html")
                && isFinalDocument("consent.html")
                && isFinalDocument("terms.html")
                && consentHashMatches(configuredConsentHash);
    }

    public String registrationBlockReason(String configuredConsentHash) {
        if (!isFinalDocument("privacy.html") || !isFinalDocument("terms.html") || !isFinalDocument("consent.html")) {
            return "Публичные документы ещё содержат шаблонные поля или черновые пометки.";
        }
        if (!consentHashMatches(configuredConsentHash)) {
            return "Контрольная сумма отдельного согласия не совпадает с опубликованным файлом consent.html.";
        }
        return "Документы прошли техническую проверку. Отдельная юридическая проверка всё равно обязательна.";
    }

    public String currentConsentHash() {
        try {
            byte[] bytes = Files.readAllBytes(publicDirectory.resolve("consent.html"));
            return HexFormat.of().formatHex(MessageDigest.getInstance("SHA-256").digest(bytes));
        } catch (IOException | NoSuchAlgorithmException ex) {
            throw new IllegalStateException("Cannot read the current consent document", ex);
        }
    }

    private boolean consentHashMatches(String expected) {
        if (expected == null || !expected.matches("(?i)[0-9a-f]{64}")) return false;
        try {
            String actual = currentConsentHash();
            return MessageDigest.isEqual(actual.toLowerCase(Locale.ROOT).getBytes(), expected.toLowerCase(Locale.ROOT).getBytes());
        } catch (IllegalStateException ex) {
            return false;
        }
    }

    private boolean isFinalDocument(String name) {
        try {
            Path file = publicDirectory.resolve(name).normalize();
            if (!file.startsWith(publicDirectory) || !Files.isRegularFile(file)) return false;
            String content = Files.readString(file).toLowerCase(Locale.ROOT);
            return !PLACEHOLDER.matcher(content).find()
                    && !content.contains("черновик")
                    && !content.contains("заполнить и проверить")
                    && !content.contains("юристу:")
                    && !content.contains("не готова к публикации")
                    && !content.contains("не готов к публикации")
                    && !content.contains("не является действующей формой");
        } catch (IOException ex) {
            return false;
        }
    }
}
