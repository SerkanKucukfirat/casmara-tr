import { useEffect, useState, type CSSProperties, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { focus, img, type Collection, type Device, type Faq, type ListingProduct, type Product } from '../content'
import { splitWords } from './motion'

// The wordmark (a vector trace of the brand file) and the swirl are drawn as CSS masks so they take the colour of the text around them.
export function Logo({ tagline = false }: { tagline?: boolean }) {
  return (
    <span className={`logo ${tagline ? 'with-tag' : ''}`} role="img" aria-label={tagline ? 'Casmara — Cosmetics without limits' : 'Casmara'}>
      <span className="logo-mark" style={{ ['--src' as string]: `url(${import.meta.env.BASE_URL}img/logo.svg)` }} />
      {tagline && (
        <span className="logo-tag" aria-hidden>
          Cosmetics without limits
        </span>
      )}
    </span>
  )
}

export function Monogram({ className = '' }: { className?: string }) {
  return <span className={`monogram ${className}`} style={{ ['--src' as string]: `url(${img('swirl')})` }} aria-hidden />
}

export function Crumbs({ items }: { items: { to?: string; label: string }[] }) {
  return (
    <nav className="crumbs" aria-label="Konum">
      <Link to="/">Ana sayfa</Link>
      {items.map(i => (
        <span key={i.label}>
          <i>/</i>
          {i.to ? <Link to={i.to}>{i.label}</Link> : <em>{i.label}</em>}
        </span>
      ))}
    </nav>
  )
}

// Inner page hero: soft tinted band, monogram watermark, heading rising word by word.
export function PageHero({
  eyebrow,
  title,
  text,
  crumbs,
  image,
  tint,
}: {
  eyebrow: string
  title: string
  text?: string
  crumbs: { to?: string; label: string }[]
  image?: string
  tint?: string
}) {
  return (
    <section className={`phero ${image ? 'has-img' : ''}`} style={tint ? ({ '--tint': tint } as CSSProperties) : undefined}>
      <Monogram className="phero-swirl" />
      <div className="wrap phero-in">
        <div className="phero-copy">
          <Crumbs items={crumbs} />
          <p className="eyebrow intro-up">{eyebrow}</p>
          <h1 className="display xl intro-words">{splitWords(title)}</h1>
          {text && <p className="lead intro-up">{text}</p>}
        </div>
        {image && (
          <div className="phero-img intro-img">
            <img src={img(image)} alt="" style={{ objectPosition: focus(image) }} />
          </div>
        )}
      </div>
    </section>
  )
}

export function Arrow() {
  return (
    <svg className="arrow" viewBox="0 0 24 12" aria-hidden>
      <path d="M0 6h22M17 1l5 5-5 5" />
    </svg>
  )
}

export function CollectionCard({ c, index }: { c: Collection | Device; index?: number }) {
  return (
    <Link to={`/koleksiyonlar/${c.slug}`} className="ccard" style={{ '--a': c.accent, '--t': c.tint } as CSSProperties}>
      <div className="ccard-img">
        <img src={img(c.card)} alt={c.title} loading="lazy" style={{ objectPosition: focus(c.card) }} />
        {c.hero !== c.card && <img className="ccard-alt" src={img(c.hero)} alt="" loading="lazy" style={{ objectPosition: focus(c.hero) }} />}
        <span className="ccard-hover">
          <span>{c.tagline}</span>
          <span className="ccard-btn">
            Koleksiyonu keşfet <Arrow />
          </span>
        </span>
      </div>
      <div className="ccard-copy">
        {index !== undefined && <span className="ccard-n">{String(index + 1).padStart(2, '0')}</span>}
        <strong>{c.short}</strong>
        <span className="ccard-tag">{c.tagline}</span>
        <span className="ccard-go">
          Keşfet <Arrow />
        </span>
      </div>
    </Link>
  )
}

// A product without its own photo gets a quiet, typographic tile instead of a stand-in picture.
export function ProductVisual({ image, name, accent, alt }: { image?: string | null; name: string; accent?: string; alt?: string }) {
  if (image)
    return (
      <div className="pv">
        <img src={img(image)} alt={name} loading="lazy" />
        {alt && <img className="pv-alt" src={img(alt)} alt="" loading="lazy" style={{ objectPosition: focus(alt) }} />}
      </div>
    )
  return (
    <div className="pv pv-type" style={accent ? ({ '--a': accent } as CSSProperties) : undefined} aria-hidden>
      <Monogram />
      <span>{name.replace(/\s*\(.*\)$/, '').replace(/\s+\d+([.,]\d+)?\s*ml\b.*$/i, '')}</span>
    </div>
  )
}

export function ProductCard({ p, accent, to, alt }: { p: Product | ListingProduct; accent?: string; to?: string | null; alt?: string }) {
  const full = p as Product
  const body = (
    <>
      <ProductVisual image={p.image} name={p.name} accent={accent} alt={alt} />
      <div className="pc-copy">
        {'kind' in p && p.kind && <span className="pc-kind">{p.kind}</span>}
        {full.tag && <span className="pc-kind">{full.tag}</span>}
        <h3>{p.name}</h3>
        {full.note && <p className="pc-note">{full.note}</p>}
        <p>{p.desc}</p>
        {full.features && full.features.length > 0 && (
          <ul className="pc-feats">
            {full.features.map(f => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        )}
        {full.inci && (
          <p className="pc-inci">
            <span>{full.inci.label}</span> {full.inci.value}
          </p>
        )}
        {to && (
          <span className="pc-go">
            Koleksiyona git <Arrow />
          </span>
        )}
      </div>
    </>
  )
  return to ? (
    <Link to={to} className="pc">
      {body}
    </Link>
  ) : (
    <article className="pc">{body}</article>
  )
}

export function Faqs({ items }: { items: Faq[] }) {
  const [open, setOpen] = useState<number | null>(0)
  return (
    <div className="faqs rv-stagger">
      {items.map((f, i) => (
        <div key={f.q} className={`faq ${open === i ? 'open' : ''}`}>
          <button aria-expanded={open === i} onClick={() => setOpen(open === i ? null : i)}>
            <span>{f.q}</span>
            <i aria-hidden />
          </button>
          <div className="faq-a">
            <div>
              <p>{f.a}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export function Marquee({ items, dark = false }: { items: string[]; dark?: boolean }) {
  const row = [...items, ...items, ...items, ...items]
  return (
    <div className={`marquee ${dark ? 'dark' : ''}`} aria-label={items.join(', ')}>
      <div className="marquee-track" aria-hidden>
        {row.map((t, i) => (
          <span key={i}>
            {t}
            <Monogram />
          </span>
        ))}
      </div>
    </div>
  )
}

export function CtaBand({ title, text, button, subject }: { title: ReactNode; text?: string; button: string; subject?: string }) {
  return (
    <section className="ctaband">
      <Monogram className="ctaband-swirl" />
      <div className="wrap ctaband-in rv">
        <div>
          <h2 className="display">{title}</h2>
          {text && <p>{text}</p>}
        </div>
        <Link to={subject ? `/iletisim?konu=${encodeURIComponent(subject)}` : '/iletisim'} className="btn light">
          {button} <Arrow />
        </Link>
      </div>
    </section>
  )
}

// A wide still with a play button; the full protocol film opens in a lightbox and only then starts loading.
export function VideoFeature({ title = 'Golden Age Intense Treatment', text = 'Profesyonel uygulama protokolünü adım adım izleyin.' }: { title?: string; text?: string }) {
  const [open, setOpen] = useState(false)
  useEffect(() => {
    if (!open) return
    document.documentElement.classList.add('locked')
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', esc)
    return () => {
      document.documentElement.classList.remove('locked')
      window.removeEventListener('keydown', esc)
    }
  }, [open])
  return (
    <section className="vfeat">
      <div className="wrap">
        <button className="vfeat-frame rv-img" onClick={() => setOpen(true)} aria-label={`${title} uygulama videosunu oynat`}>
          <img src={img('vid-touch')} alt="" loading="lazy" />
          <span className="vfeat-shade" />
          <span className="vfeat-copy">
            <span className="eyebrow light">Uygulama videosu</span>
            <span className="vfeat-title">{title}</span>
            <span className="vfeat-text">{text}</span>
          </span>
          <span className="vfeat-play" aria-hidden>
            <span className="ico-play" />
          </span>
        </button>
      </div>
      {open && (
        <div className="lightbox" role="dialog" aria-label={title} onClick={e => e.target === e.currentTarget && setOpen(false)}>
          <video src={`${import.meta.env.BASE_URL}video/golden-age-protokol.mp4`} poster={img('vid-salon')} controls autoPlay playsInline />
          <button className="lightbox-x" onClick={() => setOpen(false)} aria-label="Kapat">
            ×
          </button>
        </div>
      )}
    </section>
  )
}
