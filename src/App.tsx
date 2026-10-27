import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Collections from './pages/Collections'
import CollectionPage from './pages/Collection'
import { ListingIndex, ListingPage } from './pages/Listing'
import { ActiveIndex, ActivePage } from './pages/Actives'
import About from './pages/About'
import { BlogIndex, BlogPost } from './pages/Blog'
import PolicyPage from './pages/Policy'
import Contact from './pages/Contact'
import Search from './pages/Search'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '')}>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="koleksiyonlar" element={<Collections />} />
          <Route path="koleksiyonlar/:slug" element={<CollectionPage />} />
          <Route path="cilt-endiseleri" element={<ListingIndex group="concerns" />} />
          <Route path="cilt-endiseleri/:slug" element={<ListingPage group="concerns" />} />
          <Route path="cilt-bakimlari" element={<ListingIndex group="cares" />} />
          <Route path="cilt-bakimlari/:slug" element={<ListingPage group="cares" />} />
          <Route path="aktif-icerikler" element={<ActiveIndex />} />
          <Route path="aktif-icerikler/:slug" element={<ActivePage />} />
          <Route path="hakkimizda" element={<About />} />
          <Route path="blog" element={<BlogIndex />} />
          <Route path="blog/:slug" element={<BlogPost />} />
          <Route path="politikalar" element={<Navigate to="/politikalar/gizlilik-politikasi" replace />} />
          <Route path="politikalar/:slug" element={<PolicyPage />} />
          <Route path="iletisim" element={<Contact />} />
          <Route path="arama" element={<Search />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
