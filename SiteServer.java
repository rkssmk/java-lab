import com.sun.net.httpserver.Headers;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpServer;

import java.io.IOException;
import java.net.InetSocketAddress;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Map;

/** Small local static-file server so browser APIs work from http://localhost. */
public class SiteServer {
    private static final int PORT = 8765;
    private static final Path ROOT = Path.of("public").toAbsolutePath().normalize();
    private static final Map<String, String> MIME = Map.ofEntries(
        Map.entry(".html", "text/html; charset=utf-8"),
        Map.entry(".css", "text/css; charset=utf-8"),
        Map.entry(".js", "application/javascript; charset=utf-8"),
        Map.entry(".json", "application/json; charset=utf-8"),
        Map.entry(".webmanifest", "application/manifest+json; charset=utf-8"),
        Map.entry(".svg", "image/svg+xml")
    );

    public static void main(String[] args) throws IOException {
        HttpServer server = HttpServer.create(new InetSocketAddress("127.0.0.1", PORT), 0);
        server.createContext("/", SiteServer::handle);
        server.setExecutor(null);
        server.start();
        System.out.println("Java Lab открыт: http://127.0.0.1:" + PORT);
        System.out.println("Не закрывай это окно, пока пользуешься сайтом. Для остановки нажми Ctrl+C.");
    }

    private static void handle(HttpExchange exchange) throws IOException {
        String method = exchange.getRequestMethod();
        if (!method.equals("GET") && !method.equals("HEAD")) {
            exchange.sendResponseHeaders(405, -1);
            exchange.close();
            return;
        }

        String requested = exchange.getRequestURI().getPath();
        if (requested == null || requested.equals("/")) requested = "/index.html";
        Path file = ROOT.resolve(requested.substring(1)).normalize();
        if (!file.startsWith(ROOT) || !Files.isRegularFile(file)) {
            byte[] body = "Not found".getBytes();
            exchange.sendResponseHeaders(404, body.length);
            exchange.getResponseBody().write(body);
            exchange.close();
            return;
        }

        String name = file.getFileName().toString();
        int dot = name.lastIndexOf('.');
        String extension = dot >= 0 ? name.substring(dot) : "";
        Headers headers = exchange.getResponseHeaders();
        headers.set("Content-Type", MIME.getOrDefault(extension, "application/octet-stream"));
        headers.set("Cache-Control", "no-store");
        headers.set("X-Content-Type-Options", "nosniff");
        long length = Files.size(file);
        if (method.equals("HEAD")) {
            exchange.sendResponseHeaders(200, -1);
        } else {
            exchange.sendResponseHeaders(200, length);
            try (var output = exchange.getResponseBody()) {
                Files.copy(file, output);
            }
        }
        exchange.close();
    }
}
