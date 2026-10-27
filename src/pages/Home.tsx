import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { gsap } from 'gsap'
import { Link } from 'react-router-dom'
import { CONTACT, cares, collections, concerns, favourites, heroSlides, img, milestones } from '../content'
import { reduced, useReveal } from '../components/motion'
import { Arrow, CollectionCard, Marquee, Monogram } from '../components/ui'

const DELAY = 6500

function Hero() {
  const [i, setI] = useState(0)
  const root = useRef<HTMLElement>(null)
  const timer = useRef<number>(0)

  const go = (n: number) => setI((n + heroSlides.length) % heroSlides.length)

  useEffect(() => {
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => go(i + 1), DELAY)
    return () => window.clearTimeout(timer.current)
  }, [i])

  // each slide's words rise in; the picture settles from a slow zoom
  useEffect(() => {
    const el = root.current
    if (!el || reduced()) return
    const ctx = gsap.context(() => {
      const s = `.hs[data-i="${i}"]`
      gsap.fromTo(`${s} .hs-word > span`, { yPercent: 115 }, { yPercent: 0, duration: 1.4, ease: 'expo.out', stagger: 0.08, delay: 0.15 })
      gsap.fromTo(`${s} .hs-fade`, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'power3.out', stagger: 0.1, delay: 0.45 })
      gsap.fromTo(`.hp[data-i="${i}"] img`, { scale: 1.14 }, { scale: 1, duration: DELAY / 1000 + 1.5, ease: 'power1.out' })
    }, el)
    return () => ctx.revert()
  }, [i])

  // the arch drifts with the scroll and the swirl turns slowly
  useEffect(() => {
    const el = root.current
    if (!el || reduced()) return
    const ctx = gsap.context(() => {
      gsap.to('.hero-arch', { yPercent: 12, ease: 'none', scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: true } })
      gsap.to('.hero-copy', { yPercent: -18, opacity: 0.2, ease: 'none', scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: true } })
      gsap.to('.hero-swirl', { rotate: 360, duration: 120, repeat: -1, ease: 'none' })
    }, el)
    return () => ctx.revert()
  }, [])

  return (
    <section className="hero" ref={root}>
      <Monogram className="hero-swirl" />
      <div className="wrap hero-grid">
        <div className="hero-copy">
          {heroSlides.map((s, n) => (
            <div key={s.slug} className={`hs ${n === i ? 'on' : ''}`} data-i={n} aria-hidden={n !== i}>
              <p className="eyebrow hs-fade">{s.eyebrow}</p>
              <h1 className="display hero-title">
                <span className="hs-word">
                  <span>{s.title}</span>
                </span>
                <span className="hs-word em">
                  <span>{s.em}</span>
                </span>
              </h1>
              <Link to={`/koleksiyonlar/${s.slug}`} className="btn hs-fade" tabIndex={n === i ? 0 : -1}>
                Koleksiyonu keşfedin <Arrow />
              </Link>
            </div>
          ))}
          <div className="hero-dots" role="tablist" aria-label="Öne çıkanlar">
            {heroSlides.map((s, n) => (
              <button key={s.slug} role="tab" aria-selected={n === i} className={n === i ? 'on' : ''} onClick={() => go(n)}>
                <em>{String(n + 1).padStart(2, '0')}</em>
                <span>{s.title + ' ' + s.em}</span>
                <i style={{ animationDuration: `${DELAY}ms` }} />
              </button>
            ))}
          </div>
        </div>
        <div className="hero-arch">
          {heroSlides.map((s, n) => (
            <div key={s.slug} className={`hp ${n === i ? 'on' : ''}`} data-i={n}>
              <img src={img(s.image)} alt="" style={{ objectPosition: s.pos }} fetchPriority={n === 0 ? 'high' : 'auto'} />
            </div>
          ))}
          <div className="hero-badge">
            <strong>1974</strong>
            <span>Valencia · İspanya</span>
          </div>
        </div>
      </div>
      <a href="#marka" className="hero-scroll" aria-label="Aşağı kaydır">
        <span />
      </a>
    </section>
  )
}

// The brand statement fills with colour as it scrolls past.
function Statement() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el || reduced()) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.st-w',
        { opacity: 0.16 },
        { opacity: 1, stagger: 0.05, ease: 'none', scrollTrigger: { trigger: el, start: 'top 75%', end: 'bottom 55%', scrub: true } },
      )
    }, el)
    return () => ctx.revert()
  }, [])
  const text =
    '1974 yılında İspanya’nın Valencia şehrinde kurulan Casmara, profesyonel cilt bakımında yenilikçi formülasyonları ve yüksek performanslı bakım protokolleri ile dünyanın önde gelen dermokozmetik markalarından biridir.'
  return (
    <section className="statement" id="marka">
      <div className="wrap">
        <p className="eyebrow rv">Cosmetics without limits</p>
        <div className="st-text display" ref={ref}>
          {text.split(' ').map((w, n) => (
            <span key={n} className="st-w">
              {w}{' '}
            </span>
          ))}
        </div>
        <div className="st-grid">
          <p className="rv">
            Kendi Ar-Ge ve üretim tesislerinde geliştirilen ürünleri, bugün 80’den fazla ülkede profesyoneller tarafından tercih edilmektedir. Bilim,
            inovasyon ve profesyonel bakım yaklaşımını bir araya getiren Casmara, cildin ihtiyaçlarına yönelik etkili bakım çözümleri sunmaya devam
            etmektedir.
          </p>
          <div className="stats rv-stagger">
            <div>
              <strong>50+</strong>
              <span>yıllık deneyim</span>
            </div>
            <div>
              <strong>80+</strong>
              <span>ülkede profesyoneller</span>
            </div>
            <div>
              <strong>{collections.length}</strong>
              <span>profesyonel koleksiyon</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Favourites() {
  const list = favourites.map(s => collections.find(c => c.slug === s)!)
  return (
    <section className="favs">
      <div className="wrap">
        <div className="sec-head">
          <div>
            <p className="eyebrow rv">Zamansız favoriler</p>
            <h2 className="display l rv">
              Profesyonellerin <em>yıllardır</em> vazgeçmediği protokoller
            </h2>
          </div>
          <Link to="/koleksiyonlar" className="link rv">
            Tüm koleksiyonlar <Arrow />
          </Link>
        </div>
        <div className="favs-grid rv-stagger">
          {list.map((c, n) => (
            <CollectionCard key={c.slug} c={c} index={n} />
          ))}
        </div>
      </div>
    </section>
  )
}

const HOME_CARE = [
  { label: 'Golden Age', sub: 'Ev devam ürünleri', image: 'golden-serum', to: 'golden-age-intense-treatment' },
  { label: 'Infinity Cream', sub: 'Rejuvenating cream', image: 'infinity-cream', to: 'infinity-treatment' },
  { label: 'Purifying', sub: 'Ev devam ürünleri', image: 'purifying-cleanser', to: 'purifying-beautyplan-treatment' },
  { label: 'Goji', sub: 'Ev devam ürünleri', image: 'goji-treatment', to: 'goji-treatment', cover: true },
]

function HomeCare() {
  return (
    <section className="homecare">
      <div className="wrap">
        <div className="sec-head">
          <div>
            <p className="eyebrow rv">Evde devam eden bakım</p>
            <h2 className="display l rv">
              Salondaki sonucu <em>her gün</em> sürdürün
            </h2>
          </div>
        </div>
        <div className="hc-grid rv-stagger">
          {HOME_CARE.map(h => (
            <Link key={h.label} to={`/koleksiyonlar/${h.to}`} className="hc">
              <div className={`hc-img ${'cover' in h ? 'cover' : ''}`}>
                <img src={img(h.image)} alt={h.label} loading="lazy" />
              </div>
              <span>{h.sub}</span>
              <strong>{h.label}</strong>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

function Editorial() {
  return (
    <section className="editorial">
      <div className="wrap ed-grid">
        <div className="ed-img rv-img">
          <img src={img('hero-pink-full')} alt="Casmara" data-parallax="6" />
        </div>
        <div className="ed-copy">
          <p className="eyebrow rv">1979’dan beri</p>
          <h2 className="display l rv">
            Markanın simgesi: <em>Algae Peel-Off</em> maskeler
          </h2>
          <p className="rv">
            Kurulduğu günden bu yana profesyonel kozmetik sektörüne birçok yenilik kazandıran Casmara; 1978 yılında ilk tek doz kişiye özel kit bakım
            uygulamalarını geliştirmiş, 1979 yılında ise bugün markanın simgesi haline gelen Algae Peel-Off Maskeleri ile profesyonel bakım deneyimine yeni
            bir yaklaşım kazandırmıştır.
          </p>
          <div className="ed-mini rv-img">
            <img src={img('gold-mask-model')} alt="Gold Mask uygulaması" loading="lazy" />
          </div>
          <Link to="/koleksiyonlar/algae-peel-off-maske-koleksiyonu" className="btn rv">
            Maske koleksiyonu <Arrow />
          </Link>
        </div>
      </div>
    </section>
  )
}

// Desktop: the timeline is pinned and slides sideways as you scroll. Touch screens get a swipeable row.
function Milestones() {
  const wrap = useRef<HTMLDivElement>(null)
  const track = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const w = wrap.current
    const t = track.current
    if (!w || !t || reduced() || window.matchMedia('(max-width: 900px)').matches) return
    const ctx = gsap.context(() => {
      gsap.to(t, {
        x: () => -(t.scrollWidth - window.innerWidth + 80),
        ease: 'none',
        scrollTrigger: { trigger: w, start: 'top top', end: () => `+=${t.scrollWidth - window.innerWidth}`, scrub: 1, pin: true, invalidateOnRefresh: true },
      })
    }, w)
    return () => ctx.revert()
  }, [])
  return (
    <div className="ms-outer">
      <section className="milestones" ref={wrap}>
        <div className="wrap ms-head">
          <p className="eyebrow light">İlklerin markası</p>
          <h2 className="display l">
            Kozmetik tarihine <em>yön veren</em> yenilikler
          </h2>
        </div>
        <div className="ms-track" ref={track}>
          {milestones.map(m => (
            <div className="ms" key={m.year}>
              <strong>{m.year}</strong>
              <span className="ms-line" />
              <p>{m.text}</p>
            </div>
          ))}
          <Link to="/hakkimizda" className="ms ms-more">
            <strong>Bugün</strong>
            <span className="ms-line" />
            <p>
              Golden Age Treatment ile geleceğin bakım teknolojileri <Arrow />
            </p>
          </Link>
        </div>
      </section>
    </div>
  )
}

function SkinFinder() {
  const [hover, setHover] = useState(0)
  const pics = ['hero-pink', 'gold-mask-model', 'ocean-pro', 'q10-treatment', 'sensations-hydronutri', 'eye-pro', 'shine-treatment', 'nacar-treatment']
  return (
    <section className="finder">
      <div className="wrap finder-grid">
        <div className="finder-pic rv-img">
          {pics.map((p, n) => (
            <img key={p} src={img(p)} alt="" className={n === hover ? 'on' : ''} loading="lazy" />
          ))}
        </div>
        <div>
          <p className="eyebrow rv">Cildinizi tanıyın</p>
          <h2 className="display l rv">
            Her cilt <em>kendi</em> bakımını ister
          </h2>
          <div className="finder-list rv-stagger">
            {concerns.map((c, n) => (
              <Link key={c.slug} to={`/cilt-endiseleri/${c.slug}`} onMouseEnter={() => setHover(n)} onFocus={() => setHover(n)}>
                <em>{String(n + 1).padStart(2, '0')}</em>
                {c.title}
                <Arrow />
              </Link>
            ))}
          </div>
          <div className="chips rv">
            {cares.map(c => (
              <Link key={c.slug} to={`/cilt-bakimlari/${c.slug}`} className="chip">
                {c.title}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function Catalog() {
  return (
    <section className="catalog">
      <div className="wrap cat-grid">
        <div className="cat-book rv" aria-hidden>
          <div className="book">
            <div className="book-cover" style={{ '--src': `url(${img('poster-50')})` } as CSSProperties} />
            <div className="book-page" />
            <div className="book-page p2" />
          </div>
        </div>
        <div>
          <p className="eyebrow rv">E-Katalog</p>
          <h2 className="display l rv">
            Dijital <em>katalog</em>
          </h2>
          <p className="rv">Tüm Casmara koleksiyonunu profesyonel protokolleri ve yeni nesil aktif bileşenleri dijital kataloğumuzda keşfedin.</p>
          <div className="btn-row rv">
            <Link to="/iletisim?konu=E-Katalog" className="btn">
              Kataloğu indir <Arrow />
            </Link>
            <Link to="/iletisim?konu=E-Katalog" className="btn ghost">
              Online görüntüle
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

function ContactStrip() {
  return (
    <section className="cstrip">
      <div className="wrap cstrip-grid rv-stagger">
        <div>
          <p className="eyebrow">Bize ulaşın</p>
          <h2 className="display m">Profesyonel bakım için yanınızdayız</h2>
        </div>
        <div>
          <span>Adres</span>
          <p>{CONTACT.address}</p>
        </div>
        <div>
          <span>Telefon</span>
          <a href={CONTACT.phoneHref}>{CONTACT.phone}</a>
          <span>E-posta</span>
          <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
        </div>
        <Link to="/iletisim" className="btn">
          İletişim formu <Arrow />
        </Link>
      </div>
    </section>
  )
}

export default function Home() {
  const page = useRef<HTMLDivElement>(null)
  useReveal(page)
  useEffect(() => {
    document.title = 'Casmara Türkiye — Cosmetics without limits'
  }, [])
  return (
    <div ref={page}>
      <Hero />
      <Statement />
      <Marquee items={['Profesyonel formülasyon', 'Valencia’da Ar-Ge ve üretim', 'Algae Peel-Off teknolojisi', '80+ ülke', 'Since 1974']} />
      <Favourites />
      <HomeCare />
      <Editorial />
      <Milestones />
      <SkinFinder />
      <Catalog />
      <ContactStrip />
    </div>
  )
}
