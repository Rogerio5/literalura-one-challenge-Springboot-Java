# LiterAlura V3.0 — Catálogo ilustrado

## Escopo

- Mantém a mesma aplicação React/Vite na porta `5180` e todas as páginas existentes.
- Adiciona capas ilustradas próprias para **Dom Casmurro**, **Memórias Póstumas de Brás Cubas** e um livro usado nos testes Kafka.
- Mantém uma capa dinâmica para **todos os demais títulos**, sem depender de uma API de imagens.
- Aperfeiçoa a estante, cores, tipografia e cabeçalho em estilo editorial.
- Preserva busca por título/autor, favoritos guardados no navegador, modal **Conhecer o livro** e pesquisa de edição legal no Project Gutenberg.
- Não inclui texto integral dos livros na API; não apresenta a busca externa como leitura integrada.

## Evidências

1. **Antes (captura real da aplicação local):** `docs/evidencias/literalura-v3/05-catalogo-antes.png`.
2. **Referência de layout (imagem conceitual gerada, não captura de aplicação):** `docs/evidencias/literalura-v3/06-referencia-visual-gerada.png`.
3. **Depois (captura real):** salve manualmente após a instalação como `docs/evidencias/literalura-v3/07-catalogo-ilustrado-real.png`. Não declare esta evidência como criada antes da captura.

## Validação local

```powershell
cd C:\Projetos\literalura-one-challenge-Springboot-Java\frontend
npm.cmd run build
```

Abra `http://127.0.0.1:5180`, clique em **Catálogo** e confira as capas de **Dom Casmurro** e **Memórias Póstumas de Brás Cubas**. Teste **Meus favoritos**, busca e **Conhecer o livro**. Teste também **Monitoramento Kafka** para verificar se a página anterior continua acessível.

### Limitações conscientes

Os favoritos são locais ao navegador e não sincronizados por usuário. A biblioteca contém metadados de livros, não arquivos ou texto para leitura integral. As capas produzidas para a interface são criações ilustrativas da LiterAlura, não reproduções de capas de editoras.
