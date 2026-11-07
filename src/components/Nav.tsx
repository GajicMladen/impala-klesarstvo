import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { asset } from '../lib/asset'

const links = [
  { to: '/materijali', label: 'Materijali' },
  { to: '/#radovi', label: 'Radovi' },
  { to: '/#usluge', label: 'Usluge' },
  { to: '/konfigurator', label: 'Konfigurator' },
  { to: '/#o-nama', label: 'O nama' },
  { to: '/#kontakt', label: 'Kontakt' },
]

export function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  const inConfigurator = pathname.startsWith('/konfigurator')

  useEffect(() => {
    let lastY = window.scrollY
    let anchorY = lastY // scroll position where the direction last changed
    let lastDir = 0
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 24)
      // phones only, configurator only: slide the bar away after ~10px of downward travel, bring it back after ~10px upward
      if (inConfigurator && window.matchMedia('(max-width: 767px)').matches) {
        const dir = y > lastY ? 1 : y < lastY ? -1 : 0
        if (dir !== 0 && dir !== lastDir) {
          anchorY = lastY
          lastDir = dir
        }
        if (y <= 80) setHidden(false)
        else if (dir === 1 && y - anchorY > 10) setHidden(true)
        else if (dir === -1 && anchorY - y > 10) setHidden(false)
      } else setHidden(false)
      lastY = y
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [inConfigurator])

  // sticky blocks (the configurator sketch) read this to sit right under the bar, or at the top when it is hidden
  useEffect(() => {
    document.documentElement.style.setProperty('--nav-h', hidden && !open ? '0px' : '76px')
  }, [hidden, open])

  useEffect(() => setOpen(false), [pathname])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled || open ? 'border-b border-line bg-ink/80 backdrop-blur-md' : ''
      } ${hidden && !open ? '-translate-y-full' : 'translate-y-0'}`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8">
        <Link to="/" className="flex items-center gap-3" aria-label="Impala Klesarstvo – početna">
          <span className="grid size-11 shrink-0 place-items-center overflow-hidden rounded-full bg-white">
            <img src={asset('logo-impala.jpg')} alt="" className="size-10 object-contain" />
          </span>
          <span className="leading-tight">
            <span className="block text-sm font-semibold tracking-[0.22em]">IMPALA</span>
            <span className="block text-[11px] uppercase tracking-[0.18em] text-mist">Klesarstvo · Vukovar</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Glavni izbornik">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`text-sm transition hover:text-paper ${pathname === l.to ? 'text-paper' : 'text-mist'}`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a href="tel:+385981826790" className="hidden text-sm text-mist transition hover:text-paper lg:block">
            098 182 6790
          </a>
          <Link
            to="/konfigurator"
            className="hidden rounded-full bg-accent px-4 py-2 text-sm font-medium text-ink transition hover:bg-paper md:block"
          >
            Dizajnirajte spomenik
          </Link>
          <button
            type="button"
            className="grid size-11 place-items-center rounded-full border border-line md:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? 'Zatvori izbornik' : 'Otvori izbornik'}
            aria-expanded={open}
          >
            <span className="relative block h-3 w-5">
              <span className={`absolute inset-x-0 top-0 h-px bg-paper transition ${open ? 'translate-y-1.5 rotate-45' : ''}`} />
              <span className={`absolute inset-x-0 top-1.5 h-px bg-paper transition ${open ? 'opacity-0' : ''}`} />
              <span className={`absolute inset-x-0 top-3 h-px bg-paper transition ${open ? '-translate-y-1.5 -rotate-45' : ''}`} />
            </span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden md:hidden"
            aria-label="Mobilni izbornik"
          >
            <div className="flex flex-col gap-1 px-5 pb-6">
              {links.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-3 text-lg text-paper/90 transition hover:bg-ink-2"
                >
                  {l.label}
                </Link>
              ))}
              <Link
                to="/konfigurator"
                onClick={() => setOpen(false)}
                className="mt-3 rounded-full bg-accent px-4 py-3 text-center font-medium text-ink"
              >
                Dizajnirajte spomenik
              </Link>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
