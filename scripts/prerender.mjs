// GitHub Pages has no SPA fallback: copy index.html into a folder per route so deep links load.
import { cpSync, mkdirSync, readFileSync } from 'node:fs'

const data = JSON.parse(readFileSync('src/data/content.json', 'utf8'))
const routes = [
  'koleksiyonlar', 'cilt-endiseleri', 'cilt-bakimlari', 'aktif-icerikler', 'hakkimizda', 'blog', 'iletisim', 'arama', 'politikalar',
  ...data.collections.map(c => `koleksiyonlar/${c.slug}`),
  ...data.concerns.map(c => `cilt-endiseleri/${c.slug}`),
  ...data.cares.map(c => `cilt-bakimlari/${c.slug}`),
  ...data.actives.map(a => `aktif-icerikler/${a.slug}`),
  ...data.blog.map(p => `blog/${p.slug}`),
  ...data.policies.map(p => `politikalar/${p.slug}`),
]
for (const r of routes) {
  mkdirSync(`dist/${r}`, { recursive: true })
  cpSync('dist/index.html', `dist/${r}/index.html`)
}
cpSync('dist/index.html', 'dist/404.html')
console.log(`prerendered ${routes.length} routes`)
