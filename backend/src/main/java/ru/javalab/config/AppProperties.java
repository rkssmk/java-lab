package ru.javalab.config;

import java.util.regex.Pattern;
import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app")
public record AppProperties(Registration registration, Legal legal, Session session, Runner runner) {
    private static final Pattern SHA256 = Pattern.compile("[0-9a-fA-F]{64}");

    public record Registration(boolean enabled, boolean legalLaunchApproved, int minAge) {}
    public record Legal(String operatorName, String operatorAddress, String contactEmail,
                        String privacyVersion, String consentVersion, String termsVersion,
                        String consentSha256) {}
    public record Session(boolean secureCookies) {}
    public record Runner(boolean enabled, String baseUrl, String authToken) {}

    public boolean legalProfileReady() {
        return legal != null
                && present(legal.operatorName())
                && present(legal.operatorAddress())
                && present(legal.contactEmail())
                && legal.contactEmail().matches("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$")
                && finalVersion(legal.privacyVersion())
                && finalVersion(legal.consentVersion())
                && finalVersion(legal.termsVersion())
                && legal.consentSha256() != null
                && SHA256.matcher(legal.consentSha256()).matches();
    }

    public boolean canRegister() {
        return registration != null && registration.enabled()
                && registration.legalLaunchApproved() && legalProfileReady()
                && session != null && session.secureCookies();
    }

    public String registrationDisabledReason() {
        if (registration == null || !registration.enabled()) return "Регистрация выключена администратором.";
        if (!legalProfileReady()) return "Регистрация выключена: не заполнены сведения об операторе, версии документов или контрольная сумма отдельного согласия.";
        if (session == null || !session.secureCookies()) return "Регистрация выключена: для публичного запуска обязательны Secure cookies и HTTPS.";
        if (!registration.legalLaunchApproved()) return "Регистрация выключена до завершения юридической проверки и обязательных уведомлений.";
        return "Регистрация доступна.";
    }

    private static boolean finalVersion(String value) {
        return present(value) && !value.toLowerCase().contains("draft") && !value.toLowerCase().contains("черновик");
    }

    private static boolean present(String value) {
        return value != null && !value.isBlank() && !value.contains("<") && !value.contains(">");
    }
}
