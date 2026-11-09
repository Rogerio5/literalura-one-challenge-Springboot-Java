package br.com.literalura.service;

import br.com.literalura.model.Livro;
import br.com.literalura.repository.LivroRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class LivroService {

    @Autowired
    private LivroRepository repository;

    public Livro salvar(Livro livro) { return repository.save(livro); }
    public List<Livro> listarTodos() { return repository.findAll(); }
    public Optional<Livro> buscarPorId(Long id) { return repository.findById(id); }
    public Livro atualizar(Livro livro) { return repository.save(livro); }
    public void excluir(Long id) { repository.deleteById(id); }
}


