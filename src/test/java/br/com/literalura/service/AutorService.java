package br.com.literalura.service;

import br.com.literalura.model.Autor;
import br.com.literalura.repository.AutorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AutorService {

    @Autowired
    private AutorRepository repository;

    public Autor salvar(Autor autor) { return repository.save(autor); }
    public List<Autor> listarTodos() { return repository.findAll(); }
    public Optional<Autor> buscarPorId(Long id) { return repository.findById(id); }
    public Autor atualizar(Autor autor) { return repository.save(autor); }
    public void excluir(Long id) { repository.deleteById(id); }
}

