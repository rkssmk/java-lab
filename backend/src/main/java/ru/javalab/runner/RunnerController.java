package ru.javalab.runner;

import tools.jackson.databind.JsonNode;
import tools.jackson.databind.json.JsonMapper;
import tools.jackson.databind.node.ObjectNode;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import ru.javalab.config.AppProperties;

/** Server-side proxy. Browser code is never sent directly to a third-party Judge0 host. */
@RestController
@RequestMapping("/api/runner")
public class RunnerController {
    private final AppProperties properties;
    private final JsonMapper mapper;
    private final HttpClient client = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(3))
            .followRedirects(HttpClient.Redirect.NEVER)
            .build();

    public RunnerController(AppProperties properties, JsonMapper mapper) {
        this.properties = properties;
        this.mapper = mapper;
    }

    @GetMapping("/languages/{id}")
    public ResponseEntity<String> language(@PathVariable int id) {
        if (id != 62) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Разрешён только профиль Java.");
        return forward("GET", "/languages/62", null);
    }

    @PostMapping(value = {"/submissions", "/submissions/"}, consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> submit(@RequestBody JsonNode incoming) {
        String source = incoming.path("source_code").asText("");
        String stdin = incoming.path("stdin").asText("");
        if (source.isBlank() || source.length() > 30000 || stdin.length() > 30000) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Код пустой или превышает допустимый размер 30 000 символов.");
        }
        ObjectNode safe = mapper.createObjectNode();
        safe.put("source_code", source);
        safe.put("language_id", 62);
        safe.put("stdin", stdin);
        // Limits are enforced here, not trusted from the browser.
        safe.put("cpu_time_limit", 2);
        safe.put("wall_time_limit", 6);
        safe.put("memory_limit", 128000);
        safe.put("max_processes_and_or_threads", 20);
        safe.put("enable_network", false);
        return forward("POST", "/submissions?base64_encoded=false&wait=false", safe.toString());
    }

    @GetMapping("/submissions/{token}")
    public ResponseEntity<String> result(@PathVariable String token) {
        if (!token.matches("[A-Za-z0-9-]{20,100}")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Некорректный идентификатор запуска.");
        }
        return forward("GET", "/submissions/" + token + "?base64_encoded=false", null);
    }

    private ResponseEntity<String> forward(String method, String path, String body) {
        var runner = properties.runner();
        if (runner == null || !runner.enabled() || runner.baseUrl() == null || runner.baseUrl().isBlank()) {
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE,
                    "Локальный Java Runner ещё не подключён. В публичном режиме отправка кода внешним сервисам отключена.");
        }
        try {
            URI uri = URI.create(runner.baseUrl().replaceAll("/+$", "") + path);
            HttpRequest.Builder builder = HttpRequest.newBuilder(uri).timeout(Duration.ofSeconds(8))
                    .header("Accept", "application/json");
            if (runner.authToken() != null && !runner.authToken().isBlank()) {
                builder.header("X-Auth-Token", runner.authToken());
            }
            if ("POST".equals(method)) {
                builder.header("Content-Type", "application/json")
                        .POST(HttpRequest.BodyPublishers.ofString(body == null ? "{}" : body));
            } else {
                builder.GET();
            }
            HttpResponse<String> response = client.send(builder.build(), HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() >= 500) {
                throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Внутренний исполнитель Java временно недоступен.");
            }
            return ResponseEntity.status(response.statusCode())
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(response.body());
        } catch (ResponseStatusException ex) {
            throw ex;
        } catch (Exception ex) {
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Не удалось связаться с внутренним исполнителем Java.");
        }
    }
}
