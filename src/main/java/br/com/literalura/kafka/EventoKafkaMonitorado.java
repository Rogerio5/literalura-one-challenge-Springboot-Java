package br.com.literalura.kafka;

import java.time.Instant;

public record EventoKafkaMonitorado(
        long id,
        Long livroId,
        String titulo,
        String status,
        String topico,
        Instant ocorridoEm
) {}
