import { useMemo, useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { COLORS, KINDS, USES, materials, type Color, type Kind, type Material, type Use } from '../data/materials'
import { StoneTile } from './StoneTile'

const ASPECTS = ['4 / 5', '3 / 4', '1 / 1', '4 / 5', '5 / 6', '3 / 4', '1 / 1', '4 / 5']

/* Filters only offer values that at least one stone in the current range has. */
const colorOptions = COLORS.filter((c) => materials.some((m) => m.colors.includes(c.id)))
const kindOptions = KINDS.filter((k) => materials.some((m) => m.kind === k.id))
const useOptions = USES.filter((u) => materials.some((m) => m.uses.includes(u.id)))

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className={`transition ${open ? '' : 'rotate-180'}`}
    >
      <path d="M12 19V5M5 12l7-7 7 7" />
    </svg>
  )
}

function FilterGroup({
  title,
  open,
  onToggle,
  children,
}: {
  title: string
  open: boolean
  onToggle: () => void
  children: ReactNode
}) {
  return (
    <div className="border-b border-line py-4">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between text-lg text-paper/90"
        aria-expanded={open}
      >
        {title}
        <Chevron open={open} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="flex flex-col gap-1 pt-3">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function Option({
  active,
  onClick,
  swatch,
  children,
}: {
  active: boolean
  onClick: () => void
  swatch?: string
  children: ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`flex items-center gap-3 rounded-lg px-2 py-1.5 text-left text-[15px] transition hover:bg-ink-2 ${
        active ? 'font-medium text-paper' : 'text-mist'
      }`}
    >
      {swatch && (
        <span
          className={`size-5 shrink-0 rounded-full border border-white/10 transition ${active ? 'ring-2 ring-accent ring-offset-2 ring-offset-ink' : ''}`}
          style={{ background: swatch }}
        />
      )}
      {children}
      {active && !swatch && <span className="ml-auto size-1.5 rounded-full bg-accent" />}
    </button>
  )
}

export function MaterialCatalog({ onOpen }: { onOpen: (m: Material) => void }) {
  const [colors, setColors] = useState<Set<Color>>(new Set())
  const [kind, setKind] = useState<Kind | null>(null)
  const [uses, setUses] = useState<Set<Use>>(new Set())
  const [open, setOpen] = useState({ boja: true, vrsta: true, primjena: false })
  const [mobileFilters, setMobileFilters] = useState(false)

  const toggleSet = <T,>(set: Set<T>, v: T) => {
    const next = new Set(set)
    if (next.has(v)) next.delete(v)
    else next.add(v)
    return next
  }

  const list = useMemo(
    () =>
      materials.filter(
        (m) =>
          (colors.size === 0 || m.colors.some((c) => colors.has(c))) &&
          (!kind || m.kind === kind) &&
          (uses.size === 0 || m.uses.some((u) => uses.has(u))),
      ),
    [colors, kind, uses],
  )

  const activeCount = colors.size + (kind ? 1 : 0) + uses.size
  const reset = () => {
    setColors(new Set())
    setKind(null)
    setUses(new Set())
  }

  const filters = (
    <>
      <FilterGroup title="Boja" open={open.boja} onToggle={() => setOpen((o) => ({ ...o, boja: !o.boja }))}>
        {colorOptions.map((c) => (
          <Option key={c.id} active={colors.has(c.id)} onClick={() => setColors(toggleSet(colors, c.id))} swatch={c.hex}>
            {c.label}
          </Option>
        ))}
      </FilterGroup>
      {kindOptions.length > 1 && (
        <FilterGroup title="Vrsta" open={open.vrsta} onToggle={() => setOpen((o) => ({ ...o, vrsta: !o.vrsta }))}>
          {kindOptions.map((k) => (
            <Option key={k.id} active={kind === k.id} onClick={() => setKind(kind === k.id ? null : k.id)}>
              {k.label}
            </Option>
          ))}
        </FilterGroup>
      )}
      <FilterGroup title="Primjena" open={open.primjena} onToggle={() => setOpen((o) => ({ ...o, primjena: !o.primjena }))}>
        {useOptions.map((u) => (
          <Option key={u.id} active={uses.has(u.id)} onClick={() => setUses(toggleSet(uses, u.id))}>
            {u.label}
          </Option>
        ))}
      </FilterGroup>
    </>
  )

  return (
    <div id="katalog">
      <div>
        <div className="mt-14 grid gap-10 lg:grid-cols-[260px_1fr]">
          <aside>
            <button
              type="button"
              className="flex w-full items-center justify-between rounded-xl border border-line px-4 py-3 lg:hidden"
              onClick={() => setMobileFilters((v) => !v)}
              aria-expanded={mobileFilters}
            >
              <span>Filtri{activeCount > 0 && <span className="ml-2 rounded-full bg-accent px-2 py-0.5 text-xs text-ink">{activeCount}</span>}</span>
              <Chevron open={mobileFilters} />
            </button>
            <div className={`${mobileFilters ? 'block' : 'hidden'} mt-4 lg:sticky lg:top-28 lg:mt-0 lg:block`}>{filters}</div>
          </aside>

          <div>
            <div className="mb-6 flex items-center justify-between text-sm text-mist">
              <span>
                <span className="font-medium text-paper">{list.length}</span> {list.length === 1 ? 'materijal' : list.length < 5 ? 'materijala' : 'materijala'}
              </span>
              {activeCount > 0 && (
                <button type="button" onClick={reset} className="underline-offset-4 transition hover:text-paper hover:underline">
                  Poništi filtre
                </button>
              )}
            </div>

            {list.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-line p-12 text-center text-mist">
                Nema materijala za odabranu kombinaciju filtera.
              </div>
            ) : (
              <div className="columns-2 gap-5 md:columns-3">
                {list.map((m, i) => (
                  <motion.button
                    key={m.id}
                    type="button"
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: Math.min(i, 8) * 0.04 }}
                    onClick={() => onOpen(m)}
                    className="group mb-5 block w-full break-inside-avoid text-left"
                  >
                    <StoneTile
                      material={m}
                      className="w-full rounded-2xl ring-0 ring-accent transition duration-300 group-hover:ring-[3px] group-focus-visible:ring-[3px]"
                      style={{ aspectRatio: ASPECTS[i % ASPECTS.length] }}
                    />
                    <div className="mt-3 flex items-baseline justify-between gap-3 px-1">
                      <span className="font-semibold transition group-hover:text-accent">{m.name}</span>
                      <span className="text-[11px] uppercase tracking-[0.16em] text-mist">{m.kind}</span>
                    </div>
                  </motion.button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
