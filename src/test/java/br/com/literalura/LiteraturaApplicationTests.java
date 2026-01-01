package br.com.literalura;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("test")   // força o uso do application-test.properties
class LiteraturaApplicationTests {

    @Test
    void contextLoads() {
        // Verifica se o contexto Spring Boot carrega corretamente
    }
}



