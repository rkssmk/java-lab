package ru.javalab.common;

import java.util.Map;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

@RestControllerAdvice
public class ApiExceptionHandler {
    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<Map<String, String>> status(ResponseStatusException ex) {
        String message = ex.getReason() == null ? "Запрос не выполнен." : ex.getReason();
        return ResponseEntity.status(ex.getStatusCode()).body(Map.of("error", ex.getStatusCode().toString(), "message", message));
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<Map<String, String>> integrity(DataIntegrityViolationException ex) {
        // Do not reveal schema details or whether a particular database constraint was hit.
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(Map.of("error", "CONFLICT", "message", "Не удалось сохранить запись: проверь логин и повтори запрос."));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> invalid(MethodArgumentNotValidException ex) {
        String message = ex.getBindingResult().getFieldErrors().stream()
                .findFirst().map(error -> error.getDefaultMessage() == null ? "Проверь введённые данные." : error.getDefaultMessage())
                .orElse("Проверь введённые данные.");
        return ResponseEntity.badRequest().body(Map.of("error", "VALIDATION", "message", message));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, String>> unexpected(Exception ex) {
        // Do not disclose stack traces, SQL details, or request payloads to the browser.
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "INTERNAL", "message", "Внутренняя ошибка. Попробуй позже."));
    }
}
