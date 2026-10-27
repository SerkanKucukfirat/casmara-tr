import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Arrow, Monogram } from '../components/ui'

export default function NotFound() {
  useEffect(() => {
    document.title = 'Sayfa bulunamadı — Casmara Türkiye'
  }, [])
  return (
    <section className="nf">
      <Monogram className="nf-swirl" />
      <div className="wrap">
        <p className="eyebrow">404</p>
        <h1 className="display xl">Aradığınız sayfa bulunamadı</h1>
        <Link to="/" className="btn">
          Ana sayfaya dön <Arrow />
        </Link>
      </div>
    </section>
  )
}
