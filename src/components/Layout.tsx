import { useEffect, useRef, useState, type FormEvent, type RefObject } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { CONTACT, collections, img, nav, policies } from '../content'
import { reduced } from './motion'
import { Logo, Monogram } from './ui'

let lenis: Lenis | null = null

function useSmoothScroll() {
  useEffect(() => {
    if (reduced()) return
    lenis = new Lenis({ lerp: 0.085 })
    lenis.on('scroll', ScrollTrigger.update)
    const raf = (t: number) => lenis?.raf(t * 1000)
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)
    return () => {
      gsap.ticker.remove(raf)
      lenis?.destroy()
      lenis = null
    }
  }, [])
}

// Every route starts at the top, behind a short plum curtain that lifts away.
function usePageChange(curtain: RefObject<HTMLDivElement | null>) {
  const { pathname } = useLocation()
  const first = useRef(true)
  useEffect(() => {
    window.scrollTo(0, 0)
    lenis?.scrollTo(0, { immediate: true, force: true })
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 150)
    if (first.current) first.current = false
    else if (curtain.current && !reduced())
      gsap.fromTo(curtain.current, { yPercent: 0 }, { yPercent: -100, duration: 1.05, ease: 'expo.inOut', delay: 0.05 })
    return () => window.clearTimeout(id)
  }, [pathname, curtain])
}

type Menu = 'collections' | 'skin' | 'actives' | 'corporate' | null

function Header() {
  const ref = useRef<HTMLElement>(null)
  const [menu, setMenu] = useState<Menu>(null)
  const [mobile, setMobile] = useState(false)
  const [search, setSearch] = useState(false)
  const { pathname } = useLocation()
  const home = pathname === '/'

  useEffect(() => {
    setMenu(null)
    setMobile(false)
    setSearch(false)
  }, [pathname])

  useEffect(() => {
    const lock = mobile || search
    document.documentElement.classList.toggle('locked', lock)
    if (lock) lenis?.stop()
    else lenis?.start()
  }, [mobile, search])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const st = ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: self => {
        el.classList.toggle('is-solid', self.scroll() > 40)
        el.classList.toggle('is-hidden', self.direction === 1 && self.scroll() > 500)
      },
    })
    return () => st.kill()
  }, [])

  const open = (m: Menu) => () => setMenu(m)
  const close = () => setMenu(null)

  return (
    <>
      <header ref={ref} className={`hdr ${home ? 'on-hero' : ''} ${menu ? 'has-menu' : ''}`} onMouseLeave={close}>
        <div className="hdr-bar">
          <button className={`burger ${mobile ? 'x' : ''}`} aria-label={mobile ? 'Menüyü kapat' : 'Menüyü aç'} aria-expanded={mobile} onClick={() => setMobile(m => !m)}>
            <i />
            <i />
          </button>
          <nav className="hdr-nav" aria-label="Ana menü">
            <NavLink to="/koleksiyonlar" onMouseEnter={open('collections')} onFocus={open('collections')}>
              Koleksiyonlar
            </NavLink>
            <NavLink to="/cilt-endiseleri" onMouseEnter={open('skin')} onFocus={open('skin')}>
              Cilt Endişeleri
            </NavLink>
            <NavLink to="/cilt-bakimlari" onMouseEnter={open('skin')} onFocus={open('skin')}>
              Cilt Bakımları
            </NavLink>
          </nav>
          <Link to="/" className="hdr-logo" aria-label="Casmara Türkiye ana sayfa" onMouseEnter={close}>
            <Logo />
          </Link>
          <nav className="hdr-nav right" aria-label="Kurumsal menü">
            <NavLink to="/aktif-icerikler" onMouseEnter={open('actives')} onFocus={open('actives')}>
              Aktif İçerikler
            </NavLink>
            <NavLink to="/hakkimizda" onMouseEnter={open('corporate')} onFocus={open('corporate')}>
              Kurumsal
            </NavLink>
          </nav>
          <button className="hdr-search" aria-label="Ara" onClick={() => setSearch(true)}>
            <svg viewBox="0 0 24 24" aria-hidden>
              <circle cx="10.5" cy="10.5" r="6.5" />
              <path d="M15.5 15.5 21 21" />
            </svg>
          </button>
        </div>

        <div className={`mega ${menu ? 'open' : ''}`} aria-hidden={!menu}>
          {menu === 'collections' && (
            <div className="mega-in wrap mega-cols">
              <div className="mega-list">
                <p className="eyebrow">Profesyonel protokoller</p>
                {collections.map(c => (
                  <Link key={c.slug} to={`/koleksiyonlar/${c.slug}`} style={{ ['--a' as string]: c.accent }}>
                    <span className="dot" />
                    {c.short}
                  </Link>
                ))}
              </div>
              <div className="mega-feature">
                {['golden-age-intense-treatment', 'infinity-treatment'].map(slug => {
                  const c = collections.find(x => x.slug === slug)!
                  return (
                    <Link key={slug} to={`/koleksiyonlar/${slug}`} className="mega-card">
                      <img src={img(c.card)} alt="" />
                      <span>{c.short}</span>
                    </Link>
                  )
                })}
              </div>
            </div>
          )}
          {menu === 'skin' && (
            <div className="mega-in wrap mega-two">
              <div className="mega-list">
                <p className="eyebrow">Cilt endişeleri</p>
                {nav.concerns.map(l => (
                  <Link key={l.to} to={l.to}>
                    {l.label}
                  </Link>
                ))}
              </div>
              <div className="mega-list">
                <p className="eyebrow">Cilt bakımları</p>
                {nav.cares.map(l => (
                  <Link key={l.to} to={l.to}>
                    {l.label}
                  </Link>
                ))}
              </div>
              <Link to="/cilt-endiseleri" className="mega-card tall">
                <img src={img('hero-pink')} alt="" />
                <span>Cildinize uygun bakımı keşfedin</span>
              </Link>
            </div>
          )}
          {menu === 'actives' && (
            <div className="mega-in wrap mega-two">
              <div className="mega-list two-col">
                <p className="eyebrow">Aktif içerikler</p>
                {nav.actives.map(l => (
                  <Link key={l.to} to={l.to}>
                    {l.label}
                  </Link>
                ))}
              </div>
              <Link to="/aktif-icerikler" className="mega-card tall">
                <img src={img('ing-infinity-2')} alt="" />
                <span>Formüllerin ardındaki bilim</span>
              </Link>
            </div>
          )}
          {menu === 'corporate' && (
            <div className="mega-in wrap mega-two">
              <div className="mega-list">
                <p className="eyebrow">Kurumsal</p>
                {nav.corporate.map(l => (
                  <Link key={l.to} to={l.to}>
                    {l.label}
                  </Link>
                ))}
              </div>
              <Link to="/hakkimizda" className="mega-card tall">
                <img src={img('poster-50')} alt="" />
                <span>50 yılı aşkın kozmetik inovasyonu</span>
              </Link>
            </div>
          )}
        </div>
      </header>

      <div className={`drawer ${mobile ? 'open' : ''}`} aria-hidden={!mobile}>
        <div className="drawer-in">
          <MobileGroup title="Koleksiyonlar" to="/koleksiyonlar" links={nav.collections} />
          <MobileGroup title="Cilt Endişeleri" to="/cilt-endiseleri" links={nav.concerns} />
          <MobileGroup title="Cilt Bakımları" to="/cilt-bakimlari" links={nav.cares} />
          <MobileGroup title="Aktif İçerikler" to="/aktif-icerikler" links={nav.actives} />
          <MobileGroup title="Kurumsal" to="/hakkimizda" links={nav.corporate} />
          <div className="drawer-foot">
            <a href={CONTACT.phoneHref}>{CONTACT.phone}</a>
            <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
          </div>
        </div>
      </div>

      <SearchOverlay open={search} onClose={() => setSearch(false)} />
    </>
  )
}

function MobileGroup({ title, to, links }: { title: string; to: string; links: { to: string; label: string }[] }) {
  const [open, setOpen] = useState(false)
  return (
    <div className={`mg ${open ? 'open' : ''}`}>
      <div className="mg-head">
        <Link to={to}>{title}</Link>
        <button aria-label={`${title} alt menüsü`} aria-expanded={open} onClick={() => setOpen(o => !o)}>
          <span />
        </button>
      </div>
      <div className="mg-body">
        <div>
          {links.map(l => (
            <Link key={l.to} to={l.to}>
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const input = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()
  useEffect(() => {
    if (!open) return
    const id = window.setTimeout(() => input.current?.focus(), 200)
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', esc)
    return () => {
      window.clearTimeout(id)
      window.removeEventListener('keydown', esc)
    }
  }, [open, onClose])
  const submit = (e: FormEvent) => {
    e.preventDefault()
    const q = input.current?.value.trim()
    if (q) navigate(`/arama?q=${encodeURIComponent(q)}`)
  }
  return (
    <div className={`search ${open ? 'open' : ''}`} aria-hidden={!open} onClick={e => e.target === e.currentTarget && onClose()}>
      <form className="search-box wrap" onSubmit={submit} role="search">
        <label htmlFor="q" className="eyebrow">
          Ne arıyorsunuz?
        </label>
        <input ref={input} id="q" name="q" placeholder="Ürün, koleksiyon veya içerik" autoComplete="off" />
        <div className="search-hints">
          {['Golden Age', 'Retinol', 'Hyaluronic Acid', 'Peel-Off', 'Kuru cilt'].map(h => (
            <button type="button" key={h} onClick={() => navigate(`/arama?q=${encodeURIComponent(h)}`)}>
              {h}
            </button>
          ))}
        </div>
        <button type="button" className="search-close" onClick={onClose} aria-label="Aramayı kapat">
          ×
        </button>
      </form>
    </div>
  )
}

function Footer() {
  const [sent, setSent] = useState(false)
  return (
    <footer className="ftr">
      <section className="news">
        <Monogram className="news-swirl" />
        <div className="wrap news-in">
          <p className="eyebrow light">Casmara bülten</p>
          <h2 className="display">
            Güzelliğin sırlarını <em>ilk siz</em> öğrenin
          </h2>
          <p className="news-text">Yeni ürünler, profesyonel cilt bakım önerileri ve özel kampanyalardan haberdar olmak için bültenimize abone olun.</p>
          {sent ? (
            <p className="news-ok">Teşekkürler — kaydınız alındı.</p>
          ) : (
            <form
              className="news-form"
              onSubmit={e => {
                e.preventDefault()
                setSent(true)
              }}
            >
              <input type="email" required placeholder="E-posta adresiniz" aria-label="E-posta adresiniz" />
              <button className="btn light">Abone ol</button>
              <label className="news-consent">
                <input type="checkbox" required /> Kişisel verilerimin işlenmesini ve ticari elektronik ileti almayı kabul ediyorum.
              </label>
            </form>
          )}
        </div>
      </section>
      <div className="wrap ftr-grid">
        <div className="ftr-brand">
          <Logo tagline />
          <p>1974’ten bu yana Valencia’da geliştirilen profesyonel dermokozmetik. Türkiye’de {CONTACT.company} güvencesiyle.</p>
          <a className="ftr-ig" href={CONTACT.instagram} target="_blank" rel="noreferrer">
            @casmara.turkiye ↗
          </a>
        </div>
        <div>
          <h3>Koleksiyonlar</h3>
          {nav.collections.slice(0, 9).map(l => (
            <Link key={l.to} to={l.to}>
              {l.label}
            </Link>
          ))}
          <Link to="/koleksiyonlar" className="more">
            Tümü →
          </Link>
        </div>
        <div>
          <h3>Cildiniz için</h3>
          {nav.concerns.map(l => (
            <Link key={l.to} to={l.to}>
              {l.label}
            </Link>
          ))}
        </div>
        <div>
          <h3>Kurumsal</h3>
          {nav.corporate.map(l => (
            <Link key={l.to} to={l.to}>
              {l.label}
            </Link>
          ))}
          {policies.map(p => (
            <Link key={p.slug} to={`/politikalar/${p.slug}`}>
              {p.title}
            </Link>
          ))}
        </div>
        <div className="ftr-contact">
          <h3>İletişim</h3>
          <p>{CONTACT.address}</p>
          <a href={CONTACT.phoneHref}>{CONTACT.phone}</a>
          <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
        </div>
      </div>
      <div className="wrap ftr-bottom">
        <span>© {new Date().getFullYear()} Casmara Türkiye · {CONTACT.company}</span>
        <span>Cosmetics without limits</span>
      </div>
    </footer>
  )
}

export default function Layout() {
  const curtain = useRef<HTMLDivElement>(null)
  useSmoothScroll()
  usePageChange(curtain)
  return (
    <>
      <div className="curtain" ref={curtain} aria-hidden>
        <Monogram />
      </div>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  )
}
