import { useEffect, useRef, type CSSProperties } from 'react'
import { gsap } from 'gsap'
import { Link, useParams } from 'react-router-dom'
import { bySlug, collections, focus, img, ingredientImage, section, type Collection, type Device } from '../content'
import { reduced, splitWords, useIntro, useReveal } from '../components/motion'
import { Arrow, CollectionCard, Crumbs, CtaBand, Faqs, Marquee, Monogram, ProductCard, VideoFeature } from '../components/ui'
import NotFound from './NotFound'

function Hero({ c, eyebrow, title, subtitle, desc, benefits }: { c: Collection | Device; eyebrow: string; title: string; subtitle: string; desc: string[]; benefits: string[] }) {
  return (
    <section className="chero">
      <Monogram className="chero-swirl" />
      <div className="wrap chero-grid">
        <div className="chero-copy">
          <Crumbs items={[{ to: '/koleksiyonlar', label: 'Koleksiyonlar' }, { label: c.short }]} />
          {eyebrow && <p className="eyebrow intro-up">{eyebrow}</p>}
          <h1 className="display xl intro-words">{splitWords(title)}</h1>
          {subtitle && <p className="chero-sub intro-up">{subtitle}</p>}
          {desc.map(d => (
            <p key={d.slice(0, 30)} className="lead intro-up">
              {d}
            </p>
          ))}
          {benefits.length > 0 && (
            <ul className="benefits intro-up">
              {benefits.map((b, n) => (
                <li key={b}>
                  <em>{String(n + 1).padStart(2, '0')}</em>
                  {b}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className={`chero-img intro-img ${c.hero.startsWith('kit-') ? 'kit' : ''}`}>
          <img src={img(c.hero)} alt={c.title} style={{ objectPosition: focus(c.hero) }} />
        </div>
      </div>
    </section>
  )
}

function Ingredients({ c }: { c: Collection }) {
  const s = section(c, 'ingredients')
  if (!s) return null
  return (
    <section className="section ings">
      <div className="wrap">
        <div className="sec-head center">
          <p className="eyebrow rv">Etkin içerikler</p>
          <h2 className="display l rv">
            Formülün <em>kalbinde</em>
          </h2>
        </div>
        <div className={`ing-grid n${s.items.length} rv-stagger`}>
          {s.items.map((it, n) => {
            const pic = ingredientImage(c, n)
            return (
              <article key={it.name} className="ing">
                {pic ? <img src={pic} alt="" loading="lazy" /> : <span className="ing-n">{String(n + 1).padStart(2, '0')}</span>}
                <h3>{it.name}</h3>
                {it.sub && <p className="ing-sub">{it.sub}</p>}
                <p>{it.desc}</p>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// The protocol reads as a path: a line draws across while the phases light up in turn.
function Protocol({ c }: { c: Collection }) {
  const s = section(c, 'protocol')
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el || reduced()) return
    const ctx = gsap.context(() => {
      gsap.fromTo('.proto-line i', { scaleX: 0 }, { scaleX: 1, ease: 'none', scrollTrigger: { trigger: el, start: 'top 75%', end: 'bottom 60%', scrub: true } })
      gsap.fromTo(
        '.step',
        { opacity: 0.15, y: 30 },
        { opacity: 1, y: 0, stagger: 0.25, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 75%', end: 'bottom 60%', scrub: true } },
      )
    }, el)
    return () => ctx.revert()
  }, [c.slug])
  if (!s) return null
  return (
    <section className="section proto">
      <div className="wrap">
        <div className="sec-head">
          <div>
            <p className="eyebrow rv">Kısa protokol</p>
            <h2 className="display l rv">
              Adım adım <em>profesyonel</em> uygulama
            </h2>
          </div>
          <p className="sec-note rv">{s.steps.length} fazlı kabin bakımı</p>
        </div>
        <div className="proto-track" ref={ref}>
          <div className="proto-line">
            <i />
          </div>
          <ol className={`steps n${s.steps.length}`}>
            {s.steps.map(st => (
              <li key={st.n} className="step">
                <span className="step-dot" />
                <em>Faz {Number(st.n)}</em>
                <h3>{st.title.toLocaleLowerCase('tr-TR')}</h3>
                <p>{st.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}

function Products({ c }: { c: Collection }) {
  const s = section(c, 'products')
  if (!s) return null
  const label = s.label?.toLocaleLowerCase('tr-TR') ?? 'ürünler'
  return (
    <section className="section prods">
      <div className="wrap">
        <div className="sec-head">
          <div>
            <p className="eyebrow rv">{label}</p>
            <h2 className="display l rv">{label.includes('ev devam') ? <>Bakımı <em>evde</em> sürdürün</> : <>Koleksiyonu <em>tanıyın</em></>}</h2>
          </div>
        </div>
        <div className={`pgrid n${Math.min(s.items.length, 4)} rv-stagger`}>
          {s.items.map(p => (
            <ProductCard key={p.name} p={p} accent={c.accent} alt={c.hero} />
          ))}
        </div>
      </div>
    </section>
  )
}

function Effects({ c }: { c: Collection }) {
  const s = section(c, 'effects')
  if (!s) return null
  return (
    <section className="section effects">
      <div className="wrap">
        <p className="eyebrow rv">Koleksiyonun etki alanı</p>
        <div className="eff-grid rv-stagger">
          {s.items.map((e, n) => (
            <div key={e.title}>
              <em>{String(n + 1).padStart(2, '0')}</em>
              <h3>{e.title}</h3>
              <p>{e.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Wide({ c }: { c: Collection | Device }) {
  const pics = [c.wide, ...('gallery' in c && c.gallery ? c.gallery : [])].filter(Boolean) as string[]
  if (!pics.length) return null
  return (
    <section className="wide">
      <div className={`wrap wide-grid n${Math.min(pics.length, 3)}`}>
        {pics.slice(0, 3).map(p => (
          <div key={p} className="wide-img rv-img">
            <img src={img(p)} alt="" loading="lazy" />
          </div>
        ))}
      </div>
    </section>
  )
}

function Related({ c }: { c: Collection | Device }) {
  const i = collections.findIndex(x => x.slug === c.slug)
  const list = [1, 2, 3].map(k => collections[(i + k) % collections.length])
  return (
    <section className="section related">
      <div className="wrap">
        <div className="sec-head">
          <div>
            <p className="eyebrow rv">Diğer koleksiyonlar</p>
            <h2 className="display l rv">
              Keşfetmeye <em>devam edin</em>
            </h2>
          </div>
          <Link to="/koleksiyonlar" className="link rv">
            Tümü <Arrow />
          </Link>
        </div>
        <div className="cgrid three rv-stagger">
          {list.map(x => (
            <CollectionCard key={x.slug} c={x} />
          ))}
        </div>
      </div>
    </section>
  )
}

function DeviceBody({ d }: { d: Device }) {
  return (
    <>
      <section className="section">
        <div className="wrap dev-feats rv-stagger">
          {d.features.map(([t, s], n) => (
            <div key={t}>
              <em>{String(n + 1).padStart(2, '0')}</em>
              <h3>{t}</h3>
              <p>{s}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="section effects">
        <div className="wrap">
          <p className="eyebrow rv">Etki alanı · göz çevresi faydaları</p>
          <div className="eff-grid rv-stagger">
            {d.effects.map(([t, s], n) => (
              <div key={t}>
                <em>{String(n + 1).padStart(2, '0')}</em>
                <h3>{t}</h3>
                <p>{s}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="section">
        <div className="wrap split">
          <div>
            <p className="eyebrow rv">Ürün hakkında</p>
            <h2 className="display l rv">
              Göz çevresine <em>özel</em> ilgi
            </h2>
            {d.about.map(p => (
              <p key={p.slice(0, 20)} className="rv">
                {p}
              </p>
            ))}
          </div>
          <div>
            <p className="eyebrow rv">Nasıl kullanılır?</p>
            <ol className="howto rv-stagger">
              {d.steps.map((s, n) => (
                <li key={s}>
                  <em>{n + 1}</em>
                  {s}
                </li>
              ))}
            </ol>
            <p className="note rv">{d.note}</p>
            <p className="eyebrow rv" style={{ marginTop: '3rem' }}>
              Kullanım alanları
            </p>
            <div className="chips rv">
              {d.uses.map(u => (
                <span key={u} className="chip">
                  {u}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>
      <CtaBand title={d.cta[0]} text={d.cta[1]} button={d.cta[2]} subject={d.title} />
      <section className="section">
        <div className="wrap faq-wrap">
          <div>
            <p className="eyebrow rv">Sıkça sorulan sorular</p>
            <h2 className="display l rv">
              Merak <em>edilenler</em>
            </h2>
          </div>
          <Faqs items={d.faqs} />
        </div>
      </section>
      <Marquee items={['Elektronik bakım cihazı', 'Basınç masajı', 'Titreşimli masaj', 'Sıcak & soğuk uygulama', 'Rahatlatıcı müzik']} />
    </>
  )
}

export default function CollectionPage() {
  const { slug } = useParams()
  const c = bySlug(collections, slug)
  const page = useRef<HTMLDivElement>(null)
  useIntro(page, [slug])
  useReveal(page, [slug])
  useEffect(() => {
    if (c) document.title = `${c.title} — Casmara Türkiye`
  }, [c])
  if (!c) return <NotFound />

  const style = { '--a': c.accent, '--t': c.tint } as CSSProperties
  if (c.kind === 'device')
    return (
      <div ref={page} key={c.slug} className="cpage" style={style}>
        <Hero c={c} eyebrow={c.eyebrow} title={c.title} subtitle={c.tagline} desc={[c.desc]} benefits={[]} />
        <DeviceBody d={c} />
        <Related c={c} />
      </div>
    )

  const hero = section(c, 'hero')
  const cta = section(c, 'cta')
  const usp = section(c, 'usp')
  return (
    <div ref={page} key={c.slug} className="cpage" style={style}>
      <Hero
        c={c}
        eyebrow={hero?.eyebrow || 'Profesyonel bakım'}
        title={c.title}
        subtitle={hero?.subtitle || c.tagline}
        desc={hero?.desc ?? []}
        benefits={hero?.benefits ?? []}
      />
      <Ingredients c={c} />
      <Wide c={c} />
      <Protocol c={c} />
      {c.slug === 'golden-age-intense-treatment' && <VideoFeature />}
      <Products c={c} />
      <Effects c={c} />
      {cta && <CtaBand title={cta.text} button={cta.button} subject={c.title} />}
      {usp && <Marquee items={usp.items} />}
      <Related c={c} />
    </div>
  )
}
