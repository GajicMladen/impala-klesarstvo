import type { CSSProperties } from 'react'
import type { Material } from '../data/materials'
import { useTexture } from '../lib/useTexture'

export function StoneTile({
  material,
  className = '',
  style,
}: {
  material: Material
  className?: string
  style?: CSSProperties
}) {
  const url = useTexture(material)
  const pal = material.texture.palette
  const base = pal[Math.floor(pal.length / 2)]
  return (
    <div
      className={`stone ${className}`}
      style={{ backgroundColor: base, backgroundImage: url ? `url(${url})` : undefined, ...style }}
      aria-hidden="true"
    />
  )
}
