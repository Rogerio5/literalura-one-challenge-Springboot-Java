package br.com.literalura.repository;

import br.com.literalura.model.Autor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AutorRepository extends JpaRepository<Autor, Long> {
    // Aqui você pode adicionar consultas personalizadas se precisar
    // Exemplo: List<Autor> findByAnoNascimento(Integer ano);
}




