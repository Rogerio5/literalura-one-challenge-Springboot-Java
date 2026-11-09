import { useEffect, useMemo, useState } from 'react'
import './CatalogoPremium.css'

type Autor = {
  id: number
  nome: string
  anoNascimento: number
  anoFalecimento: number | null
}

type Livro = {
  id: number
  titulo: string
  anoPublicacao: number
  autor: Autor
}

type Props = { livros: Livro[]; compacto?: boolean }

const cores = ['ameixa', 'esmeralda', 'marinho', 'terracota', 'anil', 'grafite'] as const
const CHAVE = 'literalura.v30.estante.favoritos'

function temaDoLivro(livro: Livro): (typeof cores)[number] {
  const codigo = [...livro.titulo].reduce((total, letra) => total + letra.charCodeAt(0), livro.id)
  return cores[codigo % cores.length]
}

function iniciais(titulo: string) {
  return titulo
    .split(/\s+/)
    .filter((palavra) => palavra.length > 2)
    .slice(0, 2)
    .map((palavra) => palavra.charAt(0))
    .join('')
    .toUpperCase() || 'LA'
}

function URLdaBusca(livro: Livro) {
  const consulta = `${livro.titulo} ${livro.autor?.nome ?? ''}`.trim()
  return `https://www.gutenberg.org/ebooks/search/?query=${encodeURIComponent(consulta)}`
}

function normalizarTitulo(valor: string) {
  return valor.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('pt-BR').trim()
}

function ilustracaoDoLivro(livro: Livro): string | null {
  const titulo = normalizarTitulo(livro.titulo)
  const autor = normalizarTitulo(livro.autor?.nome ?? '')
  if (autor.includes('machado de assis')) {
    if (titulo === 'dom casmurro') return '/literalura/capas/dom-casmurro.webp'
    if (titulo === 'memorias postumas de bras cubas') return '/literalura/capas/memorias-postumas.webp'
  }
  if (titulo.startsWith('livro teste kafka v23')) return '/literalura/capas/livro-teste-kafka.webp'
  return null
}

function CapaDoLivro({ livro, grande = false }: { livro: Livro; grande?: boolean }) {
  const arte = ilustracaoDoLivro(livro)
  if (arte) {
    return <img
      className={`la-capa la-capa--ilustrada ${grande ? 'la-capa--grande' : ''}`}
      src={arte}
      alt={`Capa ilustrada LiterAlura de ${livro.titulo}, de ${livro.autor?.nome ?? 'autor não informado'}`}
      loading="lazy"
      decoding="async"
    />
  }
  return (
    <div className={`la-capa la-capa--${temaDoLivro(livro)} ${grande ? 'la-capa--grande' : ''}`} aria-label={`Capa ilustrativa criada para ${livro.titulo}`}>
      <div className="la-capa__selo">LITER<span>ALURA</span></div>
      <div className="la-capa__emblema" aria-hidden="true">{iniciais(livro.titulo)}</div>
      <div className="la-capa__texto">
        <span className="la-capa__linha" aria-hidden="true" />
        <strong>{livro.titulo}</strong>
        <span>{livro.autor?.nome || 'Autor não informado'}</span>
      </div>
      <div className="la-capa__rodape"><span>EDIÇÃO DO ACERVO</span><span>{livro.anoPublicacao}</span></div>
    </div>
  )
}

export default function CatalogoPremium({ livros, compacto = false }: Props) {
  const [selecionado, setSelecionado] = useState<Livro | null>(null)
  const [soFavoritos, setSoFavoritos] = useState(false)
  const [favoritos, setFavoritos] = useState<number[]>(() => {
    try {
      const valor = window.localStorage.getItem(CHAVE)
      const lista: unknown = valor ? JSON.parse(valor) : []
      return Array.isArray(lista) ? lista.filter((id): id is number => typeof id === 'number') : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    try { window.localStorage.setItem(CHAVE, JSON.stringify(favoritos)) } catch { /* Navegador sem armazenamento */ }
  }, [favoritos])

  useEffect(() => {
    if (!selecionado) return
    function fechar(evento: KeyboardEvent) { if (evento.key === 'Escape') setSelecionado(null) }
    window.addEventListener('keydown', fechar)
    return () => window.removeEventListener('keydown', fechar)
  }, [selecionado])

  const exibidos = useMemo(
    () => (soFavoritos && !compacto ? livros.filter((livro) => favoritos.includes(livro.id)) : livros),
    [soFavoritos, compacto, livros, favoritos],
  )

  function alternarFavorito(id: number) {
    setFavoritos((atual) => atual.includes(id) ? atual.filter((item) => item !== id) : [...atual, id])
  }

  if (!livros.length) return <div className="empty">Nenhum livro encontrado. Cadastre um livro para começar seu acervo.</div>

  return (
    <div className={`la-estante ${compacto ? 'la-estante--compacta' : ''}`}>
      {!compacto && <div className="la-estante__intro">
        <div>
          <span className="la-estante__micro">✦ ESTANTE PERSONALIZADA</span>
          <h3>Histórias para descobrir</h3>
          <p>Capas exclusivas criadas para cada título do seu acervo.</p>
        </div>
        <button
          type="button"
          className={`la-estante__filtro ${soFavoritos ? 'la-estante__filtro--ativo' : ''}`}
          aria-pressed={soFavoritos}
          onClick={() => setSoFavoritos((ativo) => !ativo)}
        >
          {soFavoritos ? '♥ Só favoritos' : '♡ Meus favoritos'}
        </button>
      </div>}

      {exibidos.length === 0 ? (
        <div className="la-estante__vazia">Nenhum favorito nesta busca. Marque um livro com ♡ para encontrá-lo aqui.</div>
      ) : (
        <div className="la-estante__grade">
          {exibidos.map((livro) => {
            const favorito = favoritos.includes(livro.id)
            return <article className="la-livro" key={livro.id}>
              <div className="la-livro__visual">
                <CapaDoLivro livro={livro} />
                <button
                  type="button"
                  className={`la-livro__favoritar ${favorito ? 'la-livro__favoritar--ativo' : ''}`}
                  aria-label={`${favorito ? 'Remover dos' : 'Adicionar aos'} favoritos: ${livro.titulo}`}
                  title={favorito ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                  aria-pressed={favorito}
                  onClick={() => alternarFavorito(livro.id)}
                >{favorito ? '♥' : '♡'}</button>
              </div>
              <div className="la-livro__conteudo">
                <span className="la-livro__selo">ACERVO LITERALURA</span>
                <h4 title={livro.titulo}>{livro.titulo}</h4>
                <p>{livro.autor?.nome || 'Autor não informado'}</p>
                <div className="la-livro__meta"><span>✦ {livro.anoPublicacao}</span><span>Livro #{livro.id}</span></div>
                <button type="button" className="la-livro__detalhes" onClick={() => setSelecionado(livro)}>Conhecer o livro <span aria-hidden="true">↗</span></button>
              </div>
            </article>
          })}
        </div>
      )}
      {!compacto && <p className="la-estante__aviso">As capas são ilustrações originais da LiterAlura. O cadastro contém metadados, não o texto integral dos livros.</p>}

      {selecionado && (
        <div className="la-modal__fundo" onMouseDown={(evento) => { if (evento.target === evento.currentTarget) setSelecionado(null) }}>
          <section className="la-modal" role="dialog" aria-modal="true" aria-label={`Detalhes de ${selecionado.titulo}`}>
            <button type="button" className="la-modal__fechar" aria-label="Fechar detalhes" onClick={() => setSelecionado(null)}>✕</button>
            <div className="la-modal__capa"><CapaDoLivro livro={selecionado} grande /></div>
            <div className="la-modal__conteudo">
              <span className="la-estante__micro">LITERATURA • ACERVO DIGITAL</span>
              <h2>{selecionado.titulo}</h2>
              <p className="la-modal__autor">Por {selecionado.autor?.nome ?? 'autor não informado'}</p>
              <div className="la-modal__dados">
                <div><span>Publicação</span><strong>{selecionado.anoPublicacao}</strong></div>
                <div><span>Identificação</span><strong>#{selecionado.id}</strong></div>
              </div>
              <p className="la-modal__descricao">Este título faz parte do catálogo LiterAlura. Para leitura integral, procure uma edição digital legalmente disponibilizada pela editora ou por uma biblioteca pública.</p>
              <a
                href={URLdaBusca(selecionado)}
                target="_blank"
                rel="noopener noreferrer"
                className="la-modal__buscar"
              >Procurar edição para leitura ↗</a>
              <small>Pesquisa externa no Project Gutenberg. A disponibilidade e os direitos de uso dependem da obra e do país; não há texto integral armazenado na LiterAlura.</small>
            </div>
          </section>
        </div>
      )}
    </div>
  )
}
