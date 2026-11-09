package br.com.literalura;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class RequestIdLoggingFilterTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void deveGerarIdentificadorUnicoPorRequisicao() throws Exception {

        String primeiro = mockMvc.perform(get("/autores"))
                .andExpect(status().isOk())
                .andReturn().getResponse()
                .getHeader("X-Request-ID");

        String segundo = mockMvc.perform(get("/livros"))
                .andExpect(status().isOk())
                .andReturn().getResponse()
                .getHeader("X-Request-ID");

        assertNotNull(primeiro);
        assertNotNull(segundo);

        assertDoesNotThrow(() -> UUID.fromString(primeiro));
        assertDoesNotThrow(() -> UUID.fromString(segundo));

        assertNotEquals(primeiro, segundo);
    }

    @Test
    void naoDeveConfiarEmIdentificadorEnviadoPeloCliente() throws Exception {

        String recebido = mockMvc.perform(
                    get("/autores")
                        .header("X-Request-ID", "identificador-externo")
                )
                .andExpect(status().isOk())
                .andReturn().getResponse()
                .getHeader("X-Request-ID");

        assertNotNull(recebido);
        assertNotEquals("identificador-externo", recebido);
        assertDoesNotThrow(() -> UUID.fromString(recebido));
    }
}
