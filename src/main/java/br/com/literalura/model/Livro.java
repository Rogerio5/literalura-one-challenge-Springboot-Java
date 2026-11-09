package br.com.literalura.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Livro {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "O título do livro é obrigatório")
    @Size(min = 2, max = 200, message = "O título deve ter entre 2 e 200 caracteres")
    private String titulo;

    @NotNull(message = "O ano de publicação deve ser informado")
    @Min(value = 1000, message = "Ano de publicação deve ser maior que 1000")
    @Max(value = 2025, message = "Ano de publicação não pode ser maior que o ano atual")
    private Integer anoPublicacao;

    // Relacionamento: muitos livros podem ter um autor
    @ManyToOne
    @JoinColumn(name = "autor_id", nullable = false)
    private Autor autor;
}




