package br.com.literalura.kafka;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Profile;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
@Profile("docker")
@ConditionalOnProperty(name = "literalura.kafka.enabled", havingValue = "true")
public class LivroCriadoConsumer {

    private static final Logger log =
            LoggerFactory.getLogger(LivroCriadoConsumer.class);

    private final ObjectMapper objectMapper;

    public LivroCriadoConsumer(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    @KafkaListener(
        topics = "literalura.livros.criados",
        groupId = "literalura-v23"
    )
    public void consumir(String mensagem) throws Exception {
        LivroCriadoEvent evento =
                objectMapper.readValue(mensagem, LivroCriadoEvent.class);

        log.info("kafka_event_consumed livroId={}", evento.id());
    }
}
