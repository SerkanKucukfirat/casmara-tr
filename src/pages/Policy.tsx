import { useEffect, useRef } from 'react'
import { Link, useParams } from 'react-router-dom'
import { bySlug, policies } from '../content'
import { useIntro, useReveal } from '../components/motion'
import { PageHero } from '../components/ui'
import { Blocks } from './Blog'
import NotFound from './NotFound'

export default function PolicyPage() {
  const { slug } = useParams()
  const p = bySlug(policies, slug)
  const page = useRef<HTMLDivElement>(null)
  useIntro(page, [slug])
  useReveal(page, [slug])
  useEffect(() => {
    if (p) document.title = `${p.title} — Casmara Türkiye`
  }, [p])
  if (!p) return <NotFound />
  return (
    <div ref={page} key={p.slug}>
      <PageHero eyebrow="Politikalarımız" title={p.title} crumbs={[{ label: 'Kurumsal' }, { label: p.title }]} />
      <section className="section">
        <div className="wrap policy">
          <aside className="policy-nav">
            {policies.map(x => (
              <Link key={x.slug} to={`/politikalar/${x.slug}`} className={x.slug === p.slug ? 'on' : ''}>
                {x.title}
              </Link>
            ))}
          </aside>
          <div className="prose">
            <Blocks blocks={p.blocks} />
          </div>
        </div>
      </section>
    </div>
  )
}
