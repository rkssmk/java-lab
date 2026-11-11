package ru.javalab.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.Pbkdf2PasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.security.web.csrf.CsrfTokenRequestAttributeHandler;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.security.web.context.SecurityContextRepository;

@Configuration
public class SecurityConfig {
    @Bean
    PasswordEncoder passwordEncoder() {
        return Pbkdf2PasswordEncoder.defaultsForSpringSecurity_v5_8();
    }

    @Bean
    SecurityContextRepository securityContextRepository() {
        return new HttpSessionSecurityContextRepository();
    }

    @Bean
    CookieCsrfTokenRepository csrfTokenRepository(AppProperties properties) {
        CookieCsrfTokenRepository repository = CookieCsrfTokenRepository.withHttpOnlyFalse();
        repository.setCookiePath("/");
        repository.setCookieName("XSRF-TOKEN");
        repository.setHeaderName("X-XSRF-TOKEN");
        repository.setCookieCustomizer(cookie -> cookie
                // The frontend receives the token from /api/auth/csrf JSON; it does not need JS access to the cookie.
                .httpOnly(true)
                .secure(properties.session() != null && properties.session().secureCookies())
                .sameSite("Lax"));
        return repository;
    }

    @Bean
    SecurityFilterChain securityFilterChain(
            HttpSecurity http,
            CookieCsrfTokenRepository csrfRepository,
            SecurityContextRepository contextRepository,
            UserDetailsService userDetailsService
    ) throws Exception {
        http
            .securityContext(context -> context.securityContextRepository(contextRepository))
            .sessionManagement(session -> session
                    .sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED)
                    .sessionFixation(fixation -> fixation.changeSessionId()))
            .csrf(csrf -> csrf
                    .csrfTokenRepository(csrfRepository)
                    .csrfTokenRequestHandler(new CsrfTokenRequestAttributeHandler()))
            .authorizeHttpRequests(authorize -> authorize
                    .requestMatchers(HttpMethod.GET,
                            "/api/health", "/api/meta/public", "/api/auth/csrf",
                            "/privacy.html", "/consent.html", "/terms.html",
                            "/", "/index.html", "/assets/**", "/favicon.ico").permitAll()
                    .requestMatchers(HttpMethod.POST,
                            "/api/auth/register", "/api/auth/login", "/api/auth/recover").permitAll()
                    .anyRequest().authenticated())
            .requestCache(cache -> cache.disable())
            .httpBasic(basic -> basic.disable())
            .formLogin(form -> form.disable())
            .logout(logout -> logout.disable())
            .headers(headers -> headers
                    .frameOptions(frame -> frame.deny())
                    .contentTypeOptions(options -> {}));
        return http.build();
    }

    @Bean
    AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }
}
