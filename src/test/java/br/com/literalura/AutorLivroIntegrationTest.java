package br.com.literalura;

import br.com.literalura.model.Autor;
import br.com.literalura.model.Livro;
import br.com.literalura.repository.AutorRepository;
import br.com.literalura.repository.LivroRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class AutorLivroIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private AutorRepository autorRepository;

    @Autowired
    private LivroRepository livroRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void deveCadastrarAutorELivroVinculado() throws Exception {
        // Limpa os repositórios
        autorRepository.deleteAll();
        livroRepository.deleteAll();

        // 1. Cadastrar Autor
        Autor autor = new Autor(null, "Machado de Assis", 1839, 1908);
        String autorJson = objectMapper.writeValueAsString(autor);

        String autorResponse = mockMvc.perform(post("/autores")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(autorJson))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.nome").value("Machado de Assis"))
                .andReturn()
                .getResponse()
                .getContentAsString();

        Autor autorSalvo = objectMapper.readValue(autorResponse, Autor.class);

        // 2. Cadastrar Livro vinculado ao Autor
        Livro livro = new Livro(null, "Dom Casmurro", 1899, autorSalvo);
        String livroJson = objectMapper.writeValueAsString(livro);

        mockMvc.perform(post("/livros")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(livroJson))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.titulo").value("Dom Casmurro"))
                .andExpect(jsonPath("$.anoPublicacao").value(1899))
                .andExpect(jsonPath("$.autor.nome").value("Machado de Assis"));
    }
}

