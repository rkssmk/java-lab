package ru.javalab.common;

import java.util.Map;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.javalab.config.AppProperties;
import ru.javalab.config.LegalDocumentVerifier;

@RestController
public class PublicMetaController {
    private final AppProperties properties;
    private final LegalDocumentVerifier documents;

    public PublicMetaController(AppProperties properties, LegalDocumentVerifier documents) {
        this.properties = properties;
        this.documents = documents;
    }

    @GetMapping("/api/meta/public")
    public Map<String, Object> get() {
        boolean configurationReady = properties.canRegister();
        boolean documentsReady = configurationReady
                && documents.areDocumentsReady(properties.legal().consentSha256());
        boolean enabled = configurationReady && documentsReady;
        String reason = !configurationReady ? properties.registrationDisabledReason()
                : (!documentsReady ? documents.registrationBlockReason(properties.legal().consentSha256())
                : "Регистрация доступна только после подтверждения всех обязательных процедур оператором.");
        AppProperties.Legal legal = properties.legal();
        return Map.of(
                "registrationEnabled", enabled,
                "registrationDisabledReason", reason,
                "privacyVersion", safe(legal == null ? null : legal.privacyVersion()),
                "consentVersion", safe(legal == null ? null : legal.consentVersion()),
                "termsVersion", safe(legal == null ? null : legal.termsVersion()),
                "runnerEnabled", properties.runner() != null && properties.runner().enabled()
        );
    }

    private String safe(String value) { return value == null ? "" : value; }
}
