package br.com.literalura.controller;

import br.com.literalura.dto.AutorDTO;
import br.com.literalura.model.Autor;
import br.com.literalura.service.AutorService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/autores")
public class AutorController {

    @Autowired
    private AutorService service;

    // Cadastrar novo autor
    @PostMapping
    public ResponseEntity<AutorDTO> cadastrar(@Valid @RequestBody Autor autor) {
        Autor salvo = service.salvar(autor);
        return ResponseEntity.status(201).body(new AutorDTO(salvo));
    }

    // Listar todos os autores
    @GetMapping
    public List<AutorDTO> listar() {
        return service.listarTodos()
                .stream()
                .map(AutorDTO::new)
                .toList();
    }

    // Buscar autor por ID
    @GetMapping("/{id}")
    public ResponseEntity<AutorDTO> buscarPorId(@PathVariable Long id) {
        Optional<Autor> autor = service.buscarPorId(id);
        return autor.map(value -> ResponseEntity.ok(new AutorDTO(value)))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Atualizar autor por ID
    @PutMapping("/{id}")
    public ResponseEntity<AutorDTO> atualizar(@PathVariable Long id, @Valid @RequestBody Autor autorAtualizado) {
        Optional<Autor> autorExistente = service.buscarPorId(id);

        if (autorExistente.isPresent()) {
            Autor autor = autorExistente.get();
            autor.setNome(autorAtualizado.getNome());
            autor.setAnoNascimento(autorAtualizado.getAnoNascimento());
            autor.setAnoFalecimento(autorAtualizado.getAnoFalecimento());

            Autor salvo = service.atualizar(autor);
            return ResponseEntity.ok(new AutorDTO(salvo));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Excluir autor por ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        Optional<Autor> autor = service.buscarPorId(id);
        if (autor.isPresent()) {
            service.excluir(id);
            return ResponseEntity.noContent().build(); // 204 No Content
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}


