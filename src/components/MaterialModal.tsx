import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { COLORS, KINDS, USES, type Material } from '../data/materials'
import { StoneTile } from './StoneTile'

const PROPS: Record<Material['kind'], [string, string][]> = {
  granit: [
    ['Otpornost na mraz', 'Vrlo visoka'],
    ['Vanjska upotreba', 'Da – spomenici, fasade, stubišta'],
    ['Obrada', 'Polirano, brušeno, plamenjeno'],
  ],
  mramor: [
    ['Otpornost na mraz', 'Srednja – preporuka za interijere'],
    ['Vanjska upotreba', 'Ograničeno'],
    ['Obrada', 'Polirano, brušeno, antik'],
  ],
  travertin: [
    ['Otpornost na mraz', 'Dobra uz impregnaciju'],
    ['Vanjska upotreba', 'Da – fasade, terase'],
    ['Obrada', 'Brušeno, punjeno, antik'],
  ],
}

export function MaterialModal({
  material,
  onClose,
  onUse,
}: {
  material: Material | null
  onClose: () => void
  onUse: (m: Material) => void
}) {
  useEffect(() => {
    if (!material) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [material, onClose])

  return (
    <AnimatePresence>
      {material && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-end justify-center bg-black/70 p-0 backdrop-blur-sm md:items-center md:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={material.name}
        >
          <motion.div
            initial={{ y: 40, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 30, opacity: 0, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 260, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
            className="grid max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-t-3xl border border-line bg-ink-2 md:grid-cols-[1fr_1fr] md:rounded-3xl"
          >
            <StoneTile material={material} className="min-h-[260px] rounded-t-3xl md:min-h-[520px] md:rounded-l-3xl md:rounded-tr-none" />
            <div className="flex flex-col p-6 md:p-10">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-xs font-medium uppercase tracking-[0.22em] text-accent">
                    {KINDS.find((k) => k.id === material.kind)?.label}
                  </div>
                  <h3 className="mt-2 text-3xl font-light md:text-4xl">{material.name}</h3>
                  {material.altName && <div className="mt-1 text-sm text-mist">poznat i kao {material.altName}</div>}
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="grid size-10 shrink-0 place-items-center rounded-full border border-line text-mist transition hover:border-paper hover:text-paper"
                  aria-label="Zatvori"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M6 6l12 12M18 6L6 18" />
                  </svg>
                </button>
              </div>

              <p className="mt-6 leading-relaxed text-paper/85">{material.description}</p>

              <div className="mt-6 flex flex-wrap gap-2">
                {material.colors.map((c) => {
                  const col = COLORS.find((x) => x.id === c)!
                  return (
                    <span key={c} className="inline-flex items-center gap-2 rounded-full border border-line px-3 py-1 text-xs">
                      <span className="size-3 rounded-full" style={{ background: col.hex }} />
                      {col.label}
                    </span>
                  )
                })}
              </div>

              <dl className="mt-6 divide-y divide-line border-y border-line text-sm">
                {PROPS[material.kind].map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-4 py-2.5">
                    <dt className="text-mist">{k}</dt>
                    <dd className="text-right">{v}</dd>
                  </div>
                ))}
                <div className="flex justify-between gap-4 py-2.5">
                  <dt className="text-mist">Primjena</dt>
                  <dd className="text-right">{material.uses.map((u) => USES.find((x) => x.id === u)?.label).join(', ')}</dd>
                </div>
              </dl>

              <div className="mt-auto flex flex-wrap gap-3 pt-8">
                {material.kind === 'granit' && (
                  <button
                    type="button"
                    onClick={() => onUse(material)}
                    className="rounded-full bg-accent px-5 py-3 text-sm font-medium text-ink transition hover:bg-paper"
                  >
                    Isprobaj u konfiguratoru
                  </button>
                )}
                <a
                  href="#kontakt"
                  onClick={onClose}
                  className="rounded-full border border-paper/30 px-5 py-3 text-sm font-medium transition hover:border-paper"
                >
                  Zatraži ponudu
                </a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
