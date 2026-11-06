/* ---------- shapes ---------- */

export type ShapeId = 'klasik' | 'luk' | 'kosi' | 'val' | 'srce' | 'dvostruki'
export interface Shape {
  id: ShapeId
  label: string
  path: string
  base: number
  textTop: number
  photoY: number
  half: number
}

export const SHAPES: Shape[] = [
  { id: 'klasik', label: 'Klasični', base: 1100, textTop: 165, photoY: 153, half: 150, path: 'M150,330 V110 Q150,60 200,60 H400 Q450,60 450,110 V330 Z' },
  { id: 'luk', label: 'Polukružni', base: 1150, textTop: 185, photoY: 170, half: 150, path: 'M150,330 V200 A150,140 0 0 1 450,200 V330 Z' },
  { id: 'kosi', label: 'Kosi', base: 1100, textTop: 175, photoY: 162, half: 150, path: 'M150,330 V130 Q150,100 180,96 L440,62 Q450,61 450,72 V330 Z' },
  { id: 'val', label: 'Val', base: 1350, textTop: 185, photoY: 172, half: 150, path: 'M150,330 V130 C190,30 310,150 450,60 V330 Z' },
  { id: 'srce', label: 'Srce', base: 1500, textTop: 225, photoY: 155, half: 160, path: 'M230,330 C170,280 128,215 140,140 C150,76 232,60 300,128 C368,60 450,76 460,140 C472,215 430,280 370,330 Z' },
  { id: 'dvostruki', label: 'Dvostruki luk', base: 1900, textTop: 230, photoY: 150, half: 190, path: 'M110,330 V150 Q110,80 190,80 Q262,80 300,126 Q338,80 410,80 Q490,80 490,150 V330 Z' },
]

/* ---------- catalogues of parts ---------- */

export type DecorId = 'kriz' | 'pravoslavni' | 'ruza' | 'golubica' | 'andjeo'
export const DECORS: { id: DecorId; label: string; price: number }[] = [
  { id: 'kriz', label: 'Križ', price: 60 },
  { id: 'pravoslavni', label: 'Pravoslavni križ', price: 60 },
  { id: 'ruza', label: 'Klesana ruža', price: 180 },
  { id: 'golubica', label: 'Golubica', price: 150 },
  { id: 'andjeo', label: 'Anđeo (gravura)', price: 220 },
]

export type FigureId = 'andjeo3d' | 'gospa' | 'kriz3d' | 'knjiga'
export const FIGURES: { id: FigureId; label: string; price: number }[] = [
  { id: 'andjeo3d', label: 'Anđeo (skulptura)', price: 450 },
  { id: 'gospa', label: 'Gospa (skulptura)', price: 420 },
  { id: 'kriz3d', label: 'Stojeći križ', price: 260 },
  { id: 'knjiga', label: 'Otvorena knjiga', price: 240 },
]

export type VaseId = 'klasicna' | 'visoka' | 'kvadratna'
export const VASES: { id: VaseId; label: string; price: number }[] = [
  { id: 'klasicna', label: 'Klasična vaza', price: 120 },
  { id: 'visoka', label: 'Visoka vaza', price: 140 },
  { id: 'kvadratna', label: 'Kvadratna žardinjera', price: 150 },
]

export type LanternId = 'klasicni' | 'moderni'
export const LANTERNS: { id: LanternId; label: string; price: number }[] = [
  { id: 'klasicni', label: 'Klasični lampion', price: 160 },
  { id: 'moderni', label: 'Moderni lampion', price: 180 },
]

export const FONTS = [
  { id: 'serif', label: 'Serif', family: '"Cormorant Garamond", Georgia, serif' },
  { id: 'cinzel', label: 'Klasik', family: 'Cinzel, Georgia, serif' },
  { id: 'sans', label: 'Moderni', family: 'Gantari, Arial, sans-serif' },
]

export const INKS = [
  { id: 'gold', label: 'Zlatna', hex: '#d6b45c' },
  { id: 'silver', label: 'Srebrna', hex: '#d9d9d9' },
  { id: 'white', label: 'Bijela', hex: '#f4f4f4' },
  { id: 'black', label: 'Crna', hex: '#161616' },
]

export type TextRole = 'prezime' | 'ime' | 'godine' | 'epitaf'
export const ROLE_LABEL: Record<TextRole, string> = { prezime: 'Prezime', ime: 'Ime', godine: 'Godine', epitaf: 'Epitaf' }
export const ROLE_SIZE: Record<TextRole, number> = { prezime: 30, ime: 19, godine: 15, epitaf: 13 }

/* ---------- scene elements ---------- */

interface Base {
  id: string
  x: number
  y: number
}
export type TextElem = Base & { kind: 'text'; role: TextRole; text: string; size: number }
export type PhotoElem = Base & { kind: 'photo'; src?: string; w: number; h: number }
export type DecorElem = Base & { kind: 'decor'; decor: DecorId; scale: number }
export type FigureElem = Base & { kind: 'figure'; figure: FigureId; scale: number }
export type VaseElem = Base & { kind: 'vase'; variant: VaseId }
export type LanternElem = Base & { kind: 'lantern'; variant: LanternId }
export type StrokeElem = { id: string; kind: 'stroke'; points: number[] }
export type Elem = TextElem | PhotoElem | DecorElem | FigureElem | VaseElem | LanternElem | StrokeElem

export const uid = () => Math.random().toString(36).slice(2, 9)

export function defaultElems(S: Shape, halfSlab: number): Elem[] {
  const photoY = S.photoY
  const y1 = Math.max(S.textTop, photoY + 35 + 30)
  return [
    { id: uid(), kind: 'photo', x: 300, y: photoY, w: 54, h: 70 },
    { id: uid(), kind: 'decor', decor: 'kriz', x: 222, y: photoY, scale: 1 },
    { id: uid(), kind: 'text', role: 'prezime', text: 'HORVAT', size: 30, x: 300, y: y1 },
    { id: uid(), kind: 'text', role: 'ime', text: 'Ivan', size: 19, x: 300, y: y1 + 38 },
    { id: uid(), kind: 'text', role: 'godine', text: '1948 – 2024', size: 15, x: 300, y: y1 + 62 },
    { id: uid(), kind: 'text', role: 'epitaf', text: 'Počivao u miru Božjem', size: 13, x: 300, y: y1 + 92 },
    { id: uid(), kind: 'vase', variant: 'klasicna', x: 300 - halfSlab + 26, y: 352 },
    { id: uid(), kind: 'vase', variant: 'klasicna', x: 300 + halfSlab - 26, y: 352 },
  ]
}

export interface Box {
  x: number
  y: number
  w: number
  h: number
}

const FIG_SIZE: Record<FigureId, [number, number]> = { andjeo3d: [80, 88], gospa: [44, 78], kriz3d: [40, 84], knjiga: [70, 26] }
const VASE_SIZE: Record<VaseId, [number, number]> = { klasicna: [30, 42], visoka: [24, 54], kvadratna: [26, 34] }
const LANT_SIZE: Record<LanternId, [number, number]> = { klasicni: [24, 32], moderni: [18, 34] }

/** Approximate bounding box used for the selection outline. */
export function bboxOf(el: Elem): Box {
  switch (el.kind) {
    case 'text': {
      const w = Math.max(30, el.text.length * el.size * (el.role === 'prezime' ? 0.8 : 0.5) + 12)
      return { x: el.x - w / 2, y: el.y - el.size * 0.95, w, h: el.size * 1.3 }
    }
    case 'photo':
      return { x: el.x - el.w / 2 - 4, y: el.y - el.h / 2 - 4, w: el.w + 8, h: el.h + 8 }
    case 'decor': {
      const s = el.scale
      if (el.decor === 'ruza') return { x: el.x - 30 * s, y: el.y - 24 * s, w: 60 * s, h: 92 * s }
      return { x: el.x - 36 * s, y: el.y - 36 * s, w: 72 * s, h: 72 * s }
    }
    case 'figure': {
      const [w, h] = FIG_SIZE[el.figure]
      return { x: el.x - (w * el.scale) / 2, y: el.y - h * el.scale, w: w * el.scale, h: h * el.scale }
    }
    case 'vase': {
      const [w, h] = VASE_SIZE[el.variant]
      return { x: el.x - w / 2, y: el.y - h, w, h }
    }
    case 'lantern': {
      const [w, h] = LANT_SIZE[el.variant]
      return { x: el.x - w / 2, y: el.y - h, w, h }
    }
    case 'stroke': {
      let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity
      for (let i = 0; i < el.points.length; i += 2) {
        x0 = Math.min(x0, el.points[i]); x1 = Math.max(x1, el.points[i])
        y0 = Math.min(y0, el.points[i + 1]); y1 = Math.max(y1, el.points[i + 1])
      }
      return { x: x0 - 10, y: y0 - 10, w: x1 - x0 + 20, h: y1 - y0 + 20 }
    }
  }
}

export function elemLabel(el: Elem): string {
  switch (el.kind) {
    case 'text': return ROLE_LABEL[el.role]
    case 'photo': return el.src ? 'Fotografija' : 'Okvir za fotografiju'
    case 'decor': return DECORS.find((d) => d.id === el.decor)!.label
    case 'figure': return FIGURES.find((d) => d.id === el.figure)!.label
    case 'vase': return VASES.find((d) => d.id === el.variant)!.label
    case 'lantern': return LANTERNS.find((d) => d.id === el.variant)!.label
    case 'stroke': return 'Docrtana linija'
  }
}

export function elemPrice(el: Elem): number {
  switch (el.kind) {
    case 'text': return 0
    case 'photo': return 90
    case 'decor': return DECORS.find((d) => d.id === el.decor)!.price
    case 'figure': return FIGURES.find((d) => d.id === el.figure)!.price
    case 'vase': return VASES.find((d) => d.id === el.variant)!.price
    case 'lantern': return LANTERNS.find((d) => d.id === el.variant)!.price
    case 'stroke': return 0
  }
}
