import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { CONTACT, collections } from '../content'
import { useIntro, useReveal } from '../components/motion'
import { Arrow, PageHero } from '../components/ui'

// The form has no backend yet: it opens the visitor's mail app with everything filled in.
export default function Contact() {
  const [params] = useSearchParams()
  const subject = params.get('konu') ?? ''
  const page = useRef<HTMLDivElement>(null)
  const [sent, setSent] = useState(false)
  useIntro(page)
  useReveal(page)
  useEffect(() => {
    document.title = 'İletişim — Casmara Türkiye'
  }, [])
  return (
    <div ref={page}>
      <PageHero
        eyebrow="İletişim"
        title="Profesyonel bakım için bize ulaşın"
        text="Kabin protokolleri, eğitimler, bayilik ve ürünler hakkında bilgi almak için formu doldurun; ekibimiz en kısa sürede size dönsün."
        crumbs={[{ label: 'İletişim' }]}
        image="advisor"
      />
      <section className="section">
        <div className="wrap contact">
          <div className="contact-info rv-stagger">
            <div>
              <span>Türkiye distribütörü</span>
              <p>{CONTACT.company}</p>
            </div>
            <div>
              <span>Adres</span>
              <p>{CONTACT.address}</p>
            </div>
            <div>
              <span>Telefon</span>
              <a href={CONTACT.phoneHref}>{CONTACT.phone}</a>
            </div>
            <div>
              <span>E-posta</span>
              <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
            </div>
            <div>
              <span>Instagram</span>
              <a href={CONTACT.instagram} target="_blank" rel="noreferrer">
                @casmara.turkiye ↗
              </a>
            </div>
          </div>
          <form
            className="form rv"
            onSubmit={e => {
              e.preventDefault()
              const f = new FormData(e.currentTarget)
              const body = ['name', 'phone', 'email', 'type', 'message'].map(k => `${k}: ${f.get(k) ?? ''}`).join('\n')
              window.location.href = `mailto:${CONTACT.email}?subject=${encodeURIComponent(`Casmara web: ${f.get('topic')}`)}&body=${encodeURIComponent(body)}`
              setSent(true)
            }}
          >
            <label>
              <span>Ad Soyad</span>
              <input name="name" required autoComplete="name" />
            </label>
            <label>
              <span>Telefon</span>
              <input name="phone" type="tel" autoComplete="tel" />
            </label>
            <label>
              <span>E-posta</span>
              <input name="email" type="email" required autoComplete="email" />
            </label>
            <label>
              <span>Kim olarak yazıyorsunuz?</span>
              <select name="type" defaultValue="Güzellik merkezi / klinik">
                <option>Güzellik merkezi / klinik</option>
                <option>Estetisyen / uzman</option>
                <option>Bireysel kullanıcı</option>
                <option>Diğer</option>
              </select>
            </label>
            <label className="full">
              <span>Konu</span>
              <select name="topic" defaultValue={subject || 'Genel bilgi'}>
                <option>Genel bilgi</option>
                <option>E-Katalog</option>
                {collections.map(c => (
                  <option key={c.slug}>{c.title}</option>
                ))}
              </select>
            </label>
            <label className="full">
              <span>Mesajınız</span>
              <textarea name="message" rows={5} />
            </label>
            <label className="consent full">
              <input type="checkbox" required /> Kişisel verilerimin KVKK Aydınlatma Metni kapsamında işlenmesini kabul ediyorum.
            </label>
            <button className="btn">
              Gönder <Arrow />
            </button>
            {sent && <p className="form-ok">E-posta uygulamanız açıldı. Mesajınızı oradan gönderebilirsiniz.</p>}
          </form>
        </div>
      </section>
    </div>
  )
}
