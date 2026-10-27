import { useEffect, useRef } from 'react'
import { Link, useParams } from 'react-router-dom'
import { bySlug, img, posts, type Block } from '../content'
import { useIntro, useReveal } from '../components/motion'
import { Arrow, PageHero } from '../components/ui'
import NotFound from './NotFound'

const COVERS: Record<string, string> = {
  'casmaranin-tarihcesi': 'poster-50',
  'casmara-teknolojisi': 'golden-lab',
  'peel-off-mask-nedir': 'gold-mask-model',
}

export function Blocks({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((b, i) => {
        if (b.t === 'ul')
          return (
            <ul key={i} className="rv">
              {(b.x as string[]).map(li => (
                <li key={li}>{li}</li>
              ))}
            </ul>
          )
        const Tag = b.t
        return (
          <Tag key={i} className="rv">
            {b.x as string}
          </Tag>
        )
      })}
    </>
  )
}

export function BlogIndex() {
  const page = useRef<HTMLDivElement>(null)
  useIntro(page)
  useReveal(page)
  useEffect(() => {
    document.title = 'Blog — Casmara Türkiye'
  }, [])
  return (
    <div ref={page}>
      <PageHero eyebrow="Blog" title="Güzelliğin bilimi üzerine" text="Casmara’nın hikâyesi, teknolojisi ve profesyonel bakım dünyasından yazılar." crumbs={[{ label: 'Blog' }]} />
      <section className="section">
        <div className="wrap bgrid rv-stagger">
          {posts.map(p => (
            <Link key={p.slug} to={`/blog/${p.slug}`} className="bcard">
              <div className="bcard-img">
                <img src={img(COVERS[p.slug] ?? 'hero-pink')} alt="" loading="lazy" />
              </div>
              <h2>{p.title}</h2>
              <p>{p.excerpt}</p>
              <span className="link">
                Devamını oku <Arrow />
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}

export function BlogPost() {
  const { slug } = useParams()
  const p = bySlug(posts, slug)
  const page = useRef<HTMLDivElement>(null)
  useIntro(page, [slug])
  useReveal(page, [slug])
  useEffect(() => {
    if (p) document.title = `${p.title} — Casmara Türkiye`
  }, [p])
  if (!p) return <NotFound />
  const others = posts.filter(x => x.slug !== p.slug)
  return (
    <div ref={page} key={p.slug}>
      <PageHero eyebrow="Blog" title={p.title} text={p.excerpt} crumbs={[{ to: '/blog', label: 'Blog' }, { label: 'Yazı' }]} image={COVERS[p.slug]} />
      <article className="section">
        <div className="wrap prose">
          <Blocks blocks={p.blocks} />
        </div>
      </article>
      <section className="section tight">
        <div className="wrap">
          <p className="eyebrow rv">Diğer yazılar</p>
          <div className="bgrid two rv-stagger">
            {others.map(o => (
              <Link key={o.slug} to={`/blog/${o.slug}`} className="bcard">
                <div className="bcard-img">
                  <img src={img(COVERS[o.slug] ?? 'hero-pink')} alt="" loading="lazy" />
                </div>
                <h2>{o.title}</h2>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
