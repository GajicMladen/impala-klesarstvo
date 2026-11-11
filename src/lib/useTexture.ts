import { useEffect, useState } from 'react'
import { renderTexture, type TextureSpec } from './textures'
import { asset } from './asset'

export interface TextureSource {
  id: string
  texture: TextureSpec
  /** real photo – used as-is for CSS backgrounds */
  photo?: string
  /** seamless tile – inlined as a data URL so it survives SVG → PNG export */
  tile?: string
}

const cache = new Map<string, string>()
const pending = new Map<string, Promise<string>>()
let chain: Promise<unknown> = Promise.resolve()

/** Renders procedural textures one at a time in idle time so the page never janks. */
function procedural(spec: TextureSpec): Promise<string> {
  return new Promise<string>((resolve) => {
    chain = chain.then(
      () =>
        new Promise<void>((done) => {
          const run = () => {
            resolve(renderTexture(spec))
            done()
          }
          if (typeof requestIdleCallback === 'function') requestIdleCallback(run, { timeout: 400 })
          else setTimeout(run, 0)
        }),
    )
  })
}

async function dataUrl(url: string): Promise<string> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`${res.status} ${url}`)
  const blob = await res.blob()
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(blob)
  })
}

/** Tile texture as a data URL: the material's seamless photo tile, or a procedural one. */
function getTile(m: TextureSource): Promise<string> {
  const key = m.id
  const hit = cache.get(key)
  if (hit) return Promise.resolve(hit)
  const inflight = pending.get(key)
  if (inflight) return inflight
  const task = (m.tile ? dataUrl(asset(m.tile)).catch(() => procedural(m.texture)) : procedural(m.texture)).then((url) => {
    cache.set(key, url)
    pending.delete(key)
    return url
  })
  pending.set(key, task)
  return task
}

/** Seamless, repeatable texture for SVG patterns and tiled backgrounds (always a data URL). */
export function useTileTexture(m: TextureSource | null | undefined): string | null {
  const [url, setUrl] = useState<string | null>(() => (m ? (cache.get(m.id) ?? null) : null))
  const id = m?.id
  useEffect(() => {
    if (!m) return
    const hit = cache.get(m.id)
    if (hit) {
      setUrl(hit)
      return
    }
    let alive = true
    setUrl(null)
    getTile(m).then((u) => {
      if (alive) setUrl(u)
    })
    return () => {
      alive = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])
  return url
}

/** Texture for a single surface (CSS `background-size: cover`): the real photo when there is one. */
export function useTexture(m: TextureSource | null | undefined): string | null {
  const tile = useTileTexture(m && !m.photo ? m : null)
  return m?.photo ? asset(m.photo) : tile
}
