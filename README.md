# 📚 literalura-one-challenge-Springboot-Java
Catálogo de livros em Java com Spring Boot, consumindo a API Gutendex e persistindo em PostgreSQL

## 🚀 Projeto Prático em Java + Spring Boot  
### 🗄️ JPA/Hibernate + 🌐 Swagger/OpenAPI + 🧪 Testes Unitários (JUnit 5)  

![Capa do Projeto](assets/Literalura.png)

---

## 🏅 Badges  

![GitHub repo size](https://img.shields.io/github/repo-size/Rogerio5/Literalura)  
![GitHub license](https://img.shields.io/github/license/Rogerio5/Literalura)  
![Java](https://img.shields.io/badge/java-17-orange)  
![Spring Boot](https://img.shields.io/badge/spring--boot-3.2.5-green)  
![JUnit](https://img.shields.io/badge/junit-5-blue)  
![Status](https://img.shields.io/badge/status-active-success)  

---

## 📑 Índice / Table of Contents  

- [📖 Descrição / Description](#-descrição--description)  
- [📌 Status do Projeto / Project Status](#-status-do-projeto--project-status)  
- [⚙️ Estrutura / Structure](#️-estrutura--structure)  
- [🧪 Testes / Tests](#-testes--tests)  
- [▶️ Execução / Run Instructions](#️-execução--run-instructions)  
- [🧰 Tecnologias / Technologies](#-tecnologias--technologies)  
- [👨‍💻 Desenvolvedor / Developer](#-desenvolvedor--developer)  
- [📜 Licença / License](#-licença--license)  
- [🏁 Conclusão / Conclusion](#-conclusão--conclusion)  

---

## 📖 Descrição / Description  

**PT:**  
Este projeto prático em **Java com Spring Boot** implementa o sistema **LiterAlura**, que:  
- Gerencia **Autores** e **Livros** com persistência via JPA/Hibernate.  
- Expõe uma **API REST** documentada com **Swagger/OpenAPI**.  
- Permite alternar entre **H2 em memória** (para testes rápidos) e **PostgreSQL** (para persistência real).  
- Inclui **testes unitários e de integração com JUnit 5**.  

**EN:**  
This practical **Java Spring Boot project** implements the **LiterAlura system**, which:  
- Manages **Authors** and **Books** with persistence via JPA/Hibernate.  
- Exposes a **REST API** documented with **Swagger/OpenAPI**.  
- Allows switching between **H2 in-memory** (for quick tests) and **PostgreSQL** (for real persistence).  
- Includes **JUnit 5 unit and integration tests**.  

---

## 📌 Status do Projeto / Project Status  

![Status](https://img.shields.io/badge/STATUS-Completed-success?style=for-the-badge)  

**PT:**  
Este projeto está **concluído e funcional**.  

**EN:**  
This project is **completed and functional**.  

---

## ⚙️ Estrutura / Structure  

```text
Literalura/
 ├── src/main/java/br/com/literalura/   # Código principal
 │    ├── LiteraturaApplication.java    # Classe principal
 │    ├── model/                        # Entidades JPA (Autor, Livro)
 │    ├── repository/                   # Repositórios JPA
 │    ├── service/                      # Regras de negócio
 │    └── controller/                   # Endpoints REST
 │
 ├── src/main/resources/                # Configurações
 │    ├── application.properties        # Perfil ativo
 │    ├── application-h2.properties     # Configuração H2
 │    └── application-postgres.properties # Configuração PostgreSQL
 │
 ├── src/test/java/br/com/literalura/   # Testes unitários e integração
 │    ├── AutorServiceTest.java
 │    ├── LivroServiceTest.java
 │    └── AutorLivroIntegrationTest.java
 │
 └── README.md                          # Documentação
```

---

## 🧪 Testes / Tests

Foram implementados testes unitários e de integração cobrindo:

✅ Cadastro de autores
✅ Cadastro de livros vinculados a autores
✅ Busca de autores e livros
✅ Cenários de erro (autor não encontrado, livro inexistente)

📌 Resultado esperado: todos os testes passam com sucesso ✅

---

## ▶️ Execução / Run Instructions
PT:

Usando H2 (rápido para testar Swagger)
1. Certifique-se de que o perfil ativo é h2:
```
spring.profiles.active=h2
```
no arquivo application.properties

2. Rode:
```
mvn clean install
mvn spring-boot:run
```

3. Acesse:
```
Swagger UI: http://localhost:8080/swagger-ui/index.html

OpenAPI JSON: http://localhost:8080/v3/api-docs
```
---

## Usando PostgreSQL (persistência real)

1. Configure o banco local ou Supabase.
2. Ative o perfil postgres:
```
spring.profiles.active=postgres
```
3. spring.profiles.active=postgres

---

## 🧰 Tecnologias / Technologies

<p align="left">
<img alt="Java" title="Java 17" width="50px" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg"/>
<img alt="Spring Boot" title="Spring Boot 3.2.5" width="50px" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg"/>
<img align="left" alt="PostgreSQL" title="PostgreSQL" width="30px" src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg"/>
<img alt="Postman" title="Postman" width="50px" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postman/postman-original.svg"/>
<img alt="Hibernate" title="Hibernate JPA" width="50px" src="https://img.shields.io/badge/Hibernate-JPA-blue"/>
<img alt="Swagger" title="Swagger OpenAPI" width="50px" src="https://img.shields.io/badge/Swagger-OpenAPI-green"/>
<img alt="JUnit5" title="JUnit 5" width="50px" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/junit/junit-original.svg"/>
<img alt="Git" title="Git" width="50px" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg"/>
<img alt="GitHub" title="GitHub" width="50px" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg"/>
</p>

---

## 👨‍💻 Desenvolvedor / Developer

- [Rogerio](https://github.com/Rogerio5)

---

##  📜 Licença / License

Este projeto está sob licença MIT. Para mais detalhes, veja o arquivo LICENSE.

This project is under the MIT license. For more details, see the LICENSE file.

---

## 🏁 Conclusão / Conclusion
PT:  
Este projeto consolida meu aprendizado em Java e Spring Boot, integrando JPA/Hibernate, consumo de banco de dados, documentação com Swagger e testes unitários. Ele demonstra boas práticas de organização de código e serve como base para projetos mais complexos.

EN:  
This project consolidates my learning in Java and Spring Boot, integrating JPA/Hibernate, database usage, Swagger documentation, and unit testing. It demonstrates good coding practices and serves as a foundation for more complex projects.





