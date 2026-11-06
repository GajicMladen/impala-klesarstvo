/**
 * Procedural stone textures (granite / marble / travertine).
 * Everything is generated on the client from a seed, so the demo has
 * no dependency on third‑party material photos. Swap a material's
 * `texture` for a real photo URL whenever the workshop supplies one.
 */
export interface Veins {
  color: string
  /** relative band width, ~0.03 (hairline) – 0.35 (broad band) */
  width: number
  /** 0 – 0.6, how much the veins wander */
  warp: number
  /** number of vein bands across the tile */
  freq: number
  /** radians */
  angle: number
  strength?: number
}

export interface TextureSpec {
  /** colours from dark to light */
  palette: string[]
  /** 0..1 share of fine grit vs. crystal clusters */
  grain?: number
  contrast?: number
  /** 0..1 large‑scale cloudiness */
  cloud?: number
  /** crystal cell size in px (must divide 512) */
  crystal?: number
  veins?: Veins | Veins[]
  seed?: number
}

export const TEXTURE_SIZE = 512

function mulberry32(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

/** Tileable value noise on a grid of `cell` px. */
function makeNoise(cell: number, rand: () => number) {
  const n = TEXTURE_SIZE / cell
  const g = new Float32Array(n * n)
  for (let i = 0; i < g.length; i++) g[i] = rand()
  return (x: number, y: number) => {
    const gx = x / cell
    const gy = y / cell
    const x0 = Math.floor(gx)
    const y0 = Math.floor(gy)
    const fx = gx - x0
    const fy = gy - y0
    const sx = fx * fx * (3 - 2 * fx)
    const sy = fy * fy * (3 - 2 * fy)
    const xa = x0 % n
    const ya = y0 % n
    const xb = (x0 + 1) % n
    const yb = (y0 + 1) % n
    const a = g[ya * n + xa]
    const b = g[ya * n + xb]
    const c = g[yb * n + xa]
    const d = g[yb * n + xb]
    return (a + (b - a) * sx) * (1 - sy) + (c + (d - c) * sx) * sy
  }
}

export function renderTexture(spec: TextureSpec): string {
  const rand = mulberry32(spec.seed ?? 7)
  const crystal = spec.crystal ?? 4
  const fine = makeNoise(2, rand)
  const mid = makeNoise(crystal, rand)
  const mid2 = makeNoise(crystal * 4, rand)
  const cloud = makeNoise(64, rand)
  const warpA = makeNoise(128, rand)
  const warpB = makeNoise(32, rand)

  const pal = spec.palette.map(hexToRgb)
  const last = pal.length - 1
  const grain = spec.grain ?? 0.5
  const contrast = spec.contrast ?? 1.2
  const cloudAmt = spec.cloud ?? 0.25
  const veins = spec.veins ? (Array.isArray(spec.veins) ? spec.veins : [spec.veins]) : []
  const vcols = veins.map((v) => hexToRgb(v.color))
  const vcos = veins.map((v) => Math.cos(v.angle))
  const vsin = veins.map((v) => Math.sin(v.angle))

  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = TEXTURE_SIZE
  const ctx = canvas.getContext('2d')!
  const img = ctx.createImageData(TEXTURE_SIZE, TEXTURE_SIZE)
  const d = img.data
  let p = 0

  for (let y = 0; y < TEXTURE_SIZE; y++) {
    for (let x = 0; x < TEXTURE_SIZE; x++) {
      let t = fine(x, y) * grain + (mid(x, y) * 0.7 + mid2(x, y) * 0.3) * (1 - grain)
      t = (t - 0.5) * contrast + 0.5 + (cloud(x, y) - 0.5) * cloudAmt
      const idx = Math.max(0, Math.min(last, Math.round(t * last + (rand() - 0.5) * 0.4)))
      let r = pal[idx][0]
      let g = pal[idx][1]
      let b = pal[idx][2]

      for (let k = 0; k < veins.length; k++) {
        const v = veins[k]
        const u = (x * vcos[k] + y * vsin[k]) / TEXTURE_SIZE
        const w = (warpA(x, y) - 0.5) * v.warp + (warpB(x, y) - 0.5) * v.warp * 0.35
        const s = Math.sin((u + w) * v.freq * Math.PI * 2)
        const band = Math.exp(-(s * s) / (4 * v.width * v.width))
        const a = band * (v.strength ?? 0.85)
        if (a > 0.01) {
          r += (vcols[k][0] - r) * a
          g += (vcols[k][1] - g) * a
          b += (vcols[k][2] - b) * a
        }
      }

      d[p++] = r
      d[p++] = g
      d[p++] = b
      d[p++] = 255
    }
  }

  ctx.putImageData(img, 0, 0)
  return canvas.toDataURL('image/jpeg', 0.86)
}

/** Perceived lightness of the palette's middle tone (0..1). */
export function paletteLightness(spec: TextureSpec): number {
  const [r, g, b] = hexToRgb(spec.palette[Math.floor(spec.palette.length / 2)])
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255
}
