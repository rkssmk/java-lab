package ru.javalab.progress;

import tools.jackson.databind.JsonNode;
import tools.jackson.databind.json.JsonMapper;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import ru.javalab.auth.UserAccount;
import ru.javalab.auth.UserRepository;

@RestController
@RequestMapping("/api/progress")
public class ProgressController {
    private static final int MAX_STATE_BYTES = 512 * 1024;
    private final UserRepository users;
    private final UserProgressRepository progress;
    private final JsonMapper objectMapper;

    public ProgressController(UserRepository users, UserProgressRepository progress, JsonMapper objectMapper) {
        this.users = users;
        this.progress = progress;
        this.objectMapper = objectMapper;
    }

    @GetMapping
    public Map<String, Object> get(@AuthenticationPrincipal UserDetails principal) {
        UserAccount user = currentUser(principal);
        return progress.findByUserId(user.getId())
                .<Map<String, Object>>map(item -> Map.of(
                        "exists", true,
                        "revision", item.getRevision(),
                        "updatedAt", item.getUpdatedAt().toString(),
                        "state", item.getState()))
                .orElseGet(() -> Map.of("exists", false, "revision", 0, "state", Map.of()));
    }

    @PutMapping
    @Transactional
    public Map<String, Object> put(@AuthenticationPrincipal UserDetails principal,
                                   @Valid @RequestBody ProgressWriteRequest request) {
        // Lock the account row first. This serializes initial progress creation and prevents two devices
        // from racing to insert the one-to-one progress row.
        UserAccount user = users.findLockedByUsername(principal.getUsername())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));
        if (request.state() == null || !request.state().isObject()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Состояние прогресса должно быть JSON-объектом.");
        }
        try {
            if (objectMapper.writeValueAsBytes(request.state()).length > MAX_STATE_BYTES) {
                throw new ResponseStatusException(HttpStatus.PAYLOAD_TOO_LARGE, "Файл прогресса слишком большой (лимит 512 КБ).");
            }
        } catch (ResponseStatusException ex) {
            throw ex;
        } catch (Exception ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Не удалось прочитать прогресс.");
        }

        var existing = progress.findByUserIdForUpdate(user.getId());
        if (existing.isEmpty()) {
            if (request.expectedRevision() != 0) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "Прогресс на сервере изменился. Обнови данные перед сохранением.");
            }
            UserProgress created = progress.save(new UserProgress(user, request.state()));
            return Map.of("saved", true, "revision", created.getRevision(), "updatedAt", created.getUpdatedAt().toString());
        }

        UserProgress current = existing.get();
        if (current.getRevision() != request.expectedRevision()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Прогресс открыт на другом устройстве и уже изменился. Сначала загрузи актуальную копию.");
        }
        current.update(request.state());
        progress.save(current);
        return Map.of("saved", true, "revision", current.getRevision(), "updatedAt", current.getUpdatedAt().toString());
    }

    private UserAccount currentUser(UserDetails principal) {
        return users.findByUsernameIgnoreCase(principal.getUsername())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));
    }

    public record ProgressWriteRequest(long expectedRevision, @NotNull JsonNode state) {}
}
