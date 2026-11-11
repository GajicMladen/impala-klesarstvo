import type { TextureSpec } from '../lib/textures'

export type Color =
  | 'bijela'
  | 'siva'
  | 'crna'
  | 'crvena'
  | 'ruzicasta'
  | 'smeda'
  | 'zelena'
  | 'plava'
  | 'bez'
  | 'ljubicasta'
export type Kind = 'granit' | 'mramor' | 'travertin'
export type Use = 'spomenici' | 'kuhinje' | 'stubista' | 'fasade' | 'kupaonice'

export interface Material {
  id: string
  name: string
  altName?: string
  country: string
  kind: Kind
  colors: Color[]
  uses: Use[]
  description: string
  /** palette = fallback colour / lightness; full spec only for procedurally generated stones */
  texture: TextureSpec
  /** real photo of the slab (catalog, modal, carousel) */
  photo?: string
  /** seamless square tile cut from the photo (configurator sketch, hero background) */
  tile?: string
  /** shown in the 3D carousel */
  featured?: boolean
}

export const COLORS: { id: Color; label: string; hex: string }[] = [
  { id: 'bijela', label: 'Bijela', hex: '#e9e7e2' },
  { id: 'siva', label: 'Siva', hex: '#8b8d90' },
  { id: 'crna', label: 'Crna', hex: '#1b1c1e' },
  { id: 'crvena', label: 'Crvena', hex: '#8e2d27' },
  { id: 'ruzicasta', label: 'Ružičasta', hex: '#cfa9a0' },
  { id: 'smeda', label: 'Smeđa', hex: '#7b5741' },
  { id: 'zelena', label: 'Zelena', hex: '#2f5c40' },
  { id: 'plava', label: 'Plava', hex: '#4d5f85' },
  { id: 'bez', label: 'Bež', hex: '#dccaa9' },
  { id: 'ljubicasta', label: 'Ljubičasta', hex: '#6d5c70' },
]

export const KINDS: { id: Kind; label: string }[] = [
  { id: 'granit', label: 'Granit' },
  { id: 'mramor', label: 'Mramor' },
  { id: 'travertin', label: 'Travertin' },
]

export const USES: { id: Use; label: string }[] = [
  { id: 'spomenici', label: 'Spomenici i grobnice' },
  { id: 'kuhinje', label: 'Kuhinjske ploče' },
  { id: 'stubista', label: 'Stubišta i podovi' },
  { id: 'fasade', label: 'Fasade i klupčice' },
  { id: 'kupaonice', label: 'Kupaonice' },
]

/** Fotografije stvarnih ploča koje je dostavila radionica: puna slika za katalog + bešavna pločica za skicu. */
const photos = (id: string) => ({ photo: `/materijali/${id}.jpg`, tile: `/materijali/tile/${id}.jpg` })

export const materials: Material[] = [
  {
    id: 'impala',
    name: 'Impala',
    altName: 'Impala Black',
    country: 'Južna Afrika',
    kind: 'granit',
    colors: ['crna', 'siva'],
    uses: ['spomenici', 'kuhinje', 'stubista', 'fasade'],
    featured: true,
    description:
      'Tamnosivi granit ujednačenog zrna sivih i crnih kristala – kamen po kojem naša radionica nosi ime. Izuzetno otporan na mraz i vremenske uvjete, a polirana površina desetljećima zadržava dubok sjaj.',
    ...photos('impala'),
    texture: { palette: ['#2a2923', '#4f4d45', '#706e63', '#918d81', '#b9b5a9'] },
  },
  {
    id: 'bengal-black',
    name: 'Bengal Black',
    country: 'Indija',
    kind: 'granit',
    colors: ['crna'],
    uses: ['spomenici', 'kuhinje', 'stubista', 'kupaonice'],
    featured: true,
    description:
      'Duboko crni granit vrlo sitnog zrna s rijetkim svjetlucavim točkicama. Polirana površina savršeno ističe zlatna i srebrna slova te gravirane portrete.',
    ...photos('bengal-black'),
    texture: { palette: ['#040407', '#08080b', '#0c0c10', '#121116', '#212125'] },
  },
  {
    id: 'bianco-sardo',
    name: 'Bianco Sardo',
    country: 'Italija',
    kind: 'granit',
    colors: ['bijela', 'siva'],
    uses: ['spomenici', 'stubista', 'fasade', 'kuhinje'],
    featured: true,
    description:
      'Svijetli sardinijski granit s bijelim, sivim i crnim zrnima. Klasičan izbor za spomenike i postolja – elegantan, svijetao i vrlo izdržljiv.',
    ...photos('bianco-sardo'),
    texture: { palette: ['#424340', '#7b7b76', '#9f9e96', '#bcbab1', '#d9d7cd'] },
  },
  {
    id: 'multicolor',
    name: 'Multicolor',
    altName: 'Multicolor Red',
    country: 'Indija',
    kind: 'granit',
    colors: ['crvena', 'crna'],
    uses: ['spomenici', 'kuhinje', 'stubista'],
    featured: true,
    description:
      'Granit s izmjenom crvenih i tamnosivih valovitih slojeva – svaka ploča ima svoj uzorak. Topao, živ kamen za spomenike koji se izdvajaju.',
    ...photos('multicolor'),
    texture: { palette: ['#413e3d', '#635b59', '#7f7370', '#9d8c87', '#c3b0a9'] },
  },
  {
    id: 'rosa-beta',
    name: 'Rosa Beta',
    country: 'Italija',
    kind: 'granit',
    colors: ['ruzicasta', 'siva'],
    uses: ['spomenici', 'stubista', 'fasade'],
    featured: true,
    description:
      'Sardinijski granit krupnog zrna u toplim sivo‑ružičastim tonovima s crnim točkama. Nježna boja koja lijepo stari i dobro podnosi vremenske uvjete.',
    ...photos('rosa-beta'),
    texture: { palette: ['#3d3d39', '#7e7b74', '#a09c93', '#bab7ad', '#d3d0c6'] },
  },
  {
    id: 'rosso-porrino',
    name: 'Rosso Porriño',
    altName: 'Rosa Porriño',
    country: 'Španjolska',
    kind: 'granit',
    colors: ['ruzicasta', 'siva'],
    uses: ['spomenici', 'stubista', 'fasade', 'kuhinje'],
    featured: true,
    description:
      'Granit iz Galicije s ružičastom podlogom i krupnim sivim i crnim zrnima. Topao i vrlo postojan kamen za spomenike, stubišta i vanjske obloge.',
    ...photos('rosso-porrino'),
    texture: { palette: ['#454642', '#7f7e76', '#afa79b', '#c5bcae', '#d6d1c3'] },
  },
  {
    id: 'verde-marina',
    name: 'Verde Marina',
    country: 'Indija',
    kind: 'granit',
    colors: ['zelena', 'siva'],
    uses: ['spomenici', 'kuhinje', 'stubista', 'fasade'],
    featured: true,
    description:
      'Sitnozrnati granit sivozelenih tonova s mekim, valovitim prijelazima svjetlijih i tamnijih zona. Diskretan i dostojanstven, za spomenike i radne ploče.',
    ...photos('verde-marina'),
    texture: { palette: ['#4a4b45', '#707069', '#8c8c84', '#a8a79f', '#cdcbc3'] },
  },
  {
    id: 'vizag-blue',
    name: 'Vizag Blue',
    country: 'Indija',
    kind: 'granit',
    colors: ['plava', 'siva'],
    uses: ['spomenici', 'kuhinje', 'stubista'],
    featured: true,
    description:
      'Sivoplavi granit s tamnim mrljama i sitnim tamnocrvenim granatima. Vrlo tvrd i otporan, podjednako lijep na spomeniku i na kuhinjskoj ploči.',
    ...photos('vizag-blue'),
    texture: { palette: ['#4b4944', '#74736e', '#908f8a', '#a8a7a2', '#c0c0bb'] },
  },
  {
    id: 'viscount-white',
    name: 'Viscount White',
    country: 'Indija',
    kind: 'granit',
    colors: ['bijela', 'siva'],
    uses: ['kuhinje', 'kupaonice', 'stubista', 'spomenici'],
    featured: true,
    description:
      'Svijetli granit bijele i sive podloge s valovitim tamnim žilama – svaka ploča ima drukčiji uzorak. Omiljen za kuhinjske ploče, kupaonice i stubišta.',
    ...photos('viscount-white'),
    texture: { palette: ['#504f49', '#83827b', '#9f9e96', '#b5b2aa', '#cbc7be'] },
  },
]

export const ORIGINS = Array.from(new Set(materials.map((m) => m.country))).sort((a, b) => a.localeCompare(b, 'hr'))

export const byId = (id: string) => materials.find((m) => m.id === id)
