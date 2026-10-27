import { useEffect, useRef } from 'react'
import { about, img, milestones } from '../content'
import { useIntro, useReveal } from '../components/motion'
import { Monogram, PageHero } from '../components/ui'

const PICS = ['golden-lab', 'gold-mask-model', 'golden-hero-tr', 'poster-50']

export default function About() {
  const page = useRef<HTMLDivElement>(null)
  useIntro(page)
  useReveal(page)
  useEffect(() => {
    document.title = 'Hakkımızda — Casmara Türkiye'
  }, [])
  // a chapter without text is the heading of the next one ("Tek çatı altında…" + "Uçtan uca…")
  const chapters = about.chapters.flatMap((c, i, all) =>
    c.text.length ? [{ title: all[i - 1] && !all[i - 1].text.length ? all[i - 1].title : c.title, sub: all[i - 1] && !all[i - 1].text.length ? c.title : '', text: c.text }] : [],
  )
  return (
    <div ref={page}>
      <PageHero eyebrow="Hakkımızda" title={about.title} text={about.intro} crumbs={[{ label: 'Kurumsal' }, { label: 'Hakkımızda' }]} image="poster-50" />
      <section className="section">
        <div className="wrap stats big rv-stagger">
          <div>
            <strong>1974</strong>
            <span>Valencia, İspanya</span>
          </div>
          <div>
            <strong>80+</strong>
            <span>ülkede varlık</span>
          </div>
          <div>
            <strong>50+</strong>
            <span>yıllık deneyim</span>
          </div>
          <div>
            <strong>2017</strong>
            <span>Türkiye’de Slimwell Group ile</span>
          </div>
        </div>
      </section>
      {chapters.map((c, n) => (
        <section key={c.title} className={`section chapter ${n % 2 ? 'flip' : ''}`}>
          <div className="wrap ch-grid">
            <div className="ch-img rv-img">
              <img src={img(PICS[n % PICS.length])} alt="" loading="lazy" data-parallax="5" />
            </div>
            <div className="ch-copy">
              <em className="ch-n rv">{String(n + 1).padStart(2, '0')}</em>
              <h2 className="display l rv">{c.title}</h2>
              {c.sub && <p className="ch-sub rv">{c.sub}</p>}
              {c.text.map(t => (
                <p key={t.slice(0, 24)} className="rv">
                  {t}
                </p>
              ))}
            </div>
          </div>
        </section>
      ))}
      <section className="section timeline-sec">
        <Monogram className="tl-swirl" />
        <div className="wrap">
          <p className="eyebrow rv">Kilometre taşları</p>
          <ol className="timeline rv-stagger">
            {milestones.map(m => (
              <li key={m.year}>
                <strong>{m.year}</strong>
                <p>{m.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </div>
  )
}
