package br.com.literalura.dto;

import br.com.literalura.model.Livro;

public record LivroDTO(Long id, String titulo, Integer anoPublicacao, AutorDTO autor) {
    public LivroDTO(Livro livro) {
        this(livro.getId(), livro.getTitulo(), livro.getAnoPublicacao(), new AutorDTO(livro.getAutor()));
    }
}


