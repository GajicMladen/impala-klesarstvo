import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { byId, materials } from '../../data/materials'
import { useTexture } from '../../lib/useTexture'
import { paletteLightness } from '../../lib/textures'
import { StoneTile } from '../StoneTile'
import {
  SHAPES,
  DECORS,
  FIGURES,
  VASES,
  LANTERNS,
  FONTS,
  INKS,
  ROLE_LABEL,
  ROLE_SIZE,
  defaultElems,
  bboxOf,
  elemLabel,
  elemPrice,
  uid,
  type Elem,
  type ShapeId,
  type TextRole,
  type DecorId,
  type FigureId,
  type VaseId,
  type LanternId,
  type PhotoElem,
  type TextElem,
  type StrokeElem,
} from './scene'
import { DecorShape, FigureShape, VaseShape, LanternShape, PhotoSilhouette } from './parts'

const granites = materials.filter((m) => m.kind === 'granit')
const PHONE = '385981826790'

type Tab = 'oblik' | 'kamen' | 'natpisi' | 'foto' | 'ukrasi' | 'dodaci'
const TABS: { id: Tab; label: string }[] = [
  { id: 'oblik', label: 'Oblik' },
  { id: 'kamen', label: 'Kamen i slova' },
  { id: 'natpisi', label: 'Natpisi' },
  { id: 'foto', label: 'Fotografije' },
  { id: 'ukrasi', label: 'Ukrasi' },
  { id: 'dodaci', label: 'Vaze i lampioni' },
]

/* ---------- small UI helpers ---------- */

function Group({ title, hint, children }: { title: string; hint?: ReactNode; children: ReactNode }) {
  return (
    <div>
      <div className="mb-3 flex items-baseline justify-between gap-4">
        <div className="text-xs font-medium uppercase tracking-[0.2em] text-mist">{title}</div>
        {hint && <div className="text-right text-xs text-mist/70">{hint}</div>}
      </div>
      {children}
    </div>
  )
}

function Pill({ active, onClick, children, className = '' }: { active?: boolean; onClick: () => void; children: ReactNode; className?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full border px-4 py-2 text-sm transition ${
        active ? 'border-accent bg-accent text-ink' : 'border-line text-paper/85 hover:border-paper/60'
      } ${className}`}
    >
      {children}
    </button>
  )
}

function Range({ label, value, min, max, onChange }: { label: string; value: number; min: number; max: number; onChange: (v: number) => void }) {
  return (
    <label className="block">
      <div className="mb-1.5 flex justify-between text-sm">
        <span className="text-paper/85">{label}</span>
        <span className="tabular-nums text-mist">{value} cm</span>
      </div>
      <input type="range" min={min} max={max} step={5} value={value} onChange={(e) => onChange(Number(e.target.value))} className="w-full accent-accent" />
    </label>
  )
}

function Tile({ label, onClick, children }: { label: string; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex flex-col items-center gap-2 rounded-2xl border border-line bg-ink p-3 text-center text-xs text-mist transition hover:border-accent hover:text-paper"
      aria-label={`Dodaj: ${label}`}
    >
      <span className="grid h-20 w-full place-items-center rounded-xl bg-ink-2 transition group-hover:bg-ink-3">{children}</span>
      <span className="leading-tight">{label}</span>
      <span className="text-[10px] uppercase tracking-[0.16em] text-accent opacity-0 transition group-hover:opacity-100">+ dodaj</span>
    </button>
  )
}

function IconBtn({ onClick, label, children, accent, disabled }: { onClick: () => void; label: string; children: ReactNode; accent?: boolean; disabled?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition disabled:opacity-40 ${
        accent ? 'border-accent bg-accent text-ink hover:bg-paper' : 'border-line text-paper/85 hover:border-paper/60'
      }`}
    >
      {children}
      <span>{label}</span>
    </button>
  )
}

/** Stone-filled thumbnail used for vases / lanterns. */
function StoneThumb({ id, tex, base, viewBox, children }: { id: string; tex: string | null; base: string; viewBox: string; children: (fill: string) => ReactNode }) {
  const pid = `thumb-${id}`
  return (
    <svg viewBox={viewBox} className="h-16" aria-hidden="true">
      <defs>
        <pattern id={pid} patternUnits="userSpaceOnUse" x="-60" y="-80" width="120" height="120">
          <rect width="120" height="120" fill={base} />
          {tex && <image href={tex} width="120" height="120" />}
        </pattern>
      </defs>
      {children(`url(#${pid})`)}
    </svg>
  )
}

/* ---------- component ---------- */

type Drag = { id: string; startX: number; startY: number; origin: Elem }

export function Configurator({ initialMaterial }: { initialMaterial?: string }) {
  const [shape, setShape] = useState<ShapeId>('klasik')
  const [matId, setMatId] = useState(initialMaterial && byId(initialMaterial)?.kind === 'granit' ? initialMaterial : 'impala')
  const [baseId, setBaseId] = useState('bianco-sardo')
  const [font, setFont] = useState('serif')
  const [ink, setInk] = useState('gold')
  const [width, setWidth] = useState(90)
  const [height, setHeight] = useState(90)
  const [elems, setElems] = useState<Elem[]>(() => defaultElems(SHAPES[0], 220))
  const [selected, setSelected] = useState<string | null>(null)
  const [mode, setMode] = useState<'select' | 'draw'>('select')
  const [tab, setTab] = useState<Tab>('oblik')
  const [toasts, setToasts] = useState<{ id: string; text: string }[]>([])
  const [liveStroke, setLiveStroke] = useState<number[] | null>(null)
  const [showSummary, setShowSummary] = useState(false)
  const [copied, setCopied] = useState(false)

  const svgRef = useRef<SVGSVGElement>(null)
  const sketchRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef<Drag | null>(null)
  const drawRef = useRef<number[] | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const uploadTarget = useRef<string | null>(null)

  useEffect(() => {
    if (initialMaterial && byId(initialMaterial)?.kind === 'granit') setMatId(initialMaterial)
  }, [initialMaterial])

  const S = SHAPES.find((s) => s.id === shape)!
  const mat = byId(matId) ?? granites[0]
  const baseMat = byId(baseId) ?? granites[0]
  const marble = byId('bianco-carrara')!
  const tex = useTexture(mat)
  const baseTex = useTexture(baseMat)
  const marbleTex = useTexture(marble)
  const light = paletteLightness(mat.texture) > 0.5
  const inkHex = INKS.find((i) => i.id === ink)!.hex
  const fontFamily = FONTS.find((f) => f.id === font)!.family
  // the sketch shows only the proportions of the plate (width : height), always fitted inside the frame
  const aspect = width / height
  const fit = Math.min(1, 215 / (S.half * Math.sqrt(aspect)), 1.1 * Math.sqrt(aspect))
  const sx = Math.sqrt(aspect) * fit
  const sy = fit / Math.sqrt(aspect)
  const halfPlate = S.half * sx
  const halfPlinth = halfPlate + 18
  const halfSlab = Math.max(halfPlinth + 50, 220)
  const reliefColor = light ? 'rgba(0,0,0,0.45)' : 'rgba(255,255,255,0.55)'

  useEffect(() => {
    if (light && (ink === 'white' || ink === 'silver')) setInk('black')
    if (!light && ink === 'black') setInk('gold')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [light])

  /* ---------- toasts ---------- */
  const toast = useCallback((text: string) => {
    const id = uid()
    setToasts((t) => [...t, { id, text }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2600)
  }, [])

  /* ---------- element operations ---------- */
  const texts = elems.filter((e): e is TextElem => e.kind === 'text')
  const photos = elems.filter((e): e is PhotoElem => e.kind === 'photo')
  const strokes = elems.filter((e): e is StrokeElem => e.kind === 'stroke')
  const sel = elems.find((e) => e.id === selected) ?? null

  const update = useCallback(<T extends Elem>(id: string, patch: Partial<T>) => {
    setElems((prev) => prev.map((el) => (el.id === id ? ({ ...el, ...patch } as Elem) : el)))
  }, [])
  const remove = useCallback(
    (id: string) => {
      setElems((prev) => {
        const el = prev.find((e) => e.id === id)
        if (el) toast(`Uklonjeno: ${elemLabel(el)}`)
        return prev.filter((e) => e.id !== id)
      })
      setSelected((s) => (s === id ? null : s))
    },
    [toast],
  )
  const add = useCallback(
    (el: Elem, msg: string) => {
      setElems((p) => [...p, el])
      setSelected(el.id)
      toast(msg)
    },
    [toast],
  )

  const addText = (role: TextRole) => {
    const lowest = texts.reduce((m, t) => Math.max(m, t.y), S.textTop - 30)
    const text = role === 'ime' ? 'Ime' : role === 'godine' ? '19xx – 20xx' : role === 'epitaf' ? 'Epitaf' : 'PREZIME'
    add({ id: uid(), kind: 'text', role, text, size: ROLE_SIZE[role], x: 300, y: Math.min(lowest + 30, 322) }, `Dodan natpis: ${ROLE_LABEL[role]}. Povucite ga na željeno mjesto.`)
  }
  const addPhoto = (src?: string) => {
    const n = photos.length
    add(
      { id: uid(), kind: 'photo', x: 300 + (n % 2 === 0 ? -1 : 1) * (n ? 74 : 0), y: S.photoY, w: 54, h: 70, src },
      src ? 'Fotografija dodana na skicu. Povucite je na željeno mjesto.' : 'Dodan okvir za fotografiju. Povucite ga na željeno mjesto.',
    )
  }
  const addDecor = (d: DecorId) => {
    const pos = d === 'ruza' ? { x: 300 - S.half + 42, y: S.textTop + 30 } : { x: 300 + S.half - 50, y: S.textTop - 20 }
    add({ id: uid(), kind: 'decor', decor: d, ...pos, scale: 1 }, `Dodano: ${DECORS.find((x) => x.id === d)!.label}. Povucite na željeno mjesto.`)
  }
  const addFigure = (f: FigureId) =>
    add({ id: uid(), kind: 'figure', figure: f, x: 300 + halfPlinth + 34, y: 352, scale: 1 }, `Dodano: ${FIGURES.find((x) => x.id === f)!.label}. Povucite na postolje.`)
  const addVase = (v: VaseId) =>
    add({ id: uid(), kind: 'vase', variant: v, x: 300 - halfSlab + 26, y: 352 }, `Dodano: ${VASES.find((x) => x.id === v)!.label}. Povucite na postolje.`)
  const addLantern = (l: LanternId) =>
    add({ id: uid(), kind: 'lantern', variant: l, x: 352, y: 404 }, `Dodano: ${LANTERNS.find((x) => x.id === l)!.label}. Povucite na željeno mjesto.`)

  const resetAll = () => {
    setElems(defaultElems(S, halfSlab))
    setSelected(null)
    setMode('select')
    toast('Skica vraćena na početne postavke.')
  }

  /* any interaction outside the sketch column ends drawing mode */
  useEffect(() => {
    if (mode !== 'draw') return
    const onOutside = (e: Event) => {
      if (!sketchRef.current?.contains(e.target as Node)) setMode('select')
    }
    const events = ['pointerdown', 'click', 'focusin'] as const
    events.forEach((ev) => document.addEventListener(ev, onOutside, true))
    return () => events.forEach((ev) => document.removeEventListener(ev, onOutside, true))
  }, [mode])

  /* ---------- keyboard ---------- */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA')) return
      if ((e.key === 'Delete' || e.key === 'Backspace') && selected) {
        e.preventDefault()
        remove(selected)
      }
      if (e.key === 'Escape') {
        setSelected(null)
        setMode('select')
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [selected, remove])

  /* ---------- pointer interaction on the sketch ---------- */
  const toSvg = (e: { clientX: number; clientY: number }) => {
    const svg = svgRef.current!
    const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(svg.getScreenCTM()!.inverse())
    return { x: p.x, y: p.y }
  }
  const onSvgPointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    if (mode === 'draw') {
      try {
        e.currentTarget.setPointerCapture(e.pointerId)
      } catch {
        /* see above */
      }
      const p = toSvg(e)
      drawRef.current = [p.x, p.y]
      setLiveStroke([p.x, p.y])
    } else {
      setSelected(null)
    }
  }
  const onElemPointerDown = (e: React.PointerEvent, el: Elem) => {
    if (mode === 'draw') return
    e.stopPropagation()
    try {
      svgRef.current?.setPointerCapture(e.pointerId)
    } catch {
      /* pointer capture unavailable – dragging still works while the pointer stays over the sketch */
    }
    setSelected(el.id)
    const p = toSvg(e)
    dragRef.current = { id: el.id, startX: p.x, startY: p.y, origin: el }
  }
  const onSvgPointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const d = dragRef.current
    if (d) {
      const p = toSvg(e)
      const dx = p.x - d.startX
      const dy = p.y - d.startY
      const o = d.origin
      setElems((prev) =>
        prev.map((el) => {
          if (el.id !== d.id) return el
          if (o.kind === 'stroke') return { ...el, points: o.points.map((v, i) => (i % 2 === 0 ? v + dx : v + dy)) } as Elem
          return { ...el, x: o.x + dx, y: o.y + dy } as Elem
        }),
      )
    } else if (drawRef.current) {
      const p = toSvg(e)
      drawRef.current.push(p.x, p.y)
      setLiveStroke([...drawRef.current])
    }
  }
  const onSvgPointerUp = () => {
    dragRef.current = null
    if (drawRef.current) {
      const pts = drawRef.current
      drawRef.current = null
      setLiveStroke(null)
      if (pts.length >= 6) setElems((p) => [...p, { id: uid(), kind: 'stroke', points: pts }])
    }
  }
  const undoStroke = () => {
    const last = strokes[strokes.length - 1]
    if (last) setElems((p) => p.filter((e) => e.id !== last.id))
  }
  const clearStrokes = () => {
    if (!strokes.length) return
    setElems((p) => p.filter((e) => e.kind !== 'stroke'))
    toast('Docrtane linije obrisane.')
  }

  /* ---------- photo upload ---------- */
  const pickPhoto = (targetId: string | null) => {
    uploadTarget.current = targetId
    fileRef.current?.click()
  }
  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const img = new Image()
      img.onload = () => {
        const k = Math.min(1, 480 / Math.max(img.width, img.height))
        const c = document.createElement('canvas')
        c.width = Math.round(img.width * k)
        c.height = Math.round(img.height * k)
        c.getContext('2d')!.drawImage(img, 0, 0, c.width, c.height)
        const src = c.toDataURL('image/jpeg', 0.85)
        const target = uploadTarget.current
        uploadTarget.current = null
        if (target) {
          update<PhotoElem>(target, { src })
          toast('Fotografija postavljena u okvir.')
        } else addPhoto(src)
      }
      img.src = reader.result as string
    }
    reader.readAsDataURL(file)
  }

  /* ---------- price / summary / export ---------- */
  const price = useMemo(() => {
    const sizeF = Math.pow((width * height) / 8100, 0.7)
    const extras = elems.reduce((s, el) => s + elemPrice(el), 0)
    const raw = S.base * (mat.priceFactor ?? 1) * sizeF + 350 * (baseMat.priceFactor ?? 1) + extras
    return Math.round(raw / 10) * 10
  }, [width, height, elems, S, mat, baseMat])
  const fmt = (n: number) => n.toLocaleString('hr-HR')

  const ornaments = elems.filter((e) => e.kind === 'decor' || e.kind === 'figure').map(elemLabel)
  const extrasList = elems.filter((e) => e.kind === 'vase' || e.kind === 'lantern').map(elemLabel)
  const summary = [
    'Upit za ponudu – Impala Klesarstvo',
    `Oblik: ${S.label}${strokes.length ? ` + docrtano (${strokes.length} linija)` : ''}`,
    `Kamen ploče: ${mat.name} (${mat.country})`,
    `Postolje: ${baseMat.name}`,
    `Dimenzije ploče: ${width} × ${height} cm`,
    `Natpisi: ${texts.map((t) => `${ROLE_LABEL[t.role]}: ${t.text}`).join(' | ') || 'bez natpisa'}`,
    `Slova: ${FONTS.find((f) => f.id === font)!.label}, ${INKS.find((i) => i.id === ink)!.label.toLowerCase()}`,
    `Fotografije: ${photos.length}${photos.some((p) => p.src) ? ' (priložene na skici)' : ''}`,
    `Ukrasi: ${ornaments.join(', ') || 'bez ukrasa'}`,
    `Vaze i lampioni: ${extrasList.join(', ') || 'bez'}`,
  ].join('\n')
  const waHref = `https://wa.me/${PHONE}?text=${encodeURIComponent(summary)}`

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(summary)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      /* clipboard unavailable */
    }
  }

  const exportPng = () => {
    const svg = svgRef.current
    if (!svg) return
    const xml = new XMLSerializer().serializeToString(svg)
    const url = URL.createObjectURL(new Blob([xml], { type: 'image/svg+xml;charset=utf-8' }))
    const img = new Image()
    img.onload = () => {
      const c = document.createElement('canvas')
      c.width = 1800
      c.height = 1350
      c.getContext('2d')!.drawImage(img, 0, 0, c.width, c.height)
      URL.revokeObjectURL(url)
      const a = document.createElement('a')
      const surname = texts.find((t) => t.role === 'prezime')?.text.toLowerCase() || 'spomenik'
      a.download = `impala-skica-${surname}.png`
      a.href = c.toDataURL('image/png')
      a.click()
      toast('Skica preuzeta kao PNG.')
    }
    img.src = url
  }

  /* ---------- render helpers ---------- */
  const Hit = ({ el }: { el: Elem }) => {
    const b = bboxOf(el)
    return <rect x={b.x} y={b.y} width={b.w} height={b.h} fill="#000" fillOpacity="0" />
  }
  const selBox = sel ? bboxOf(sel) : null

  const renderElem = (el: Elem) => {
    const common = {
      onPointerDown: (e: React.PointerEvent) => onElemPointerDown(e, el),
      style: { cursor: mode === 'draw' ? 'crosshair' : 'move' } as React.CSSProperties,
    }
    switch (el.kind) {
      case 'text':
        return (
          <g key={el.id} {...common}>
            <Hit el={el} />
            <text
              x={el.x}
              y={el.y}
              textAnchor="middle"
              fontSize={el.size}
              fontFamily={fontFamily}
              fontWeight={el.role === 'prezime' ? 600 : 400}
              fontStyle={el.role === 'epitaf' ? 'italic' : 'normal'}
              letterSpacing={el.role === 'prezime' ? 4 : el.role === 'ime' ? 1.5 : 0.5}
              fill={inkHex}
              filter="url(#cfg-engrave)"
            >
              {el.role === 'prezime' ? el.text.toUpperCase() : el.text}
            </text>
          </g>
        )
      case 'photo':
        return (
          <g key={el.id} {...common} transform={`translate(${el.x} ${el.y})`}>
            <ellipse rx={el.w / 2} ry={el.h / 2} fill="#d8d5cf" stroke={inkHex} strokeWidth="2" />
            {el.src ? (
              <image
                href={el.src}
                x={-el.w / 2}
                y={-el.h / 2}
                width={el.w}
                height={el.h}
                preserveAspectRatio="xMidYMid slice"
                clipPath={`url(#clip-${el.id})`}
              />
            ) : (
              <PhotoSilhouette w={el.w} h={el.h} />
            )}
            <ellipse rx={el.w / 2} ry={el.h / 2} fill="#000" fillOpacity="0" />
          </g>
        )
      case 'decor':
        return (
          <g key={el.id} {...common}>
            <Hit el={el} />
            <g transform={`translate(${el.x} ${el.y}) scale(${el.scale})`}>
              <DecorShape id={el.decor} color={el.decor === 'kriz' || el.decor === 'pravoslavni' ? inkHex : reliefColor} />
            </g>
          </g>
        )
      case 'figure':
        return (
          <g key={el.id} {...common}>
            <Hit el={el} />
            <g transform={`translate(${el.x} ${el.y}) scale(${el.scale})`} filter="url(#cfg-shadow-sm)">
              <FigureShape id={el.figure} fill="url(#cfg-marble)" />
            </g>
          </g>
        )
      case 'vase':
        return (
          <g key={el.id} {...common}>
            <Hit el={el} />
            <g transform={`translate(${el.x} ${el.y})`}>
              <VaseShape id={el.variant} fill="url(#cfg-stone)" gloss="url(#cfg-gloss)" />
            </g>
          </g>
        )
      case 'lantern':
        return (
          <g key={el.id} {...common}>
            <Hit el={el} />
            <g transform={`translate(${el.x} ${el.y})`}>
              <LanternShape id={el.variant} fill="url(#cfg-stone)" gloss="url(#cfg-gloss)" />
            </g>
          </g>
        )
      case 'stroke':
        return (
          <g key={el.id} {...common}>
            <polyline points={el.points.join(' ')} fill="none" stroke="#000" strokeOpacity="0.55" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" />
            <polyline points={el.points.join(' ')} fill="none" stroke="url(#cfg-stone)" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" />
            <polyline points={el.points.join(' ')} fill="none" stroke="url(#cfg-gloss)" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        )
    }
  }

  const order: Record<Elem['kind'], number> = { stroke: 0, figure: 1, vase: 2, lantern: 3, decor: 4, photo: 5, text: 6 }
  const sorted = [...elems].sort((a, b) => order[a.kind] - order[b.kind])

  /* ---------- JSX ---------- */
  return (
    <div className="mx-auto mt-10 max-w-7xl md:px-8 lg:mt-14">
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFile} />

      <div className="grid gap-6 lg:grid-cols-[1.15fr_1fr] lg:gap-10">
        {/* ---------- sketch (sticky) ---------- */}
        <div ref={sketchRef} className="sticky top-[76px] z-30 min-w-0 self-start bg-ink pb-3 md:top-24">
          <div className="relative overflow-hidden border-y border-line bg-ink md:rounded-3xl md:border">
            <svg
              ref={svgRef}
              viewBox="0 0 600 450"
              className="block h-auto w-full select-none"
              style={{ touchAction: 'none', cursor: mode === 'draw' ? 'crosshair' : 'default' }}
              onPointerDown={onSvgPointerDown}
              onPointerMove={onSvgPointerMove}
              onPointerUp={onSvgPointerUp}
              onPointerCancel={onSvgPointerUp}
              role="img"
              aria-label="Skica spomenika"
              fontFamily="Gantari, sans-serif"
            >
              <defs>
                <radialGradient id="cfg-bg" cx="50%" cy="35%" r="75%">
                  <stop offset="0" stopColor="#232427" />
                  <stop offset="1" stopColor="#0b0b0c" />
                </radialGradient>
                <linearGradient id="cfg-gloss" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#fff" stopOpacity="0.22" />
                  <stop offset="0.35" stopColor="#fff" stopOpacity="0.04" />
                  <stop offset="0.6" stopColor="#000" stopOpacity="0.14" />
                  <stop offset="1" stopColor="#fff" stopOpacity="0.08" />
                </linearGradient>
                <pattern id="cfg-stone" patternUnits="userSpaceOnUse" width="512" height="512">
                  <rect width="512" height="512" fill={mat.texture.palette[2] ?? '#333'} />
                  {tex && <image href={tex} width="512" height="512" />}
                </pattern>
                <pattern id="cfg-base" patternUnits="userSpaceOnUse" width="512" height="512" x="40" y="60">
                  <rect width="512" height="512" fill={baseMat.texture.palette[2] ?? '#555'} />
                  {baseTex && <image href={baseTex} width="512" height="512" />}
                </pattern>
                <pattern id="cfg-marble" patternUnits="userSpaceOnUse" width="256" height="256">
                  <rect width="256" height="256" fill="#e8e6e2" />
                  {marbleTex && <image href={marbleTex} width="256" height="256" />}
                </pattern>
                <filter id="cfg-shadow" x="-20%" y="-20%" width="140%" height="160%">
                  <feDropShadow dx="0" dy="12" stdDeviation="10" floodColor="#000" floodOpacity="0.6" />
                </filter>
                <filter id="cfg-shadow-sm" x="-30%" y="-20%" width="160%" height="150%">
                  <feDropShadow dx="2" dy="4" stdDeviation="3" floodColor="#000" floodOpacity="0.55" />
                </filter>
                <filter id="cfg-engrave" x="-10%" y="-10%" width="120%" height="130%">
                  <feDropShadow dx="0" dy="0.9" stdDeviation="0.5" floodColor="#000" floodOpacity="0.75" />
                </filter>
                {photos
                  .filter((p) => p.src)
                  .map((p) => (
                    <clipPath key={p.id} id={`clip-${p.id}`}>
                      <ellipse rx={p.w / 2 - 1} ry={p.h / 2 - 1} />
                    </clipPath>
                  ))}
              </defs>

              <rect width="600" height="450" fill="url(#cfg-bg)" />
              <ellipse cx="300" cy="412" rx={halfSlab + 20} ry="12" fill="#000" opacity="0.55" />

              <g filter="url(#cfg-shadow)">
                <rect x={300 - halfSlab} y="352" width={halfSlab * 2} height="42" rx="3" fill="url(#cfg-base)" />
                <rect x={300 - halfSlab} y="352" width={halfSlab * 2} height="42" rx="3" fill="url(#cfg-gloss)" />
                <rect x={300 - halfPlinth} y="328" width={halfPlinth * 2} height="26" rx="2" fill="url(#cfg-base)" />
                <rect x={300 - halfPlinth} y="328" width={halfPlinth * 2} height="26" rx="2" fill="url(#cfg-gloss)" />
              </g>

              <g transform={`translate(300 330) scale(${sx} ${sy}) translate(-300 -330)`}>
                <path d={S.path} fill="url(#cfg-stone)" filter="url(#cfg-shadow)" />
                <path d={S.path} fill="url(#cfg-gloss)" />
                <path d={S.path} fill="none" stroke="#000" strokeOpacity="0.4" strokeWidth="1" />
              </g>

              <g style={{ pointerEvents: mode === 'draw' ? 'none' : 'auto' }}>{sorted.map(renderElem)}</g>

              {liveStroke && liveStroke.length >= 4 && (
                <g opacity="0.85" pointerEvents="none">
                  <polyline points={liveStroke.join(' ')} fill="none" stroke="#000" strokeOpacity="0.55" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" />
                  <polyline points={liveStroke.join(' ')} fill="none" stroke="url(#cfg-stone)" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" />
                </g>
              )}

              {selBox && mode === 'select' && (
                <rect
                  x={selBox.x}
                  y={selBox.y}
                  width={selBox.w}
                  height={selBox.h}
                  rx="4"
                  fill="none"
                  stroke="#3ea36f"
                  strokeWidth="1.4"
                  strokeDasharray="5 3"
                  pointerEvents="none"
                />
              )}

            </svg>

            {mode === 'draw' && (
              <div className="pointer-events-none absolute left-3 top-3 rounded-full border border-accent/60 bg-ink/85 px-3 py-1.5 text-xs text-accent backdrop-blur">
                ✎ Crtanje: povucite prstom ili mišem po skici
              </div>
            )}
          </div>

          {/* toolbar */}
          <div className="mt-3 flex flex-wrap items-center gap-2 px-5 md:px-0">
            {mode === 'select' ? (
              <IconBtn onClick={() => { setMode('draw'); setSelected(null); toast('Docrtajte oblik – svaka linija ima teksturu odabranog kamena.') }} label="Docrtaj spomenik">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" /></svg>
              </IconBtn>
            ) : (
              <>
                <IconBtn onClick={undoStroke} label="Poništi liniju" disabled={!strokes.length}>↶</IconBtn>
                <IconBtn onClick={clearStrokes} label="Obriši crtež" disabled={!strokes.length}>✕</IconBtn>
                <IconBtn onClick={() => setMode('select')} label="Završi crtanje" accent>✓</IconBtn>
              </>
            )}
            <span className="mx-1 hidden h-5 w-px bg-line sm:block" />
            <IconBtn onClick={exportPng} label="Preuzmi skicu">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 3v12m0 0 4-4m-4 4-4-4M4 17v3h16v-3" /></svg>
            </IconBtn>
            <IconBtn onClick={() => setShowSummary(true)} label="Pošalji upit" accent>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M22 2 11 13M22 2l-7 20-4-9-9-4Z" /></svg>
            </IconBtn>
          </div>

          <AnimatePresence>
            {sel && mode === 'select' && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="mx-5 mt-2 flex flex-wrap items-center gap-2 rounded-2xl border border-accent/40 bg-ink-2 px-3 py-2 md:mx-0"
              >
                <span className="text-xs text-mist">Odabrano:</span>
                <span className="text-sm font-medium">{elemLabel(sel)}</span>
                <span className="ml-auto flex flex-wrap items-center gap-1.5">
                  {sel.kind === 'text' && (
                    <>
                      <IconBtn onClick={() => update<TextElem>(sel.id, { size: Math.max(9, sel.size - 2) })} label="Manje">−</IconBtn>
                      <IconBtn onClick={() => update<TextElem>(sel.id, { size: Math.min(48, sel.size + 2) })} label="Veće">+</IconBtn>
                    </>
                  )}
                  {(sel.kind === 'decor' || sel.kind === 'figure') && (
                    <>
                      <IconBtn onClick={() => update(sel.id, { scale: Math.max(0.5, sel.scale - 0.15) } as Partial<Elem>)} label="Manje">−</IconBtn>
                      <IconBtn onClick={() => update(sel.id, { scale: Math.min(2.2, sel.scale + 0.15) } as Partial<Elem>)} label="Veće">+</IconBtn>
                    </>
                  )}
                  {sel.kind === 'photo' && (
                    <>
                      <IconBtn onClick={() => update<PhotoElem>(sel.id, { w: Math.max(30, sel.w - 6), h: Math.max(40, sel.h - 8) })} label="Manje">−</IconBtn>
                      <IconBtn onClick={() => update<PhotoElem>(sel.id, { w: Math.min(120, sel.w + 6), h: Math.min(160, sel.h + 8) })} label="Veće">+</IconBtn>
                      <IconBtn onClick={() => pickPhoto(sel.id)} label={sel.src ? 'Promijeni fotografiju' : 'Učitaj fotografiju'}>📷</IconBtn>
                    </>
                  )}
                  <IconBtn onClick={() => remove(sel.id)} label="Ukloni">🗑</IconBtn>
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ---------- controls ---------- */}
        <div className="min-w-0 px-5 md:px-0">
          <div className="no-scrollbar -mx-5 flex gap-1 overflow-x-auto border-b border-line px-5 md:mx-0 md:px-0">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={`whitespace-nowrap border-b-2 px-4 py-3 text-sm transition ${
                  tab === t.id ? 'border-accent text-paper' : 'border-transparent text-mist hover:text-paper'
                }`}
                aria-selected={tab === t.id}
                role="tab"
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="mt-7 space-y-9">
            {tab === 'oblik' && (
              <>
                <Group title="Oblik ploče" hint="ili docrtajte vlastiti oblik na skici">
                  <div className="grid grid-cols-3 gap-2 sm:grid-cols-6 lg:grid-cols-3 xl:grid-cols-6">
                    {SHAPES.map((sh) => (
                      <button
                        key={sh.id}
                        type="button"
                        onClick={() => setShape(sh.id)}
                        aria-pressed={shape === sh.id}
                        className={`flex flex-col items-center gap-2 rounded-2xl border p-3 text-xs transition ${
                          shape === sh.id ? 'border-accent bg-accent/10 text-paper' : 'border-line text-mist hover:border-paper/50'
                        }`}
                      >
                        <svg viewBox="100 50 400 290" width="56" height="40" className={shape === sh.id ? 'text-accent' : 'text-paper/70'}>
                          <path d={sh.path} fill="currentColor" />
                        </svg>
                        {sh.label}
                      </button>
                    ))}
                  </div>
                </Group>
                <Group title="Dimenzije ploče" hint="skica prikazuje omjer širine i visine">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Range label="Širina" value={width} min={40} max={260} onChange={setWidth} />
                    <Range label="Visina" value={height} min={40} max={260} onChange={setHeight} />
                  </div>
                </Group>
                <button type="button" onClick={resetAll} className="text-sm text-mist underline-offset-4 transition hover:text-paper hover:underline">
                  Počni ispočetka
                </button>
              </>
            )}

            {tab === 'kamen' && (
              <>
                <Group title="Kamen ploče" hint={`${mat.name} · ${mat.country}`}>
                  <div className="no-scrollbar flex w-full gap-2 overflow-x-auto pb-1">
                    {granites.map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        title={m.name}
                        onClick={() => { setMatId(m.id); toast(`Kamen ploče: ${m.name}`) }}
                        aria-pressed={matId === m.id}
                        aria-label={m.name}
                        className={`shrink-0 rounded-xl p-0.5 transition ${matId === m.id ? 'ring-2 ring-accent' : 'ring-1 ring-line hover:ring-paper/50'}`}
                      >
                        <StoneTile material={m} className="size-14 rounded-[10px]" />
                      </button>
                    ))}
                  </div>
                </Group>
                <Group title="Postolje" hint={baseMat.name}>
                  <div className="no-scrollbar flex w-full gap-2 overflow-x-auto pb-1">
                    {granites.map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        title={m.name}
                        onClick={() => { setBaseId(m.id); toast(`Postolje: ${m.name}`) }}
                        aria-pressed={baseId === m.id}
                        aria-label={m.name}
                        className={`shrink-0 rounded-lg p-0.5 transition ${baseId === m.id ? 'ring-2 ring-accent' : 'ring-1 ring-line hover:ring-paper/50'}`}
                      >
                        <StoneTile material={m} className="size-10 rounded-md" />
                      </button>
                    ))}
                  </div>
                </Group>
                <Group title="Slova">
                  <div className="flex flex-wrap items-center gap-2">
                    {FONTS.map((f) => (
                      <Pill key={f.id} active={font === f.id} onClick={() => setFont(f.id)}>
                        <span style={{ fontFamily: f.family }}>{f.label}</span>
                      </Pill>
                    ))}
                    <span className="mx-1 h-5 w-px bg-line" />
                    {INKS.map((i) => (
                      <button
                        key={i.id}
                        type="button"
                        title={i.label}
                        aria-label={`Boja slova: ${i.label}`}
                        aria-pressed={ink === i.id}
                        onClick={() => setInk(i.id)}
                        className={`size-8 rounded-full border border-white/10 transition ${ink === i.id ? 'ring-2 ring-accent ring-offset-2 ring-offset-ink' : ''}`}
                        style={{ background: i.hex }}
                      />
                    ))}
                  </div>
                </Group>
              </>
            )}

            {tab === 'natpisi' && (
              <>
                <Group title="Natpisi na ploči" hint="povucite natpis na skici na željeno mjesto">
                  <div className="space-y-2">
                    {texts.length === 0 && <div className="rounded-xl border border-dashed border-line p-4 text-sm text-mist">Nema natpisa – dodajte ih dolje.</div>}
                    {texts.map((t) => (
                      <div
                        key={t.id}
                        className={`flex items-center gap-2 rounded-xl border p-2 transition ${selected === t.id ? 'border-accent/60 bg-ink-2' : 'border-line'}`}
                        onClick={() => setSelected(t.id)}
                      >
                        <span className="w-16 shrink-0 text-xs text-mist">{ROLE_LABEL[t.role]}</span>
                        <input
                          value={t.text}
                          maxLength={40}
                          onChange={(e) => update<TextElem>(t.id, { text: e.target.value })}
                          onFocus={() => setSelected(t.id)}
                          className="min-w-0 flex-1 rounded-lg border border-line bg-ink px-3 py-2 text-sm outline-none transition focus:border-accent"
                          style={{ fontFamily }}
                        />
                        <button type="button" onClick={() => update<TextElem>(t.id, { size: Math.max(9, t.size - 2) })} className="grid size-8 place-items-center rounded-full border border-line text-sm hover:border-paper/60" aria-label="Manja slova">−</button>
                        <button type="button" onClick={() => update<TextElem>(t.id, { size: Math.min(48, t.size + 2) })} className="grid size-8 place-items-center rounded-full border border-line text-sm hover:border-paper/60" aria-label="Veća slova">+</button>
                        <button type="button" onClick={() => remove(t.id)} className="grid size-8 place-items-center rounded-full border border-line text-sm text-mist hover:border-red-400 hover:text-red-300" aria-label="Ukloni natpis">✕</button>
                      </div>
                    ))}
                  </div>
                </Group>
                <Group title="Dodaj natpis">
                  <div className="flex flex-wrap gap-2">
                    {!texts.some((t) => t.role === 'prezime') && <Pill onClick={() => addText('prezime')}>+ Prezime</Pill>}
                    <Pill onClick={() => addText('ime')}>+ Ime</Pill>
                    <Pill onClick={() => addText('godine')}>+ Godine</Pill>
                    <Pill onClick={() => addText('epitaf')}>+ Epitaf</Pill>
                  </div>
                </Group>
              </>
            )}

            {tab === 'foto' && (
              <>
                <Group title="Fotografije na ploči" hint="povucite okvir na skici na željeno mjesto">
                  <div className="space-y-2">
                    {photos.length === 0 && <div className="rounded-xl border border-dashed border-line p-4 text-sm text-mist">Nema fotografija – dodajte okvir ili učitajte sliku.</div>}
                    {photos.map((p, i) => (
                      <div
                        key={p.id}
                        className={`flex items-center gap-3 rounded-xl border p-2 transition ${selected === p.id ? 'border-accent/60 bg-ink-2' : 'border-line'}`}
                        onClick={() => setSelected(p.id)}
                      >
                        <span className="grid h-14 w-11 shrink-0 place-items-center overflow-hidden rounded-[50%] bg-[#d8d5cf]">
                          {p.src ? <img src={p.src} alt="" className="h-full w-full object-cover" /> : <span className="text-[10px] text-ink/60">foto</span>}
                        </span>
                        <span className="flex-1 text-sm">Fotografija {i + 1}{p.src ? '' : <span className="text-mist"> · prazan okvir</span>}</span>
                        <IconBtn onClick={() => pickPhoto(p.id)} label={p.src ? 'Promijeni' : 'Učitaj'}>📷</IconBtn>
                        <button type="button" onClick={() => remove(p.id)} className="grid size-8 place-items-center rounded-full border border-line text-sm text-mist hover:border-red-400 hover:text-red-300" aria-label="Ukloni fotografiju">✕</button>
                      </div>
                    ))}
                  </div>
                </Group>
                <div className="flex flex-wrap gap-2">
                  <Pill onClick={() => addPhoto()}>+ Prazan okvir</Pill>
                  <Pill active onClick={() => pickPhoto(null)}>+ Učitaj fotografiju</Pill>
                </div>
                <p className="text-xs text-mist/80">Fotografije ostaju na vašem uređaju i šalju se samo ako preuzmete skicu i pošaljete nam je.</p>
              </>
            )}

            {tab === 'ukrasi' && (
              <>
                <Group title="Gravirani ukrasi" hint="kliknite za dodavanje, zatim povucite na skici">
                  <div className="grid grid-cols-3 gap-2 sm:grid-cols-5 lg:grid-cols-3 xl:grid-cols-5">
                    {DECORS.map((d) => (
                      <Tile key={d.id} label={d.label} onClick={() => addDecor(d.id)}>
                        <svg viewBox="-40 -42 80 104" className="h-16" aria-hidden="true">
                          <DecorShape id={d.id} color={d.id === 'kriz' || d.id === 'pravoslavni' ? '#d6b45c' : '#d9d6d0'} />
                        </svg>
                      </Tile>
                    ))}
                  </div>
                </Group>
                <Group title="3D ukrasi – skulpture na postolju">
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
                    {FIGURES.map((f) => (
                      <Tile key={f.id} label={f.label} onClick={() => addFigure(f.id)}>
                        <svg viewBox="-48 -96 96 102" className="h-16" aria-hidden="true">
                          <FigureShape id={f.id} fill="#e6e3dd" />
                        </svg>
                      </Tile>
                    ))}
                  </div>
                </Group>
              </>
            )}

            {tab === 'dodaci' && (
              <>
                <Group title="Vaze" hint={`prikaz u kamenu: ${mat.name}`}>
                  <div className="grid grid-cols-3 gap-2">
                    {VASES.map((v) => (
                      <Tile key={v.id} label={v.label} onClick={() => addVase(v.id)}>
                        <StoneThumb id={`v-${v.id}`} tex={tex} base={mat.texture.palette[2]} viewBox="-22 -58 44 62">
                          {(fill) => <VaseShape id={v.id} fill={fill} />}
                        </StoneThumb>
                      </Tile>
                    ))}
                  </div>
                </Group>
                <Group title="Lampioni">
                  <div className="grid grid-cols-3 gap-2">
                    {LANTERNS.map((l) => (
                      <Tile key={l.id} label={l.label} onClick={() => addLantern(l.id)}>
                        <StoneThumb id={`l-${l.id}`} tex={tex} base={mat.texture.palette[2]} viewBox="-22 -40 44 44">
                          {(fill) => <LanternShape id={l.id} fill={fill} />}
                        </StoneThumb>
                      </Tile>
                    ))}
                  </div>
                </Group>
                <p className="text-xs text-mist/80">Prikazani oblici su ilustrativni – u radionici biramo iz kataloga stvarnih vaza i lampiona.</p>
              </>
            )}
          </div>

          <div className="mt-10 flex flex-col gap-4 rounded-2xl border border-line bg-ink-2 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-mist">
                Okvirna procjena
                <span className="rounded-full border border-gold/50 px-2 py-0.5 text-[10px] tracking-normal text-gold">demo · ilustrativno</span>
              </div>
              <div className="mt-1 text-2xl font-semibold">
                {fmt(Math.round((price * 0.9) / 10) * 10)} – {fmt(Math.round((price * 1.1) / 10) * 10)} €
              </div>
              <div className="text-xs text-mist">
                {mat.name} · {S.label} · {width} × {height} cm · {elems.filter((e) => e.kind !== 'text' && e.kind !== 'stroke').length} dodataka
              </div>
            </div>
            <button type="button" onClick={() => setShowSummary(true)} className="rounded-full bg-accent px-5 py-3 text-sm font-medium text-ink transition hover:bg-paper">
              Pošalji upit
            </button>
          </div>
          <p className="mt-4 text-xs leading-relaxed text-mist/80">
            Skica je ilustrativna i služi kao polazna točka za razgovor. Konačni izgled, dimenzije i cijenu dogovaramo u radionici.
          </p>
        </div>
      </div>

      {/* toasts */}
      <div className="pointer-events-none fixed inset-x-0 bottom-5 z-[90] flex flex-col items-center gap-2 px-4">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              className="max-w-md rounded-full border border-accent/40 bg-ink-2/95 px-4 py-2.5 text-center text-sm shadow-2xl backdrop-blur"
            >
              <span className="mr-2 text-accent">✓</span>
              {t.text}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* summary / send */}
      <AnimatePresence>
        {showSummary && (
          <motion.div
            className="fixed inset-0 z-[80] flex items-end justify-center bg-black/70 p-0 backdrop-blur-sm md:items-center md:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowSummary(false)}
            role="dialog"
            aria-modal="true"
            aria-label="Sažetak upita"
          >
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 30, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-3xl border border-line bg-ink-2 p-6 md:rounded-3xl md:p-8"
            >
              <div className="text-xs font-medium uppercase tracking-[0.22em] text-accent">Vaš upit</div>
              <h3 className="mt-2 text-2xl font-light">Pošaljite skicu radionici</h3>
              <pre className="mt-5 whitespace-pre-wrap rounded-2xl border border-line bg-ink p-4 font-sans text-sm leading-relaxed text-paper/85">{summary}</pre>
              <div className="mt-5 flex flex-wrap gap-3">
                <a href={waHref} target="_blank" rel="noreferrer" className="rounded-full bg-accent px-5 py-3 text-sm font-medium text-ink transition hover:bg-paper">
                  Pošalji WhatsAppom
                </a>
                <button type="button" onClick={exportPng} className="rounded-full border border-paper/30 px-5 py-3 text-sm font-medium transition hover:border-paper">
                  Preuzmi skicu (PNG)
                </button>
                <button type="button" onClick={copy} className="rounded-full border border-paper/30 px-5 py-3 text-sm font-medium transition hover:border-paper">
                  {copied ? 'Kopirano ✓' : 'Kopiraj tekst'}
                </button>
                <button type="button" onClick={() => setShowSummary(false)} className="ml-auto px-3 py-3 text-sm text-mist transition hover:text-paper">
                  Zatvori
                </button>
              </div>
              <p className="mt-4 text-xs text-mist">
                Savjet: preuzmite skicu i priložite je uz WhatsApp poruku. Ili nas nazovite: 098 182 6790 (Dejan) · 098 9077 071 (Jovan)
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
