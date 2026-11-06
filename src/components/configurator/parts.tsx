import type { DecorId, FigureId, LanternId, VaseId } from './scene'

/* Engraved ornaments – drawn centred on the origin, roughly 60–70 px tall. */
export function DecorShape({ id, color }: { id: DecorId; color: string }) {
  if (id === 'kriz') return <path d="M-4,-28 h8 v12 h13 v8 h-13 v36 h-8 v-36 h-13 v-8 h13 z" fill={color} />
  if (id === 'pravoslavni')
    return (
      <g fill={color}>
        <rect x="-3" y="-30" width="6" height="60" />
        <rect x="-9" y="-22" width="18" height="5" />
        <rect x="-17" y="-11" width="34" height="6" />
        <rect x="-12" y="12" width="24" height="5" transform="rotate(-22 0 14.5)" />
      </g>
    )
  if (id === 'ruza')
    return (
      <g transform="rotate(-18)" fill={color} stroke={color} strokeWidth="1.2" strokeLinejoin="round">
        <path d="M0,-2 c-8,-10 8,-18 10,-8 c8,-10 18,6 6,10 c12,3 7,18 -5,13 c-2,12 -18,10 -16,-2 c-12,-2 -10,-18 5,-13 z" fillOpacity="0.9" />
        <path d="M-2,0 c4,-6 10,-2 7,3 c-3,4 -9,2 -6,-2" fill="none" stroke="#000" strokeOpacity="0.5" />
        <path d="M2,14 c3,16 -1,32 -4,48" fill="none" strokeWidth="2.2" />
        <path d="M0,30 c-12,-3 -19,6 -16,15 c9,0 16,-6 16,-15 z" fillOpacity="0.85" />
        <path d="M1,42 c12,-2 18,8 14,16 c-9,-1 -15,-7 -14,-16 z" fillOpacity="0.85" />
      </g>
    )
  if (id === 'golubica')
    return (
      <path
        d="M4,2 c-6,-12 -22,-12 -30,-2 c5,0 10,3 12,8 c-9,3 -18,12 -16,22 c7,-8 16,-11 26,-9 c4,7 13,10 20,5 c-3,-4 -3,-9 1,-13 c-6,0 -11,-5 -13,-11 z"
        fill={color}
        fillOpacity="0.92"
      />
    )
  // andjeo – praying angel silhouette
  return (
    <g fill={color} fillOpacity="0.9">
      <path d="M-5,-18 C-24,-36 -40,-24 -34,-4 C-30,10 -16,16 -8,14 C-10,2 -9,-8 -5,-18 Z" />
      <path d="M5,-18 C24,-36 40,-24 34,-4 C30,10 16,16 8,14 C10,2 9,-8 5,-18 Z" />
      <circle cy="-27" r="7" />
      <path d="M-7,-19 C-15,-6 -13,14 -11,32 L11,32 C13,14 15,-6 7,-19 C4,-16 -4,-16 -7,-19 Z" />
      <path d="M-3,-2 c-2,4 -2,8 0,10 h6 c2,-2 2,-6 0,-10 z" fill="#000" fillOpacity="0.25" />
    </g>
  )
}

/* Free-standing sculptures – bottom-centre on the origin, filled with the marble pattern. */
export function FigureShape({ id, fill }: { id: FigureId; fill: string }) {
  const edge = { stroke: '#000', strokeOpacity: 0.45, strokeWidth: 1 }
  if (id === 'andjeo3d')
    return (
      <g transform="translate(0 -4) scale(1.3)" fill={fill} {...edge}>
        <path d="M-5,-38 C-24,-56 -40,-44 -34,-24 C-30,-10 -16,-4 -8,-6 C-10,-18 -9,-28 -5,-38 Z" />
        <path d="M5,-38 C24,-56 40,-44 34,-24 C30,-10 16,-4 8,-6 C10,-18 9,-28 5,-38 Z" />
        <circle cy="-47" r="7" />
        <path d="M-7,-39 C-15,-26 -13,-6 -11,12 L11,12 C13,-6 15,-26 7,-39 C4,-36 -4,-36 -7,-39 Z" />
        <rect x="-16" y="12" width="32" height="6" rx="1" />
      </g>
    )
  if (id === 'gospa')
    return (
      <g fill={fill} {...edge}>
        <path d="M0,-78 c-6,0 -9,5 -9,10 c0,5 3,9 9,9 c6,0 9,-4 9,-9 c0,-5 -3,-10 -9,-10 z" />
        <path d="M-11,-62 C-22,-44 -20,-22 -18,-6 L18,-6 C20,-22 22,-44 11,-62 C7,-56 -7,-56 -11,-62 Z" />
        <path d="M-5,-38 c-3,4 -3,10 0,14 h10 c3,-4 3,-10 0,-14 z" fill="#000" fillOpacity="0.2" stroke="none" />
        <rect x="-20" y="-6" width="40" height="6" rx="1" />
      </g>
    )
  if (id === 'kriz3d')
    return (
      <g fill={fill} {...edge}>
        <path d="M-4,-84 h8 v18 h14 v8 h-14 v44 h-8 v-44 h-14 v-8 h14 z" />
        <rect x="-14" y="-14" width="28" height="8" rx="1" />
        <rect x="-20" y="-6" width="40" height="6" rx="1" />
      </g>
    )
  // knjiga – open book on a small slab
  return (
    <g fill={fill} {...edge}>
      <path d="M-34,-10 C-22,-18 -8,-18 0,-12 C8,-18 22,-18 34,-10 L34,-2 C22,-8 8,-8 0,-3 C-8,-8 -22,-8 -34,-2 Z" />
      <path d="M0,-12 V-3" stroke="#000" strokeOpacity="0.5" />
      <rect x="-36" y="-4" width="72" height="4" rx="1" />
      <path d="M-28,-11 c8,-4 16,-4 24,-1 M-28,-8 c8,-4 16,-4 24,-1 M4,-12 c8,-3 16,-3 24,1 M4,-9 c8,-3 16,-3 24,1" fill="none" stroke="#000" strokeOpacity="0.25" strokeWidth="0.8" />
    </g>
  )
}

/* Vases – bottom-centre on the origin. */
export const VASE_PATH: Record<VaseId, string> = {
  klasicna: 'M-9,0 L-7,-16 Q-15,-27 -6,-35 L-6,-41 H6 L6,-35 Q15,-27 7,-16 L9,0 Z',
  visoka: 'M-7,0 L-6,-20 Q-12,-34 -5,-44 L-5,-52 H5 L5,-44 Q12,-34 6,-20 L7,0 Z',
  kvadratna: 'M-11,0 L-9,-26 H9 L11,0 Z M-13,-26 H13 V-33 H-13 Z',
}
export function VaseShape({ id, fill, gloss }: { id: VaseId; fill: string; gloss?: string }) {
  return (
    <g>
      <path d={VASE_PATH[id]} fill={fill} stroke="#000" strokeOpacity="0.45" strokeWidth="1" />
      {gloss && <path d={VASE_PATH[id]} fill={gloss} />}
    </g>
  )
}

/* Lanterns – bottom-centre on the origin. */
export function LanternShape({ id, fill, gloss }: { id: LanternId; fill: string; gloss?: string }) {
  const edge = { stroke: '#000', strokeOpacity: 0.45, strokeWidth: 1 }
  if (id === 'klasicni')
    return (
      <g>
        <path d="M-10,0 V-21 H10 V0 Z" fill={fill} {...edge} />
        <path d="M-12,-21 L0,-32 L12,-21 Z" fill={fill} {...edge} />
        {gloss && <path d="M-10,0 V-21 H10 V0 Z M-12,-21 L0,-32 L12,-21 Z" fill={gloss} />}
        <rect x="-6" y="-18" width="12" height="14" fill="#f2c56b" opacity="0.85" />
        <circle cy="-11" r="3" fill="#fff4cc" />
      </g>
    )
  return (
    <g>
      <path d="M-8,0 V-29 Q-8,-33 -4,-33 H4 Q8,-33 8,-29 V0 Z" fill={fill} {...edge} />
      {gloss && <path d="M-8,0 V-29 Q-8,-33 -4,-33 H4 Q8,-33 8,-29 V0 Z" fill={gloss} />}
      <rect x="-5" y="-27" width="10" height="19" rx="2" fill="#f2c56b" opacity="0.85" />
      <circle cy="-17" r="2.5" fill="#fff4cc" />
    </g>
  )
}

export function PhotoSilhouette({ w, h }: { w: number; h: number }) {
  const r = Math.min(w, h) / 6
  return (
    <g fill="#9b9893">
      <circle cy={-h / 8} r={r} />
      <path d={`M${-w / 3},${h / 3} c0,${-h / 4} ${(w * 2) / 3},${-h / 4} ${(w * 2) / 3},0 z`} />
    </g>
  )
}
