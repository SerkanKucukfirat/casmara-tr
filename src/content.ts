import data from './data/content.json'

export type Ingredient = { name: string; sub?: string; desc: string; image?: string | null }
export type Step = { n: string; title: string; desc: string }
export type Product = {
  name: string
  note?: string
  tag?: string
  desc: string
  features?: string[]
  inci?: { label: string; value: string }
  image?: string | null
}
export type Section =
  | { kind: 'hero'; eyebrow: string; title: string; subtitle: string; desc: string[]; benefits: string[] }
  | { kind: 'ingredients'; items: Ingredient[] }
  | { kind: 'protocol'; steps: Step[] }
  | { kind: 'products'; label: string; items: Product[] }
  | { kind: 'effects'; items: { title: string; desc: string }[] }
  | { kind: 'cta'; text: string; button: string }
  | { kind: 'usp'; items: string[] }

type Look = { slug: string; title: string; short: string; tagline: string; accent: string; tint: string; hero: string; card: string; wide?: string }
export type Collection = Look & { kind: 'collection'; sections: Section[]; gallery?: string[]; ing?: string }
export type Device = Look & {
  kind: 'device'
  eyebrow: string
  desc: string
  features: [string, string][]
  effects: [string, string][]
  about: string[]
  steps: string[]
  note: string
  uses: string[]
  cta: [string, string, string]
  faqs: Faq[]
}
export type Faq = { q: string; a: string }
export type ListingProduct = { name: string; desc: string; kind: string; collection: string | null; image: string | null }
export type Listing = {
  title: string
  slug: string
  heading: string
  tagline: string
  intro: string
  products: ListingProduct[]
  extra?: { title: string; subtitle: string; text: string } | null
  faqs: Faq[]
}
export type Active = { name: string; slug: string; tagline: string; desc: string; image?: string | null; used: { text: string; collection: string | null }[] }
export type Block = { t: 'h2' | 'h3' | 'p' | 'ul'; x: string | string[] }
export type Post = { slug: string; title: string; excerpt: string; blocks: Block[] }
export type Policy = { slug: string; title: string; blocks: Block[] }

export const collections = data.collections as unknown as (Collection | Device)[]
export const concerns = data.concerns as unknown as Listing[]
export const cares = data.cares as unknown as Listing[]
export const actives = data.actives as unknown as Active[]
export const posts = data.blog as unknown as Post[]
export const policies = data.policies as unknown as Policy[]
export const about = data.about as unknown as { title: string; intro: string; chapters: { title: string; text: string[] }[] }

const BASE = import.meta.env.BASE_URL
export const img = (name: string) => `${BASE}img/${name}.webp`
// Treatment still-lifes put the model's face at the far left; keep it in frame when cropped.
export const focus = (name: string) => (/-(treatment|pro)$/.test(name) ? '6% 50%' : '50% 50%')

export const bySlug = <T extends { slug: string }>(list: T[], slug?: string) => list.find(x => x.slug === slug)
export const section = <K extends Section['kind']>(c: Collection, kind: K) =>
  c.sections.find(s => s.kind === kind) as Extract<Section, { kind: K }> | undefined

// Ingredient pictures come from the printed catalogue; a few ingredients have none.
export const ingredientImage = (c: Collection, i: number) => {
  const pic = section(c, 'ingredients')?.items[i]?.image
  return pic ? img(pic) : null
}

export const CONTACT = {
  company: 'Slimwell Group',
  address: 'İçerenköy Mah. Karaman Çiftlik Yolu Cad. Karakum Sokak No:2 Ataşehir / İstanbul',
  phone: '+90 216 369 1 369',
  phoneHref: 'tel:+902163691369',
  email: 'info@slimwell.com.tr',
  instagram: 'https://www.instagram.com/casmara.turkiye/',
  web: 'www.casmaratr.com',
}

export const nav = {
  collections: collections.map(c => ({ to: `/koleksiyonlar/${c.slug}`, label: c.short })),
  concerns: concerns.map(c => ({ to: `/cilt-endiseleri/${c.slug}`, label: c.title })),
  cares: cares.map(c => ({ to: `/cilt-bakimlari/${c.slug}`, label: c.title })),
  actives: actives.map(a => ({ to: `/aktif-icerikler/${a.slug}`, label: a.name })),
  corporate: [
    { to: '/hakkimizda', label: 'Hakkımızda' },
    { to: '/blog', label: 'Blog' },
    { to: '/politikalar/gizlilik-politikasi', label: 'Politikalarımız' },
    { to: '/iletisim', label: 'İletişim' },
  ],
}

// Home: hero slides and favourites follow the site map in the brief.
export const heroSlides = [
  { slug: 'golden-age-intense-treatment', eyebrow: 'Yeni nesil profesyonel bakım', title: 'Golden Age', em: 'Intense Treatment', image: 'golden-still', pos: '50% 50%' },
  { slug: 'ocean-miracle-treatment', eyebrow: 'Hydra Lifting Beautyplan', title: 'Ocean', em: 'Miracle', image: 'ocean-pro', pos: '12% 50%' },
  { slug: 'super-konsantre-serumlar', eyebrow: 'Konsantre serum koleksiyonu', title: 'Süper Konsantre', em: 'Serumlar', image: 'serum-lightening', pos: '30% 50%' },
]
export const favourites = ['golden-age-intense-treatment', 'skin-sensations-treatment', 'goji-treatment', 'infinity-treatment']

export const milestones = [
  { year: '1974', text: 'Valencia’da kuruluş' },
  { year: '1978', text: 'İlk tek doz, kişiye özel kit bakım uygulamaları' },
  { year: '1979', text: 'Markanın simgesi Algae Peel-Off Maskeler' },
  { year: '1998', text: 'Coenzyme Q10 içeren ilk profesyonel uygulama' },
  { year: '2002', text: 'Argireline® profesyonel bakımda' },
  { year: '2009', text: 'Avrupa’nın ilk ECOCERT® sertifikalı Goji Berry dermokozmetiği' },
  { year: '2014', text: 'İlk iyonize maske' },
  { year: '2017', text: 'Dünyanın ilk pro ve prebiyotik kit bakımı' },
]

// Home "öne çıkanlar" rail: only products we have a real packshot for; the alt picture shows on hover.
export const featured = [
  { name: 'Power Lift 4D Super Concentrate', tab: 'Serumlar', slug: 'super-konsantre-serumlar', image: 'cat-powerlift-4d', alt: 'cat-serums-hero' },
  { name: 'Rose D-Tox Super Concentrate', tab: 'Serumlar', slug: 'super-konsantre-serumlar', image: 'cat-rose-dtox', alt: 'cat-serums-hero' },
  { name: 'Golden Age Intense Serum', tab: 'Serumlar', slug: 'golden-age-intense-treatment', image: 'golden-serum', alt: 'golden-still' },
  { name: 'Golden Age Intense Cream', tab: 'Kremler', slug: 'golden-age-intense-treatment', image: 'golden-cream', alt: 'vid-lineup' },
  { name: 'Infinity Cream', tab: 'Kremler', slug: 'infinity-treatment', image: 'infinity-cream', alt: 'infinity-hero-tr' },
  { name: 'Sensations Vitamin Shot', tab: 'Serumlar', slug: 'skin-sensations-treatment', image: 'sensations-shot', alt: 'sensations-hydronutri' },
  { name: 'RGnerin Wrinkle Serum', tab: 'Serumlar', slug: 'rgnerin-treatment', image: 'rgnerin-serum', alt: 'rgnerin-treatment' },
  { name: 'Marine Plasma Fresh Serum', tab: 'Serumlar', slug: 'ocean-miracle-treatment', image: 'marine-fresh', alt: 'ocean-pro' },
  { name: 'Q10 Rescue Intensive Nutri Cream', tab: 'Kremler', slug: 'q10-rescue-nutri-treatment', image: 'q10-pack', alt: 'q10-treatment' },
  { name: 'Clarifying Concentrated Serum', tab: 'Serumlar', slug: 'advanced-nacar-treatment', image: 'serum-lightening', alt: 'nacar-treatment' },
  { name: '3 in 1 Deep Cleanser', tab: 'Temizleyiciler', slug: 'temizleme-serisi', image: 'cleanser-deep', alt: 'cleansers-banner' },
  { name: 'Detox Cleanser', tab: 'Temizleyiciler', slug: 'temizleme-serisi', image: 'cat-detox-cleanser', alt: 'cleanser-balancing' },
  { name: 'Purifying Cleanser', tab: 'Temizleyiciler', slug: 'purifying-beautyplan-treatment', image: 'purifying-cleanser', alt: 'purifying-still' },
  { name: 'Eye Contour', tab: 'Kremler', slug: 'eye-perfection-beautyplan-treatment', image: 'eye-retail', alt: 'eye-pro' },
]
