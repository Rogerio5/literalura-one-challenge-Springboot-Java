package br.com.literalura.kafka;

public record LivroCriadoEvent(
        Long id,
        String titulo,
        Integer anoPublicacao
) {}
