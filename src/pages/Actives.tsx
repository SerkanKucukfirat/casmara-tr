import { useEffect, useRef } from 'react'
import { Link, useParams } from 'react-router-dom'
import { actives, bySlug, collections } from '../content'
import { useIntro, useReveal } from '../components/motion'
import { Arrow, PageHero } from '../components/ui'
import NotFound from './NotFound'

export function ActiveIndex() {
  const page = useRef<HTMLDivElement>(null)
  useIntro(page)
  useReveal(page)
  useEffect(() => {
    document.title = 'Aktif İçerikler — Casmara Türkiye'
  }, [])
  return (
    <div ref={page}>
      <PageHero
        eyebrow="Aktif İçerikler"
        title="Formüllerin ardındaki bilim"
        text="Casmara formüllerinde yer alan aktif içerikleri, nasıl çalıştıklarını ve hangi ürünlerde bulunduklarını keşfedin."
        crumbs={[{ label: 'Aktif İçerikler' }]}
        image="ing-infinity-2"
      />
      <section className="section">
        <div className="wrap agrid rv-stagger">
          {actives.map((a, n) => (
            <Link key={a.slug} to={`/aktif-icerikler/${a.slug}`} className="acard">
              <em>{String(n + 1).padStart(2, '0')}</em>
              <h2>{a.name}</h2>
              <p>{a.tagline.replace(`${a.name}: `, '')}</p>
              <span className="link">
                Detay <Arrow />
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}

export function ActivePage() {
  const { slug } = useParams()
  const a = bySlug(actives, slug)
  const page = useRef<HTMLDivElement>(null)
  useIntro(page, [slug])
  useReveal(page, [slug])
  useEffect(() => {
    if (a) document.title = `${a.name} — Casmara Türkiye`
  }, [a])
  if (!a) return <NotFound />
  const i = actives.indexOf(a)
  const next = actives[(i + 1) % actives.length]
  return (
    <div ref={page} key={a.slug}>
      <PageHero eyebrow="Aktif içerik" title={a.name} text={a.tagline.replace(`${a.name}: `, '')} crumbs={[{ to: '/aktif-icerikler', label: 'Aktif İçerikler' }, { label: a.name }]} />
      <section className="section">
        <div className="wrap split">
          <p className="display m rv">{a.desc}</p>
          <div>
            <p className="eyebrow rv">İçeren ürünler</p>
            <ul className="used rv-stagger">
              {a.used.map(u => {
                const c = u.collection ? collections.find(x => x.slug === u.collection) : null
                return (
                  <li key={u.text}>
                    {c ? (
                      <Link to={`/koleksiyonlar/${c.slug}`}>
                        <span>{u.text}</span>
                        <Arrow />
                      </Link>
                    ) : (
                      <span>{u.text}</span>
                    )}
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </section>
      <section className="section tight">
        <div className="wrap pager">
          <Link to="/aktif-icerikler">← Tüm içerikler</Link>
          <Link to={`/aktif-icerikler/${next.slug}`}>
            Sonraki: <strong>{next.name}</strong> →
          </Link>
        </div>
      </section>
    </div>
  )
}
