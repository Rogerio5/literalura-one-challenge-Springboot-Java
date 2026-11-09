package br.com.literalura.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

@Entity
@Data // Gera todos os getters, setters, equals, hashCode e toString
@NoArgsConstructor
@AllArgsConstructor
public class Autor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "O nome do autor é obrigatório")
    @Size(min = 2, max = 100, message = "O nome do autor deve ter entre 2 e 100 caracteres")
    private String nome;

    @NotNull(message = "O ano de nascimento deve ser informado")
    @Min(value = 1000, message = "Ano de nascimento deve ser maior que 1000")
    @Max(value = 2025, message = "Ano de nascimento não pode ser maior que o ano atual")
    private Integer anoNascimento;

    @Min(value = 1000, message = "Ano de falecimento deve ser maior que 1000")
    @Max(value = 2025, message = "Ano de falecimento não pode ser maior que o ano atual")
    private Integer anoFalecimento;

    @AssertTrue(message = "Ano de falecimento deve ser maior que ano de nascimento")
    public boolean isFalecimentoValido() {
        if (anoFalecimento == null) return true;
        return anoFalecimento > anoNascimento;
    }
}




