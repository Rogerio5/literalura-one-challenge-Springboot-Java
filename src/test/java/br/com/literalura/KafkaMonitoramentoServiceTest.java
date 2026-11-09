package br.com.literalura;

import br.com.literalura.kafka.KafkaMonitoramentoService;
import br.com.literalura.kafka.LivroCriadoEvent;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class KafkaMonitoramentoServiceTest {

    @Test
    void deveRegistrarPublicacaoEConsumoDoMesmoLivro() {
        KafkaMonitoramentoService monitoramento = new KafkaMonitoramentoService();
        LivroCriadoEvent livro = new LivroCriadoEvent(2L, "Dom Casmurro", 1899);

        monitoramento.registrar("PUBLICADO", livro);
        monitoramento.registrar("CONSUMIDO", livro);

        assertThat(monitoramento.listar()).hasSize(2);
        assertThat(monitoramento.listar().get(0).status()).isEqualTo("CONSUMIDO");
        assertThat(monitoramento.listar().get(1).status()).isEqualTo("PUBLICADO");
        assertThat(monitoramento.listar().get(0).livroId()).isEqualTo(2L);
    }

    @Test
    void deveManterSomenteCemEventosMaisRecentes() {
        KafkaMonitoramentoService monitoramento = new KafkaMonitoramentoService();
        for (long id = 1; id <= 105; id++) {
            monitoramento.registrar("PUBLICADO", new LivroCriadoEvent(id, "Livro " + id, 2020));
        }
        assertThat(monitoramento.listar()).hasSize(100);
        assertThat(monitoramento.listar().get(0).livroId()).isEqualTo(105L);
        assertThat(monitoramento.listar().get(99).livroId()).isEqualTo(6L);
    }
}
