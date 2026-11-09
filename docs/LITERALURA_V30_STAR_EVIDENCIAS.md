# LiterAlura V3.0 — Método STAR e evidências

## Escopo

Evolução do projeto LiterAlura, originalmente voltado ao cadastro e consulta de autores e livros, para uma demonstração Full Stack com interface web, mensageria Kafka e observabilidade. O projeto é um estudo prático, não um sistema de biblioteca em produção.

## Situação

O projeto de catálogo de livros permitia explorar Java/Spring Boot. Para demonstrar competências adicionais de Engenharia de Software, precisava evoluir para um fluxo de ponta a ponta, com dados persistidos, rastreabilidade e eventos assíncronos.

## Tarefa

Desenvolver incrementos seguros e verificáveis: API e persistência; observabilidade; mensagens assíncronas; frontend; e evidências técnicas objetivas para apresentar a evolução.

## Ação

- V2.0 — API REST Java 17 / Spring Boot, PostgreSQL, Docker e GitHub Actions.
- V2.1 — Actuator, Prometheus e Grafana.
- V2.2 — logs JSON, correlação por Request ID e testes.
- V2.3 — Kafka em modo KRaft, tópico `literalura.livros.criados`, Producer após o commit e Consumer; 11 testes aprovados.
- V3.0 — interface React/TypeScript/Vite para consultar/cadastrar livros e autores e acompanhar eventos Kafka com atualização automática a cada 5 segundos.

## Resultados verificados

1. **11/11 testes automatizados aprovados** na V2.3; 0 erros e falhas (log Maven de 09/11/2026).
2. **GitHub Actions na branch `main`: SUCCESS** após o merge da V2.3: https://github.com/Rogerio5/literalura-one-challenge-Springboot-Java/actions/runs/42698231437
3. **Kafka integrado e2e:** logs anteriores registraram publicação e consumo para `livroId=2`; depois o monitoramento visual mostrou 1 envio, 1 recebimento, 0 falhas para `livroId=3`.
4. **Frontend integrado à API:** painel mostrou o registro de livro/autor e formulário confirmou cadastro de Dom Casmurro.

## Evidências visuais

- [Dashboard React](evidencias/literalura-v3/01-dashboard-react.png) — API, catálogo, livros e autores.
- [Cadastro de livro](evidencias/literalura-v3/02-cadastro-livro.png) — interface de cadastro validada.
- [Monitoramento Kafka](evidencias/literalura-v3/03-monitoramento-kafka.png) — 1 evento enviado e 1 recebido.
- [Pull Request da V2.3](evidencias/literalura-v3/04-pr-v23-merge.png) — PR #2 mergeado no GitHub.

## Limitações conhecidas

- O histórico Kafka apresentado na V3.0 está armazenado **em memória** e é reiniciado quando a API reinicia; esta entrega **não** implementa histórico persistente.
- Os contadores correspondem aos eventos observados na instância em execução, não a um total histórico de todos os eventos do tópico.
- Esta entrega do módulo STAR/evidências altera apenas o frontend e a documentação; os testes da V3.0 e a publicação do Pull Request devem ser executados após a instalação.

## Capturas de novas evidências

Abrir `http://127.0.0.1:5180` e capturar a página **Projeto e evidências**, a **Visão geral**, o **Cadastro** e o **Monitoramento Kafka** após novo livro. Antes de publicar capturas, confirme que não há dados sensíveis ou segredos visíveis. Registrar os resultados em `docs/evidencias/literalura-v3/`.
