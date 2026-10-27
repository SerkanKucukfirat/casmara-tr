import { useEffect, useMemo, useRef } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { actives, cares, collections, concerns, posts, section } from '../content'
import { useIntro } from '../components/motion'
import { Arrow, PageHero } from '../components/ui'

type Hit = { to: string; type: string; title: string; text: string }

const fold = (s: string) => s.toLocaleLowerCase('tr-TR').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/ı/g, 'i')

function buildIndex(): Hit[] {
  const hits: Hit[] = []
  for (const c of collections) {
    hits.push({ to: `/koleksiyonlar/${c.slug}`, type: 'Koleksiyon', title: c.title, text: c.tagline })
    if (c.kind === 'collection') {
      for (const p of section(c, 'products')?.items ?? []) hits.push({ to: `/koleksiyonlar/${c.slug}`, type: c.short, title: p.name, text: p.desc })
      for (const i of section(c, 'ingredients')?.items ?? []) hits.push({ to: `/koleksiyonlar/${c.slug}`, type: `${c.short} · içerik`, title: i.name, text: i.desc })
    }
  }
  for (const l of concerns) hits.push({ to: `/cilt-endiseleri/${l.slug}`, type: 'Cilt endişesi', title: l.title, text: l.tagline })
  for (const l of cares) hits.push({ to: `/cilt-bakimlari/${l.slug}`, type: 'Cilt bakımı', title: l.title, text: l.tagline })
  for (const a of actives) hits.push({ to: `/aktif-icerikler/${a.slug}`, type: 'Aktif içerik', title: a.name, text: a.desc })
  for (const p of posts) hits.push({ to: `/blog/${p.slug}`, type: 'Blog', title: p.title, text: p.excerpt })
  return hits
}

export default function Search() {
  const [params] = useSearchParams()
  const q = params.get('q') ?? ''
  const navigate = useNavigate()
  const page = useRef<HTMLDivElement>(null)
  useIntro(page, [q])
  const index = useMemo(buildIndex, [])
  const results = useMemo(() => {
    const words = fold(q).split(/\s+/).filter(Boolean)
    if (!words.length) return []
    const seen = new Set<string>()
    return index.filter(h => {
      const hay = fold(`${h.title} ${h.text} ${h.type}`)
      const key = h.to + h.title
      if (!words.every(w => hay.includes(w)) || seen.has(key)) return false
      seen.add(key)
      return true
    })
  }, [q, index])
  useEffect(() => {
    document.title = `Arama: ${q} — Casmara Türkiye`
  }, [q])
  return (
    <div ref={page} key={q}>
      <PageHero eyebrow="Arama" title={q ? `“${q}”` : 'Arama'} text={`${results.length} sonuç bulundu`} crumbs={[{ label: 'Arama' }]} />
      <section className="section">
        <div className="wrap">
          <form
            className="search-inline"
            onSubmit={e => {
              e.preventDefault()
              const v = new FormData(e.currentTarget).get('q')
              navigate(`/arama?q=${encodeURIComponent(String(v ?? ''))}`)
            }}
          >
            <input name="q" defaultValue={q} placeholder="Ürün, koleksiyon veya içerik" aria-label="Arama" />
            <button className="btn">Ara</button>
          </form>
          <ul className="results">
            {results.map(r => (
              <li key={r.to + r.title}>
                <Link to={r.to}>
                  <span>{r.type}</span>
                  <strong>{r.title}</strong>
                  <p>{r.text}</p>
                  <Arrow />
                </Link>
              </li>
            ))}
          </ul>
          {q && !results.length && <p className="lead">Sonuç bulunamadı. Farklı bir kelime deneyin.</p>}
        </div>
      </section>
    </div>
  )
}
