package br.com.literalura.kafka;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Profile;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

@Component
@Profile("docker")
@ConditionalOnProperty(name = "literalura.kafka.enabled", havingValue = "true")
public class LivroCriadoProducer {

    private static final Logger log =
            LoggerFactory.getLogger(LivroCriadoProducer.class);

    private static final String TOPICO = "literalura.livros.criados";

    private final KafkaTemplate<String, String> kafkaTemplate;
    private final ObjectMapper objectMapper;
    private final KafkaMonitoramentoService monitoramento;

    public LivroCriadoProducer(
            KafkaTemplate<String, String> kafkaTemplate,
            ObjectMapper objectMapper,
            KafkaMonitoramentoService monitoramento) {
        this.kafkaTemplate = kafkaTemplate;
        this.objectMapper = objectMapper;
        this.monitoramento = monitoramento;
    }

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void publicar(LivroCriadoEvent evento) {
        try {
            String json = objectMapper.writeValueAsString(evento);

            kafkaTemplate.send(TOPICO, String.valueOf(evento.id()), json)
                    .whenComplete((resultado, erro) -> {
                        if (erro != null) {
                            log.error("kafka_publish_failed livroId={}", evento.id(), erro);
                            monitoramento.registrar("FALHA_ENVIO", evento);
                        } else {
                            log.info("kafka_event_published livroId={}", evento.id());
                            monitoramento.registrar("PUBLICADO", evento);
                        }
                    });
        } catch (Exception erro) {
            log.error("kafka_publish_failed livroId={}", evento.id(), erro);
            monitoramento.registrar("FALHA_ENVIO", evento);
        }
    }
}
