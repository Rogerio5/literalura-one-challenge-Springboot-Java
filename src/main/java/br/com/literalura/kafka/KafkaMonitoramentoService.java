package br.com.literalura.kafka;

import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Deque;
import java.util.List;

@Service
public class KafkaMonitoramentoService {

    private static final int LIMITE = 100;
    private static final String TOPICO = "literalura.livros.criados";

    private final Deque<EventoKafkaMonitorado> eventos = new ArrayDeque<>();
    private long sequencia = 0;

    public synchronized void registrar(String status, LivroCriadoEvent livro) {
        if (!List.of("PUBLICADO", "CONSUMIDO", "FALHA_ENVIO").contains(status)) {
            throw new IllegalArgumentException("Status de monitoramento desconhecido");
        }

        eventos.addFirst(new EventoKafkaMonitorado(
                ++sequencia,
                livro.id(),
                livro.titulo(),
                status,
                TOPICO,
                Instant.now()
        ));

        while (eventos.size() > LIMITE) {
            eventos.removeLast();
        }
    }

    public synchronized List<EventoKafkaMonitorado> listar() {
        return new ArrayList<>(eventos);
    }
}
