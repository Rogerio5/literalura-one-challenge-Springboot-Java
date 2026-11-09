# LiterAlura V2.3 — Apache Kafka

## Objetivo

Implementar mensageria assincrona para eventos de cadastro de livros.

## Tecnologias

- Java 17
- Spring Boot 3.2.5
- Spring Kafka
- Apache Kafka 3.9.1 (KRaft)
- PostgreSQL 17
- Docker Compose
- JUnit 5 e Mockito

## Fluxo

1. A API recebe POST /livros.
2. LivroService salva o livro no PostgreSQL.
3. Um evento LivroCriadoEvent e emitido.
4. Apos o commit da transacao, o Producer envia o evento.
5. O broker Kafka armazena a mensagem no topico.
6. O Consumer recebe o evento e registra seu processamento.

## Topico

literalura.livros.criados

## Enderecos de desenvolvimento

- API: http://localhost:8081
- Kafka no host: localhost:19094
- Kafka na rede Docker: kafka:19092
- Grafana: http://localhost:3002
- Prometheus: http://localhost:9091

## Validacao manual realizada

- API health: PASS
- Cadastro de autor: PASS
- Cadastro de livro: PASS
- Publicacao automatica: PASS
- Consumo automatico: PASS

## Arquivos principais

- kafka/LivroCriadoEvent.java
- kafka/LivroCriadoProducer.java
- kafka/LivroCriadoConsumer.java
- service/LivroService.java
- compose.kafka.yaml

## Observacoes

A integracao e uma implementacao inicial para desenvolvimento local.
A entrega garantida entre PostgreSQL e Kafka pode ser aprimorada
posteriormente utilizando Transactional Outbox.
