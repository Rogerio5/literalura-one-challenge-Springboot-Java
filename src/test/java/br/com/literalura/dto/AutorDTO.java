package br.com.literalura.dto;

import br.com.literalura.model.Autor;

public record AutorDTO(Long id, String nome, Integer anoNascimento, Integer anoFalecimento) {
    public AutorDTO(Autor autor) {
        this(autor.getId(), autor.getNome(), autor.getAnoNascimento(), autor.getAnoFalecimento());
    }
}
