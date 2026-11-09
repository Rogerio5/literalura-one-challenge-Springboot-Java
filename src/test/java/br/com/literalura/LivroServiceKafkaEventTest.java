package br.com.literalura;

import br.com.literalura.kafka.LivroCriadoEvent;
import br.com.literalura.model.Autor;
import br.com.literalura.model.Livro;
import br.com.literalura.repository.LivroRepository;
import br.com.literalura.service.LivroService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.context.ApplicationEventPublisher;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class LivroServiceKafkaEventTest {

    @Mock
    private LivroRepository repository;

    @Mock
    private ApplicationEventPublisher eventos;

    @InjectMocks
    private LivroService service;

    @Test
    void deveEmitirEventoAoCadastrarLivro() {
        Autor autor = new Autor(1L, "Machado de Assis", 1839, 1908);
        Livro livro = new Livro(null, "Dom Casmurro", 1899, autor);
        Livro salvo = new Livro(21L, "Dom Casmurro", 1899, autor);

        when(repository.save(livro)).thenReturn(salvo);

        Livro resultado = service.salvar(livro);

        ArgumentCaptor<LivroCriadoEvent> captor =
                ArgumentCaptor.forClass(LivroCriadoEvent.class);

        verify(eventos).publishEvent(captor.capture());

        assertThat(resultado.getId()).isEqualTo(21L);
        assertThat(captor.getValue().id()).isEqualTo(21L);
        assertThat(captor.getValue().titulo()).isEqualTo("Dom Casmurro");
        assertThat(captor.getValue().anoPublicacao()).isEqualTo(1899);
    }

    @Test
    void naoDeveEmitirEventoQuandoSalvarFalhar() {
        Livro livro = new Livro(
                null, "Livro de Teste", 2020,
                new Autor(1L, "Autor Teste", 1900, 1970)
        );

        when(repository.save(any(Livro.class)))
                .thenThrow(new IllegalStateException("Falha simulada"));

        assertThatThrownBy(() -> service.salvar(livro))
                .isInstanceOf(IllegalStateException.class);

        verifyNoInteractions(eventos);
    }
}
