import { useEffect, useRef } from 'react'
import { Link, useParams } from 'react-router-dom'
import { bySlug, cares, concerns, focus, img, type Listing } from '../content'
import { useIntro, useReveal } from '../components/motion'
import { Arrow, Faqs, PageHero, ProductCard } from '../components/ui'
import NotFound from './NotFound'

const GROUPS = {
  concerns: {
    list: concerns,
    base: '/cilt-endiseleri',
    label: 'Cilt Endişeleri',
    title: 'Cildinizin ihtiyacına göre bakım',
    text: 'Atopik, kuru, yağlı ya da lekeli… Her cilt tipinin ihtiyacı farklıdır. Cildinizi tanıyın, size uygun Casmara bakımını keşfedin.',
    image: 'hero-pink',
  },
  cares: {
    list: cares,
    base: '/cilt-bakimlari',
    label: 'Cilt Bakımları',
    title: 'Günlük bakımın temel adımları',
    text: 'Temizleyicilerden serumlara, nemlendiricilerden göz çevresi bakımına: rutininizi tamamlayan Casmara ürünleri.',
    image: 'cleanser-balancing',
  },
} as const

type Group = keyof typeof GROUPS

const PICS: Record<string, string> = {
  'atopik-cilt': 'age-defense-pro',
  'kuru-cilt': 'ocean-pro',
  'yagli-cilt': 'shine-treatment',
  'karma-cilt': 'goji-treatment',
  'hassas-cilt': 'sensations-hydronutri',
  'olgun-cilt': 'q10-treatment',
  'akneye-egilimli-cilt': 'purifying-still',
  'lekeli-cilt': 'nacar-treatment',
  'goz-cevresi-bakimi': 'eye-retail',
  'nemlendirici-yuz-kremleri': 'marine-fresh',
  'besleyici-yuz-kremleri': 'q10-pack',
  'yuz-temizleyicileri': 'cleanser-deep',
  serumlar: 'serum-lightening',
}

export function ListingIndex({ group }: { group: Group }) {
  const g = GROUPS[group]
  const page = useRef<HTMLDivElement>(null)
  useIntro(page, [group])
  useReveal(page, [group])
  useEffect(() => {
    document.title = `${g.label} — Casmara Türkiye`
  }, [g])
  return (
    <div ref={page} key={group}>
      <PageHero eyebrow={g.label} title={g.title} text={g.text} crumbs={[{ label: g.label }]} image={g.image} />
      <section className="section">
        <div className="wrap lgrid rv-stagger">
          {(g.list as readonly Listing[]).map((l, n) => (
            <Link key={l.slug} to={`${g.base}/${l.slug}`} className="lcard">
              <div className="lcard-img">
                <img src={img(PICS[l.slug])} alt="" loading="lazy" style={{ objectPosition: focus(PICS[l.slug]) }} />
              </div>
              <em>{String(n + 1).padStart(2, '0')}</em>
              <h2>{l.title}</h2>
              <p>{l.tagline}</p>
              <span className="link">
                İncele <Arrow />
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}

export function ListingPage({ group }: { group: Group }) {
  const g = GROUPS[group]
  const { slug } = useParams()
  const l = bySlug(g.list as readonly Listing[] as Listing[], slug)
  const page = useRef<HTMLDivElement>(null)
  useIntro(page, [slug])
  useReveal(page, [slug])
  useEffect(() => {
    if (l) document.title = `${l.heading} — Casmara Türkiye`
  }, [l])
  if (!l) return <NotFound />

  // products are grouped by their role in the routine, in a fixed order
  const order = ['Temizleyiciler', 'Serumlar', 'Kremler', 'Göz Çevresi']
  const kinds = [...new Set(l.products.map(p => p.kind))].sort((a, b) => order.indexOf(a) - order.indexOf(b))
  const others = (g.list as readonly Listing[]).filter(x => x.slug !== l.slug)

  return (
    <div ref={page} key={l.slug}>
      <PageHero
        eyebrow={l.title}
        title={l.heading}
        text={l.tagline}
        crumbs={[{ to: g.base, label: g.label }, { label: l.title }]}
        image={PICS[l.slug]}
      />
      <section className="section">
        <div className="wrap intro-split">
          <p className="eyebrow rv">{l.title} hakkında</p>
          <p className="display m rv">{l.intro}</p>
        </div>
      </section>
      {kinds.map(k => (
        <section key={k} className="section tight">
          <div className="wrap">
            <div className="sec-head">
              <h2 className="display m rv">{k}</h2>
              <span className="rv-line hair" />
            </div>
            <div className="pgrid n4 rv-stagger">
              {l.products
                .filter(p => p.kind === k)
                .map(p => (
                  <ProductCard key={p.name} p={{ ...p, kind: '' }} to={p.collection ? `/koleksiyonlar/${p.collection}` : null} />
                ))}
            </div>
          </div>
        </section>
      ))}
      {l.extra && (
        <section className="section extra">
          <div className="wrap extra-in rv">
            <p className="eyebrow">{l.extra.subtitle}</p>
            <h2 className="display l">{l.extra.title}</h2>
            <p>{l.extra.text}</p>
          </div>
        </section>
      )}
      {l.faqs.length > 0 && (
        <section className="section">
          <div className="wrap faq-wrap">
            <div>
              <p className="eyebrow rv">Sıkça sorulan sorular</p>
              <h2 className="display l rv">
                Merak <em>edilenler</em>
              </h2>
            </div>
            <Faqs items={l.faqs} />
          </div>
        </section>
      )}
      <section className="section tight">
        <div className="wrap">
          <p className="eyebrow rv">Diğer {g.label.toLocaleLowerCase('tr-TR')}</p>
          <div className="chips rv">
            {others.map(o => (
              <Link key={o.slug} to={`${g.base}/${o.slug}`} className="chip">
                {o.title}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
