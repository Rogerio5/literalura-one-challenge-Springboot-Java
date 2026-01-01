# 📚 literalura-one-challenge-Springboot-Java
Catálogo de livros em Java com Spring Boot, consumindo a API Gutendex e persistindo em PostgreSQL

## 🚀 Projeto Prático em Java + Spring Boot  
### 🗄️ JPA/Hibernate + 🌐 Swagger/OpenAPI + 🧪 Testes Unitários (JUnit 5)  

![Capa do Projeto](Literalura.png)

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
