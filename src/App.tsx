import { useCallback, useEffect, useState } from 'react'
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import type { Material } from './data/materials'
import { Nav } from './components/Nav'
import { Footer } from './components/Footer'
import { MaterialModal } from './components/MaterialModal'
import { HomePage } from './pages/HomePage'
import { MaterialsPage } from './pages/MaterialsPage'
import { ConfiguratorPage } from './pages/ConfiguratorPage'

/** Scrolls to the top on route change, or to the #hash target when one is given. */
function ScrollManager() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      const id = hash.slice(1)
      const t = setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80)
      return () => clearTimeout(t)
    }
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [pathname, hash])
  return null
}

export default function App() {
  const [selected, setSelected] = useState<Material | null>(null)
  const navigate = useNavigate()

  const close = useCallback(() => setSelected(null), [])
  const useInConfigurator = useCallback(
    (m: Material) => {
      setSelected(null)
      navigate(`/konfigurator?kamen=${m.id}`)
    },
    [navigate],
  )

  return (
    <div className="font-sans">
      <ScrollManager />
      <Nav />
      <main>
        <Routes>
          <Route path="/" element={<HomePage onOpenMaterial={setSelected} />} />
          <Route path="/materijali" element={<MaterialsPage onOpenMaterial={setSelected} />} />
          <Route path="/konfigurator" element={<ConfiguratorPage />} />
          <Route path="*" element={<HomePage onOpenMaterial={setSelected} />} />
        </Routes>
      </main>
      <Footer />
      <MaterialModal material={selected} onClose={close} onUse={useInConfigurator} />
    </div>
  )
}
