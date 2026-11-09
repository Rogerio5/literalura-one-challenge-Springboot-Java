package br.com.literalura.repository;

import br.com.literalura.model.Livro;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LivroRepository extends JpaRepository<Livro, Long> {
    // Aqui também pode adicionar consultas personalizadas
    // Exemplo: List<Livro> findByAutor(String autor);
}


