package br.com.literalura.observability;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class RequestIdLoggingFilter extends OncePerRequestFilter {

    private static final Logger log =
            LoggerFactory.getLogger(RequestIdLoggingFilter.class);

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        return request.getServletPath().startsWith("/actuator");
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain chain
    ) throws ServletException, IOException {

        String requestId = UUID.randomUUID().toString();
        long inicio = System.nanoTime();

        MDC.put("requestId", requestId);
        response.setHeader("X-Request-ID", requestId);

        try {
            chain.doFilter(request, response);
        } finally {
            long duracaoMs = TimeUnit.NANOSECONDS.toMillis(
                    System.nanoTime() - inicio
            );

            String metodo = request.getMethod();
            String rota = normalizarRota(request.getServletPath());
            int status = response.getStatus();

            if (status >= 500) {
                log.error(
                    "request_completed method={} route={} status={} durationMs={}",
                    metodo, rota, status, duracaoMs
                );
            } else if (status >= 400) {
                log.warn(
                    "request_completed method={} route={} status={} durationMs={}",
                    metodo, rota, status, duracaoMs
                );
            } else {
                log.info(
                    "request_completed method={} route={} status={} durationMs={}",
                    metodo, rota, status, duracaoMs
                );
            }

            MDC.remove("requestId");
        }
    }

    private String normalizarRota(String caminho) {
        if (caminho.equals("/autores") || caminho.equals("/livros")) {
            return caminho;
        }

        if (caminho.matches("/(autores|livros)/[0-9]+")) {
            return caminho.replaceAll("/[0-9]+$", "/{id}");
        }

        return "other";
    }
}
