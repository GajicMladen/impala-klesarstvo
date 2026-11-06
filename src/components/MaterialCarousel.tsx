import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { materials, type Material } from '../data/materials'
import { StoneTile } from './StoneTile'
import { SectionHead } from './SectionHead'

const featured = materials.filter((m) => m.featured)

export function MaterialCarousel({ onOpen }: { onOpen: (m: Material) => void }) {
  const n = featured.length
  const [active, setActive] = useState(0)
  const [small, setSmall] = useState(false)
  const [paused, setPaused] = useState(false)
  const drag = useRef<{ x: number; moved: boolean } | null>(null)
  const moved = useRef(false)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const update = () => setSmall(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    if (paused) return
    const t = setInterval(() => setActive((a) => (a + 1) % n), 4500)
    return () => clearInterval(t)
  }, [paused, n])

  const W = small ? 190 : 290
  const H = Math.round(W * 1.45)
  const X = small ? 170 : 330
  const prev = () => setActive((a) => (a - 1 + n) % n)
  const next = () => setActive((a) => (a + 1) % n)

  return (
    <section
      id="materijali"
      className="relative overflow-hidden py-24 md:py-32"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHead
          eyebrow="Materijali"
          title="Kamen koji traje generacijama"
          text="Graniti iz Indije, Južne Afrike i Skandinavije, mramori i travertini iz Italije. Listajte ponudu ili dodirnite karticu za detalje."
          action={
            <Link
              to="/materijali"
              className="inline-flex items-center gap-2 rounded-full bg-paper px-6 py-3.5 font-medium text-ink transition hover:bg-accent"
            >
              Svi materijali · {materials.length}
              <span aria-hidden="true">→</span>
            </Link>
          }
        />
      </div>

      <div
        className="relative mt-16 select-none outline-none"
        style={{ height: H + 96, perspective: 1400 }}
        tabIndex={0}
        aria-roledescription="carousel"
        aria-label="Istaknuti materijali"
        onPointerDown={(e) => {
          drag.current = { x: e.clientX, moved: false }
          moved.current = false
        }}
        onPointerMove={(e) => {
          if (drag.current && Math.abs(e.clientX - drag.current.x) > 8) drag.current.moved = true
        }}
        onPointerUp={(e) => {
          const d = drag.current
          drag.current = null
          if (!d) return
          moved.current = d.moved
          const dx = e.clientX - d.x
          if (dx < -40) next()
          else if (dx > 40) prev()
        }}
        onKeyDown={(e) => {
          if (e.key === 'ArrowLeft') prev()
          if (e.key === 'ArrowRight') next()
        }}
      >
        {featured.map((m, i) => {
          let d = i - active
          if (d > n / 2) d -= n
          if (d < -n / 2) d += n
          const ad = Math.abs(d)
          const hidden = ad > 2.5
          return (
            <motion.button
              key={m.id}
              type="button"
              className="absolute left-1/2 top-0 cursor-pointer text-left outline-none"
              style={{ width: W, marginLeft: -W / 2, transformStyle: 'preserve-3d', zIndex: 20 - Math.round(ad) }}
              animate={{
                x: d * X * (1 - ad * 0.05),
                rotateY: Math.max(-50, Math.min(50, -d * 24)),
                scale: 1 - Math.min(ad, 3) * 0.13,
                z: -ad * 120,
                opacity: hidden ? 0 : 1,
              }}
              transition={{ type: 'spring', stiffness: 160, damping: 26 }}
              onClick={() => {
                if (moved.current) return
                if (d === 0) onOpen(m)
                else setActive(i)
              }}
              aria-label={`${m.name}, ${m.country}`}
              tabIndex={-1}
            >
              <StoneTile
                material={m}
                className="rounded-2xl shadow-[0_30px_60px_-20px_rgba(0,0,0,0.85)]"
                style={{ height: H }}
              />
              <div className={`mt-5 text-center transition-opacity duration-300 ${small && d !== 0 ? 'opacity-0' : ''}`}>
                <div className="font-semibold">{m.name}</div>
                <div className="mt-1 text-[11px] uppercase tracking-[0.18em] text-mist">{m.country}</div>
              </div>
            </motion.button>
          )
        })}
      </div>

      <div className="mt-4 flex items-center justify-center gap-6">
        <button
          type="button"
          onClick={prev}
          className="grid size-11 place-items-center rounded-full border border-line text-mist transition hover:border-paper hover:text-paper"
          aria-label="Prethodni materijal"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M19 12H5M11 18l-6-6 6-6" />
          </svg>
        </button>
        <div className="text-xs tabular-nums text-mist">
          {active + 1} / {n}
        </div>
        <button
          type="button"
          onClick={next}
          className="grid size-11 place-items-center rounded-full border border-line text-mist transition hover:border-paper hover:text-paper"
          aria-label="Sljedeći materijal"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </button>
      </div>
    </section>
  )
}
