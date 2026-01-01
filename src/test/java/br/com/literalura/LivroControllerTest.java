package br.com.literalura;

import br.com.literalura.model.Autor;
import br.com.literalura.repository.AutorRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.test.context.ActiveProfiles;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@ActiveProfiles("test")   // força o uso do application-test.properties com H2
class AutorServiceTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private AutorRepository repository;

    @Test
    void deveCadastrarAutor() {
        Autor autor = new Autor(null, "Machado de Assis", 1839, 1908);
        Autor salvo = repository.save(autor);

        assertThat(salvo.getId()).isNotNull();
        assertThat(salvo.getNome()).isEqualTo("Machado de Assis");
    }

    @Test
    void deveBuscarAutorPorId() {
        Autor autor = new Autor(null, "José de Alencar", 1829, 1877);
        entityManager.persist(autor);

        Optional<Autor> encontrado = repository.findById(autor.getId());

        assertThat(encontrado).isPresent();
        assertThat(encontrado.get().getNome()).isEqualTo("José de Alencar");
    }

    @Test
    void deveAtualizarAutor() {
        Autor autor = new Autor(null, "Monteiro", 1882, 1948);
        entityManager.persist(autor);

        autor.setNome("Monteiro Lobato");
        Autor atualizado = repository.save(autor);

        assertThat(atualizado.getNome()).isEqualTo("Monteiro Lobato");
    }

    @Test
    void deveExcluirAutor() {
        Autor autor = new Autor(null, "Autor Temporário", 1900, 1950);
        entityManager.persist(autor);

        repository.deleteById(autor.getId());

        Optional<Autor> excluido = repository.findById(autor.getId());
        assertThat(excluido).isEmpty();
    }
}
