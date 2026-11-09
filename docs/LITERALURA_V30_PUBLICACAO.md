# LiterAlura V3.0 — evidência da publicação

## Evidência visual — 09/11/2026

Arquivo: `docs/evidencias/literalura-v3/07-catalogo-ilustrado-real.png`.

A captura mostra o navegador com a versão local da LiterAlura V3.0, aba **Catálogo**, três livros exibidos em cards ilustrados, botões de favoritos, busca e ação **Conhecer o livro**. Dois títulos são *Dom Casmurro* (1899) e *Memórias Póstumas de Brás Cubas* (1881), ambos associados a Machado de Assis. O terceiro cadastro é um registro de teste Kafka.

Esta imagem é uma captura da **interface em execução**, não a imagem conceitual gerada no processo de design.

## Evidência da mensageria

Foi observado no frontend o cadastro de *Memórias Póstumas de Brás Cubas* e o painel Kafka com **1 evento enviado**, **1 evento recebido** e **0 falhas observadas**, às 18:50:06 de 09/11/2026. O resultado corresponde ao teste exibido na interface local; não garante entrega exatamente uma vez em quaisquer circunstâncias.

## Limites

- A V3.0 foi testada localmente; o GitHub hospeda o código e a documentação, não uma demo pública hospedada.
- As capas são ilustrativas, produzidas para a plataforma, não capas oficiais de editoras.
- O monitoramento Kafka mantém os últimos 100 eventos em memória e reinicia junto à API.
- O sistema ainda não oferece texto integral de obras para leitura interna.

## Critérios antes do merge da PR

- [ ] Frontend `npm run build` aprovado.
- [ ] Testes Java `mvn clean verify` aprovados.
- [ ] GitHub Actions do frontend e backend verdes.
- [ ] README, evidências, código React, Kafka e CI presentes na PR.
- [ ] Revisar `git diff` e confirmar ausência de arquivos sensíveis.
- [ ] Abrir Pull Request `feat/v3.0-frontend-react` → `main`.
- [ ] Fazer merge somente após os checks do GitHub.
