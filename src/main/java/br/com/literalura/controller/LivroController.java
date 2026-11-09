package br.com.literalura.controller;

import br.com.literalura.dto.LivroDTO;
import br.com.literalura.model.Livro;
import br.com.literalura.service.LivroService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/livros")
public class LivroController {

    @Autowired
    private LivroService service;

    @PostMapping
    public ResponseEntity<LivroDTO> cadastrar(@Valid @RequestBody Livro livro) {
        Livro salvo = service.salvar(livro);
        return ResponseEntity.status(201).body(new LivroDTO(salvo));
    }

    @GetMapping
    public List<LivroDTO> listar() {
        return service.listarTodos().stream().map(LivroDTO::new).toList();
    }

    @GetMapping("/{id}")
    public ResponseEntity<LivroDTO> buscarPorId(@PathVariable Long id) {
        Optional<Livro> livro = service.buscarPorId(id);
        return livro.map(value -> ResponseEntity.ok(new LivroDTO(value)))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<LivroDTO> atualizar(@PathVariable Long id, @Valid @RequestBody Livro livroAtualizado) {
        Optional<Livro> livroExistente = service.buscarPorId(id);
        if (livroExistente.isPresent()) {
            Livro livro = livroExistente.get();
            livro.setTitulo(livroAtualizado.getTitulo());
            livro.setAutor(livroAtualizado.getAutor());
            livro.setAnoPublicacao(livroAtualizado.getAnoPublicacao());
            Livro salvo = service.atualizar(livro);
            return ResponseEntity.ok(new LivroDTO(salvo));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        Optional<Livro> livro = service.buscarPorId(id);
        if (livro.isPresent()) {
            service.excluir(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}





