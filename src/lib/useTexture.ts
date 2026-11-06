import { useEffect, useState } from 'react'
import { renderTexture, type TextureSpec } from './textures'

const cache = new Map<string, string>()
const pending = new Map<string, Promise<string>>()
let chain: Promise<unknown> = Promise.resolve()

/** Renders textures one at a time in idle time so the page never janks. */
export function getTexture(id: string, spec: TextureSpec): Promise<string> {
  const hit = cache.get(id)
  if (hit) return Promise.resolve(hit)
  const inflight = pending.get(id)
  if (inflight) return inflight

  const task = new Promise<string>((resolve) => {
    chain = chain.then(
      () =>
        new Promise<void>((done) => {
          const run = () => {
            const url = renderTexture(spec)
            cache.set(id, url)
            pending.delete(id)
            resolve(url)
            done()
          }
          if (typeof requestIdleCallback === 'function') requestIdleCallback(run, { timeout: 400 })
          else setTimeout(run, 0)
        }),
    )
  })
  pending.set(id, task)
  return task
}

export function useTexture(m: { id: string; texture: TextureSpec } | null | undefined): string | null {
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
    getTexture(m.id, m.texture).then((u) => {
      if (alive) setUrl(u)
    })
    return () => {
      alive = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])
  return url
}
