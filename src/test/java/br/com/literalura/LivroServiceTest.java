package br.com.literalura;

import br.com.literalura.model.Autor;
import br.com.literalura.model.Livro;
import br.com.literalura.repository.LivroRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.test.context.ActiveProfiles;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@ActiveProfiles("test")
class LivroServiceTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private LivroRepository repository;

    @Test
    void deveCadastrarLivro() {
        Autor autor = new Autor(null, "Machado de Assis", 1839, 1908);
        entityManager.persist(autor);

        Livro livro = new Livro(null, "Dom Casmurro", 1899, autor);
        Livro salvo = repository.save(livro);

        assertThat(salvo.getId()).isNotNull();
        assertThat(salvo.getTitulo()).isEqualTo("Dom Casmurro");
        assertThat(salvo.getAutor().getNome()).isEqualTo("Machado de Assis");
    }
}
