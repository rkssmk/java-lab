package ru.javalab.auth;

import java.time.Duration;
import java.time.Instant;
import java.util.ArrayDeque;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;
import org.springframework.stereotype.Component;

/**
 * Per-process throttling fallback. Keep the map bounded; a reverse-proxy or WAF
 * rate limit should also be configured before public launch.
 */
@Component
public class AuthRateLimiter {
    private static final int MAX_ATTEMPTS = 8;
    private static final int MAX_KEYS = 20_000;
    private static final Duration WINDOW = Duration.ofMinutes(10);
    private static final Duration CLEANUP_INTERVAL = Duration.ofMinutes(1);

    private final Map<String, ArrayDeque<Instant>> attempts = new ConcurrentHashMap<>();
    private final AtomicLong lastCleanupMillis = new AtomicLong(0);

    public boolean allowed(String key) {
        ArrayDeque<Instant> queue = bucket(key, true);
        if (queue == null) return false; // Fail closed if the bounded map is full.
        synchronized (queue) {
            prune(queue, Instant.now().minus(WINDOW));
            return queue.size() < MAX_ATTEMPTS;
        }
    }

    public void failed(String key) {
        ArrayDeque<Instant> queue = bucket(key, true);
        if (queue == null) return;
        synchronized (queue) {
            Instant now = Instant.now();
            prune(queue, now.minus(WINDOW));
            if (queue.size() < MAX_ATTEMPTS) queue.addLast(now);
        }
    }

    public void succeeded(String key) {
        attempts.remove(key);
    }

    private ArrayDeque<Instant> bucket(String key, boolean create) {
        ArrayDeque<Instant> existing = attempts.get(key);
        if (existing != null || !create) {
            maybeCleanup();
            return existing;
        }
        maybeCleanup();
        existing = attempts.get(key);
        if (existing != null) return existing;
        if (attempts.size() >= MAX_KEYS) return null;
        return attempts.computeIfAbsent(key, ignored -> new ArrayDeque<>());
    }

    private void maybeCleanup() {
        long now = System.currentTimeMillis();
        long previous = lastCleanupMillis.get();
        if (now - previous < CLEANUP_INTERVAL.toMillis()
                || !lastCleanupMillis.compareAndSet(previous, now)) return;
        Instant cutoff = Instant.now().minus(WINDOW);
        attempts.entrySet().removeIf(entry -> {
            ArrayDeque<Instant> queue = entry.getValue();
            synchronized (queue) {
                prune(queue, cutoff);
                return queue.isEmpty();
            }
        });
    }

    private static void prune(ArrayDeque<Instant> queue, Instant cutoff) {
        while (!queue.isEmpty() && queue.peekFirst().isBefore(cutoff)) queue.removeFirst();
    }
}
