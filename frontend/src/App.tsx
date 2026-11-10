import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import './App.css'
import CatalogoPremium from './components/CatalogoPremium'

type Autor = { id: number; nome: string; anoNascimento: number; anoFalecimento: number | null }
type Livro = { id: number; titulo: string; anoPublicacao: number; autor: Autor }
type Pagina = 'inicio' | 'catalogo' | 'cadastro' | 'autores' | 'monitoramento' | 'sobre'
type EventoKafka = { id: number; livroId: number; titulo: string; status: 'PUBLICADO' | 'CONSUMIDO' | 'FALHA_ENVIO'; topico: string; ocorridoEm: string }

async function requisitar<T>(caminho: string, opcoes?: RequestInit): Promise<T> {
  const resposta = await fetch(`/api${caminho}`, {
    ...opcoes,
    headers: { 'Content-Type': 'application/json', ...opcoes?.headers },
  })
  if (!resposta.ok) throw new Error(`API retornou HTTP ${resposta.status}. Confira os dados e o backend.`)
  return resposta.json() as Promise<T>
}

export default function App() {
  const [pagina, setPagina] = useState<Pagina>('inicio')
  const [livros, setLivros] = useState<Livro[]>([])
  const [autores, setAutores] = useState<Autor[]>([])
  const [busca, setBusca] = useState('')
  const [carregando, setCarregando] = useState(true)
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState('')
  const [aviso, setAviso] = useState('')
  const [nome, setNome] = useState('')
  const [nascimento, setNascimento] = useState('')
  const [falecimento, setFalecimento] = useState('')
  const [titulo, setTitulo] = useState('')
  const [ano, setAno] = useState('')
  const [autorId, setAutorId] = useState('')
  const [eventosKafka, setEventosKafka] = useState<EventoKafka[]>([])
  const [carregandoKafka, setCarregandoKafka] = useState(false)
  const [erroKafka, setErroKafka] = useState('')
  const [filtroKafka, setFiltroKafka] = useState<'TODOS' | EventoKafka['status']>('TODOS')
  const [ultimaConsultaKafka, setUltimaConsultaKafka] = useState<string>('')

  async function carregar() {
    setCarregando(true)
    setErro('')
    try {
      const [listaLivros, listaAutores] = await Promise.all([
        requisitar<Livro[]>('/livros'),
        requisitar<Autor[]>('/autores'),
      ])
      setLivros(listaLivros)
      setAutores(listaAutores)
    } catch (error) {
      setErro(error instanceof Error ? error.message : 'Não foi possível carregar a API.')
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => { void carregar() }, [])

  async function carregarEventosKafka() {
    setCarregandoKafka(true)
    try {
      const lista = await requisitar<EventoKafka[]>('/monitoramento/kafka')
      setEventosKafka(lista)
      setUltimaConsultaKafka(new Date().toLocaleTimeString('pt-BR'))
      setErroKafka('')
    } catch (error) {
      setErroKafka(error instanceof Error ? error.message : 'Não foi possível consultar os eventos Kafka.')
    } finally {
      setCarregandoKafka(false)
    }
  }

  useEffect(() => {
    if (pagina !== 'monitoramento') return
    void carregarEventosKafka()
    const intervalo = window.setInterval(() => { void carregarEventosKafka() }, 5000)
    return () => window.clearInterval(intervalo)
  }, [pagina])

  const eventosFiltrados = eventosKafka.filter(evento => filtroKafka === 'TODOS' || evento.status === filtroKafka)
  const publicacoes = eventosKafka.filter(evento => evento.status === 'PUBLICADO').length
  const consumos = eventosKafka.filter(evento => evento.status === 'CONSUMIDO').length
  const falhas = eventosKafka.filter(evento => evento.status === 'FALHA_ENVIO').length

  const filtrados = useMemo(() => livros.filter((livro) =>
    `${livro.titulo} ${livro.autor?.nome ?? ''}`.toLocaleLowerCase('pt-BR')
      .includes(busca.toLocaleLowerCase('pt-BR')),
  ), [livros, busca])

  async function cadastrarAutor(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    setSalvando(true)
    setErro('')
    setAviso('')
    try {
      const novo = await requisitar<Autor>('/autores', {
        method: 'POST',
        body: JSON.stringify({
          nome: nome.trim(),
          anoNascimento: Number(nascimento),
          anoFalecimento: falecimento ? Number(falecimento) : null,
        }),
      })
      setNome(''); setNascimento(''); setFalecimento('')
      setAutorId(String(novo.id))
      await carregar()
      setAviso(`Autor “${novo.nome}” cadastrado com sucesso.`)
    } catch (error) {
      setErro(error instanceof Error ? error.message : 'Falha ao cadastrar autor.')
    } finally {
      setSalvando(false)
    }
  }

  async function cadastrarLivro(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    const autor = autores.find((item) => item.id === Number(autorId))
    if (!autor) { setErro('Selecione um autor antes de cadastrar o livro.'); return }
    setSalvando(true)
    setErro('')
    setAviso('')
    try {
      const novo = await requisitar<Livro>('/livros', {
        method: 'POST',
        body: JSON.stringify({ titulo: titulo.trim(), anoPublicacao: Number(ano), autor }),
      })
      setTitulo(''); setAno('')
      await carregar()
      setAviso(`Livro “${novo.titulo}” cadastrado. Abra Monitoramento Kafka no menu esquerdo para verificar o envio e o recebimento.`)
    } catch (error) {
      setErro(error instanceof Error ? error.message : 'Falha ao cadastrar livro.')
    } finally {
      setSalvando(false)
    }
  }

  const menu: { id: Pagina; nome: string; icone: string }[] = [
    { id: 'inicio', nome: 'Visão geral', icone: '◫' },
    { id: 'catalogo', nome: 'Catálogo', icone: '▤' },
    { id: 'cadastro', nome: 'Cadastros', icone: '✚' },
    { id: 'autores', nome: 'Autores', icone: '♧' },
    { id: 'monitoramento', nome: 'Monitoramento Kafka', icone: '◉' },
    { id: 'sobre', nome: 'Projeto e evidências', icone: '✦' },
  ]

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="brand"><div className="brand-mark">L</div><div><strong>LiterAlura</strong><small>Biblioteca inteligente</small></div></div>
        <p className="nav-label">MENU PRINCIPAL</p>
        <nav aria-label="Navegação principal">
          {menu.map((item) => <button key={item.id} className={`nav-item ${pagina === item.id ? 'active' : ''}`} onClick={() => setPagina(item.id)}><span>{item.icone}</span>{item.nome}</button>)}
        </nav>
        <div className="sidebar-footer"><span className="dot"/> Spring Boot · Kafka <small>LiterAlura V3.0</small></div>
      </aside>
      <main className="main">
        <header className="topbar"><span>WORKSPACE / LITERALURA</span><div className="top-actions"><button className="button ghost" onClick={() => { if (pagina === 'monitoramento') void carregarEventosKafka(); else void carregar() }} disabled={pagina === 'monitoramento' ? carregandoKafka : carregando}>↻ Atualizar</button><span className="tag">React + Java</span></div></header>
        <div className="content">
          <div className={`page-heading ${pagina === 'catalogo' ? 'page-heading--biblioteca' : ''}`}><div><span className="eyebrow">PAINEL DE GERENCIAMENTO</span><h1>{pagina === 'inicio' ? 'Visão geral' : pagina === 'catalogo' ? 'Catálogo de livros' : pagina === 'cadastro' ? 'Novos cadastros' : pagina === 'monitoramento' ? 'Monitoramento Kafka' : pagina === 'sobre' ? 'Projeto e evidências' : 'Autores'}</h1><p>{pagina === 'monitoramento' ? 'Acompanhe os eventos reais publicados e consumidos pelo Apache Kafka.' : pagina === 'sobre' ? 'Conheça o desafio, as soluções e os resultados comprovados da LiterAlura.' : 'Gerencie sua biblioteca com dados da API LiterAlura.'}</p></div><button className="button primary" onClick={() => setPagina('cadastro')}>+ Novo cadastro</button></div>
          {erro && <div role="alert" className="message error">⚠ {erro} <button onClick={() => void carregar()}>Tentar novamente</button></div>}
          {aviso && <div role="status" className="message success">✓ {aviso}</div>}
          {carregando && <p className="hint">Buscando dados da API...</p>}

          {pagina === 'inicio' && <>
            <div className="stats"><div className="stat"><span>Total de livros</span><strong>{livros.length}</strong><small>Livros cadastrados</small></div><div className="stat"><span>Autores</span><strong>{autores.length}</strong><small>Autores na biblioteca</small></div><div className="stat"><span>Integração</span><strong className="stat-text">API REST</strong><small>Spring Boot + PostgreSQL</small></div></div>
            <section className="panel"><div className="panel-heading"><div><h2>Livros cadastrados</h2><p>Visualização rápida do catálogo</p></div><button className="text-button" onClick={() => setPagina('catalogo')}>Ver catálogo →</button></div><CatalogoPremium livros={livros.slice(-6).reverse()} compacto /></section>
            <div className="info-strip"><span>✦</span><p><strong>Mensageria Kafka:</strong> ao cadastrar um livro, o backend publica um evento no tópico <code>literalura.livros.criados</code>. Os logs confirmam o processamento.</p></div>
            <div className="star-overview-link"><div><strong>Como a LiterAlura evoluiu?</strong><p>Conheça o desafio, a solução e as evidências técnicas do projeto.</p></div><button className="button ghost" onClick={() => setPagina('sobre')}>Ver projeto e evidências →</button></div>
          </>}

          {pagina === 'catalogo' && <section className="panel"><div className="panel-heading"><div><h2>Acervo</h2><p>{filtrados.length} livro(s) encontrado(s)</p></div><input className="search" placeholder="Pesquisar por título ou autor..." value={busca} onChange={(event) => setBusca(event.target.value)} aria-label="Pesquisar livros" /></div><CatalogoPremium livros={filtrados} /></section>}

          {pagina === 'autores' && <section className="panel"><div className="panel-heading"><div><h2>Autores cadastrados</h2><p>{autores.length} autor(es) no sistema</p></div></div>{autores.length === 0 ? <div className="empty">Nenhum autor cadastrado.</div> : <div className="table-wrap"><table><thead><tr><th>Autor</th><th>Nascimento</th><th>Falecimento</th><th>ID</th></tr></thead><tbody>{autores.map((autor) => <tr key={autor.id}><td><strong>{autor.nome}</strong></td><td>{autor.anoNascimento}</td><td>{autor.anoFalecimento ?? '—'}</td><td>#{autor.id}</td></tr>)}</tbody></table></div>}</section>}

          {pagina === 'monitoramento' && <div className="monitoramento-page">
            <div className="kafka-stats">
              <div className="stat"><span>Eventos enviados</span><strong>{publicacoes}</strong><small>Confirmação do broker (Producer)</small></div>
              <div className="stat"><span>Eventos recebidos</span><strong>{consumos}</strong><small>Processados pelo Consumer</small></div>
              <div className="stat"><span>Falhas de envio</span><strong>{falhas}</strong><small>Falhas observadas nesta execução</small></div>
            </div>
            <section className="panel kafka-panel">
              <div className="panel-heading kafka-heading">
                <div><h2>Histórico recente de eventos</h2><p>Dados reais do backend · Atualização automática a cada 5 segundos</p></div>
                <div className="kafka-actions">
                  <select aria-label="Filtrar eventos Kafka" className="kafka-filter" value={filtroKafka} onChange={(e) => setFiltroKafka(e.target.value as typeof filtroKafka)}>
                    <option value="TODOS">Todos os eventos</option>
                    <option value="PUBLICADO">Enviados</option>
                    <option value="CONSUMIDO">Recebidos</option>
                    <option value="FALHA_ENVIO">Falhas de envio</option>
                  </select>
                  <button className="button ghost" onClick={() => void carregarEventosKafka()} disabled={carregandoKafka}>
                    {carregandoKafka ? 'Consultando...' : '↻ Atualizar eventos'}
                  </button>
                </div>
              </div>
              {erroKafka && <div className="kafka-notice error" role="alert">Não foi possível carregar os eventos: {erroKafka}. Confirme que a API foi recompilada com o monitoramento.</div>}
              {!erroKafka && eventosFiltrados.length === 0 && <div className="empty">
                {carregandoKafka ? 'Consultando eventos...' : 'Nenhum evento registrado nesta execução. Cadastre um novo livro para gerar eventos.'}
              </div>}
              {!erroKafka && eventosFiltrados.length > 0 && <div className="kafka-event-list">
                {eventosFiltrados.map(evento => <article className="kafka-event" key={evento.id}>
                  <span className={`kafka-status-dot ${evento.status.toLowerCase()}`} aria-hidden="true" />
                  <div className="kafka-event-info">
                    <div className="kafka-event-heading"><strong>{evento.titulo}</strong><span className={`kafka-status ${evento.status.toLowerCase()}`}>
                      {evento.status === 'PUBLICADO' ? '✓ Mensagem enviada' : evento.status === 'CONSUMIDO' ? '✓ Mensagem recebida' : '⚠ Falha de envio'}
                    </span></div>
                    <p>Livro #{evento.livroId} · {evento.status === 'CONSUMIDO' ? 'Consumer' : 'Producer'} · <code>{evento.topico}</code></p>
                  </div>
                  <time className="kafka-time" dateTime={evento.ocorridoEm}>{new Date(evento.ocorridoEm).toLocaleString('pt-BR')}</time>
                </article>)}
              </div>}
              <div className="kafka-footer">Última consulta: {ultimaConsultaKafka || '—'} · Até 100 eventos recentes armazenados temporariamente pela API. O histórico é reiniciado quando a API reinicia.</div>
            </section>
          </div>}

          {pagina === 'sobre' && <div className="sobre-projeto">
            <section className="panel star-lead">
              <div className="star-lead-header">
                <div>
                  <span className="star-kicker">ENGENHARIA DE SOFTWARE · ESTUDO DE CASO</span>
                  <h2>Do catálogo de livros à aplicação Full Stack com Kafka</h2>
                  <p>Um projeto de evolução incremental: API REST, persistência, mensageria, observabilidade e interface web.</p>
                </div>
                <span className="star-chip">Método STAR</span>
              </div>
              <div className="star-steps">
                <article className="star-step"><div className="star-letter" aria-hidden="true">S</div><div><h3>Situação</h3><p>O desafio inicial era gerenciar livros e autores. Para demonstrar práticas de Engenharia de Software, a solução precisava ir além de um cadastro básico, tornando as operações observáveis e permitindo comunicação assíncrona.</p></div></article>
                <article className="star-step"><div className="star-letter" aria-hidden="true">T</div><div><h3>Tarefa</h3><p>Evoluir a aplicação de forma organizada, preservando a API e o banco de dados, incluindo testes, rastreabilidade, eventos de livros e uma interface para uso e demonstração.</p></div></article>
                <article className="star-step"><div className="star-letter" aria-hidden="true">A</div><div><h3>Ação</h3><p>Implementei Java e Spring Boot, PostgreSQL e Docker; adicionei Prometheus, Grafana e logs JSON; integrei Producer e Consumer Apache Kafka; e construí o frontend React com TypeScript, catálogo, formulários e monitoramento de eventos.</p></div></article>
                <article className="star-step"><div className="star-letter" aria-hidden="true">R</div><div><h3>Resultado</h3><p>11 testes automatizados aprovados na V2.3, CI do GitHub com resultado positivo, cadastro real integrado ao PostgreSQL e eventos de livros publicados e consumidos. A V3.0 exibe esses eventos na própria interface.</p></div></article>
              </div>
              <div className="star-actions">
                <button className="button ghost" onClick={() => setPagina('monitoramento')}>Ver monitoramento Kafka</button>
                <a className="button ghost star-action-link" href="https://github.com/Rogerio5/literalura-one-challenge-Springboot-Java" target="_blank" rel="noopener noreferrer">Ver repositório no GitHub ↗</a>
              </div>
            </section>
            <section className="panel evidence-panel">
              <div className="panel-heading"><div><h2>Evidências do projeto</h2><p>Capturas reais do desenvolvimento e das validações realizadas.</p></div><span className="star-evidence-count">5 evidências</span></div>
              <div className="evidence-grid">
                <figure className="evidence-item"><a href="/evidencias/01-dashboard-react.png" target="_blank" rel="noopener noreferrer" aria-label="Abrir captura do dashboard React"><img loading="lazy" src="/evidencias/01-dashboard-react.png" alt="Dashboard React mostrando o total de livros, autores e catálogo" /></a><figcaption><strong>Dashboard React</strong><span>Integração com a API e PostgreSQL · 1 livro e 1 autor</span></figcaption></figure>
                <figure className="evidence-item"><a href="/evidencias/02-cadastro-livro.png" target="_blank" rel="noopener noreferrer" aria-label="Abrir captura do cadastro de livro"><img loading="lazy" src="/evidencias/02-cadastro-livro.png" alt="Cadastro de Dom Casmurro concluído com mensagem de sucesso" /></a><figcaption><strong>Cadastro de livro</strong><span>Formulário React com confirmação de cadastro na API</span></figcaption></figure>
                <figure className="evidence-item"><a href="/evidencias/03-monitoramento-kafka.png" target="_blank" rel="noopener noreferrer" aria-label="Abrir captura do monitoramento Kafka"><img loading="lazy" src="/evidencias/03-monitoramento-kafka.png" alt="Monitoramento Kafka mostrando uma mensagem enviada e uma recebida" /></a><figcaption><strong>Mensageria Kafka real</strong><span>Producer: 1 · Consumer: 1 · Falhas: 0</span></figcaption></figure>
                <figure className="evidence-item"><a href="/evidencias/04-pr-v23-merge.png" target="_blank" rel="noopener noreferrer" aria-label="Abrir captura do Pull Request no GitHub"><img loading="lazy" src="/evidencias/04-pr-v23-merge.png" alt="Pull Request número 2 da V2.3 integrado no GitHub" /></a><figcaption><strong>Entrega versionada</strong><span>Pull Request #2 da V2.3 aprovado e integrado à main</span></figcaption></figure>
                <figure className="evidence-item"><a href="/evidencias/08-grafana-observabilidade-v30.png" target="_blank" rel="noopener noreferrer" aria-label="Abrir captura do Grafana"><img loading="lazy" src="/evidencias/08-grafana-observabilidade-v30.png" alt="Dashboard real do Grafana com disponibilidade da API, taxa de requisicoes, erros HTTP e uso de memoria JVM" /></a><figcaption><strong>Observabilidade - Grafana e Prometheus</strong><span>API UP · 4 req/min · 0 erros HTTP 5xx/min · JVM heap 41,6 MiB, no instante da captura</span></figcaption></figure>
              </div>
              <div className="star-evidence-note">As imagens registram etapas anteriores do projeto. O painel Kafka em execução guarda seus eventos recentes em memória e zera o histórico quando a API reinicia. O histórico persistente poderá ser acrescentado em uma evolução futura.</div>
            </section>
          </div>}

          {pagina === 'cadastro' && <div className="forms-grid">
            <section className="panel form-panel"><div className="form-icon">✎</div><h2>Cadastrar autor</h2><p>Adicione primeiro o autor à biblioteca.</p><form onSubmit={cadastrarAutor}><label>Nome completo<input value={nome} onChange={(event) => setNome(event.target.value)} required minLength={2} maxLength={100} placeholder="Ex.: Machado de Assis" /></label><label>Ano de nascimento<input type="number" min={1000} max={2025} value={nascimento} onChange={(event) => setNascimento(event.target.value)} required placeholder="1839" /></label><label>Ano de falecimento (opcional)<input type="number" min={1000} max={2025} value={falecimento} onChange={(event) => setFalecimento(event.target.value)} placeholder="1908" /></label><button className="button primary full" disabled={salvando}>{salvando ? 'Salvando...' : 'Salvar autor'}</button></form></section>
            <section className="panel form-panel"><div className="form-icon purple">▤</div><h2>Cadastrar livro</h2><p>O cadastro irá gerar um evento no Kafka.</p><form onSubmit={cadastrarLivro}><label>Título do livro<input value={titulo} onChange={(event) => setTitulo(event.target.value)} required minLength={2} maxLength={200} placeholder="Ex.: Dom Casmurro" /></label><label>Ano de publicação<input type="number" min={1000} max={2025} value={ano} onChange={(event) => setAno(event.target.value)} required placeholder="1899" /></label><label>Autor<select value={autorId} onChange={(event) => setAutorId(event.target.value)} required><option value="">Selecione um autor</option>{autores.map((autor) => <option value={autor.id} key={autor.id}>{autor.nome}</option>)}</select></label><button className="button primary full" disabled={salvando || autores.length === 0}>{salvando ? 'Salvando...' : 'Salvar livro + evento Kafka'}</button>{autores.length === 0 && <small className="hint">Cadastre um autor antes de incluir livros.</small>}</form></section>
          </div>}
          <footer className="footer">LiterAlura • Engenharia de Software • V3.0 Full Stack</footer>
        </div>
      </main>
    </div>
  )
}
