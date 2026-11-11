import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { works } from '../data/works'
import { SectionHead } from './SectionHead'
import { asset } from '../lib/asset'
import { FACEBOOK_URL, INSTAGRAM_URL } from '../data/contact'

export function Works() {
  const [open, setOpen] = useState<number | null>(null)
  const n = works.length

  useEffect(() => {
    if (open === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(null)
      if (e.key === 'ArrowRight') setOpen((o) => (o === null ? o : (o + 1) % n))
      if (e.key === 'ArrowLeft') setOpen((o) => (o === null ? o : (o - 1 + n) % n))
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, n])

  return (
    <section id="radovi" className="border-t border-line py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHead
          eyebrow="Radovi"
          title="Iz naše radionice diljem Slavonije i Srijema"
          text="Izbor nedavnih radova – od spomenika i obiteljskih grobnica do stubišta i šankova. Svaki rad izrađujemo po mjeri, u dogovoru s naručiteljem."
          action={
            <div className="flex flex-wrap gap-3">
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-3 text-sm text-mist transition hover:border-paper hover:text-paper"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" />
                </svg>
                Instagram
              </a>
              <a
                href={FACEBOOK_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-3 text-sm text-mist transition hover:border-paper hover:text-paper"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M13.5 21v-7.5h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.5-1.5h1.6V4.4c-.3 0-1.2-.1-2.3-.1-2.3 0-3.8 1.4-3.8 3.9v2.3H7.9v3h2.6V21h3Z" />
                </svg>
                Facebook
              </a>
            </div>
          }
        />

        <div className="mt-14 columns-2 gap-4 md:columns-3 lg:columns-4">
          {works.map((w, i) => (
            <motion.button
              key={w.src}
              type="button"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.6, delay: (i % 4) * 0.08 }}
              onClick={() => setOpen(i)}
              className="group relative mb-4 block w-full break-inside-avoid overflow-hidden rounded-2xl bg-ink-2 text-left"
              aria-label={`${w.title}, ${w.material}`}
            >
              <img
                src={asset(w.src)}
                alt={w.title}
                loading="lazy"
                className="block w-full object-cover transition duration-700 group-hover:scale-[1.04]"
                style={{ aspectRatio: w.portrait ? '3 / 4' : '4 / 3' }}
              />
              <div className="absolute inset-x-0 bottom-0 translate-y-2 bg-linear-to-t from-black/85 to-transparent p-4 pt-12 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                <div className="text-sm font-medium">{w.title}</div>
                <div className="mt-0.5 text-xs text-beige/80">{w.material}</div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {open !== null && (
          <motion.div
            className="fixed inset-0 z-[80] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(null)}
            role="dialog"
            aria-modal="true"
            aria-label={works[open].title}
          >
            <button
              type="button"
              className="absolute left-4 top-1/2 grid size-12 -translate-y-1/2 place-items-center rounded-full border border-white/20 text-paper/80 transition hover:bg-white/10 md:left-8"
              onClick={(e) => {
                e.stopPropagation()
                setOpen((o) => (o === null ? o : (o - 1 + n) % n))
              }}
              aria-label="Prethodna fotografija"
            >
              ←
            </button>
            <motion.figure
              key={open}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
              className="max-h-full"
            >
              <img src={asset(works[open].src)} alt={works[open].title} className="max-h-[78vh] rounded-2xl object-contain" />
              <figcaption className="mt-4 text-center">
                <div className="font-medium">{works[open].title}</div>
                <div className="text-sm text-mist">{works[open].material}</div>
              </figcaption>
            </motion.figure>
            <button
              type="button"
              className="absolute right-4 top-1/2 grid size-12 -translate-y-1/2 place-items-center rounded-full border border-white/20 text-paper/80 transition hover:bg-white/10 md:right-8"
              onClick={(e) => {
                e.stopPropagation()
                setOpen((o) => (o === null ? o : (o + 1) % n))
              }}
              aria-label="Sljedeća fotografija"
            >
              →
            </button>
            <button
              type="button"
              className="absolute right-4 top-4 grid size-11 place-items-center rounded-full border border-white/20 text-paper/80 transition hover:bg-white/10"
              onClick={() => setOpen(null)}
              aria-label="Zatvori"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
