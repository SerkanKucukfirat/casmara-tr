import { useEffect, useRef } from 'react'
import { collections } from '../content'
import { useIntro, useReveal } from '../components/motion'
import { CollectionCard, PageHero } from '../components/ui'

export default function Collections() {
  const page = useRef<HTMLDivElement>(null)
  useIntro(page)
  useReveal(page)
  useEffect(() => {
    document.title = 'Koleksiyonlar — Casmara Türkiye'
  }, [])
  return (
    <div ref={page}>
      <PageHero
        eyebrow="Koleksiyonlar"
        title="Profesyonel bakım koleksiyonları"
        text="Valencia’daki Ar-Ge ve üretim tesislerinde geliştirilen kabin protokolleri, ev devam ürünleri ve markanın simgesi Algae Peel-Off maskeler."
        crumbs={[{ label: 'Koleksiyonlar' }]}
        image="infinity-pro"
      />
      <section className="section">
        <div className="wrap cgrid rv-stagger">
          {collections.map((c, n) => (
            <CollectionCard key={c.slug} c={c} index={n} />
          ))}
        </div>
      </section>
    </div>
  )
}
