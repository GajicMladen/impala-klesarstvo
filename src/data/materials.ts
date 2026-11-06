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
  texture: TextureSpec
  /** shown in the 3D carousel */
  featured?: boolean
  /** relative price factor used by the demo configurator */
  priceFactor?: number
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

export const materials: Material[] = [
  {
    id: 'impala',
    name: 'Impala',
    altName: 'Rustenburg',
    country: 'Južna Afrika',
    kind: 'granit',
    colors: ['crna', 'siva'],
    uses: ['spomenici', 'kuhinje', 'stubista', 'fasade'],
    featured: true,
    priceFactor: 1.15,
    description:
      'Tamnosivi do crni granit sitnozrnate strukture – kamen po kojem naša radionica nosi ime. Izuzetno otporan na mraz i vremenske uvjete, zadržava dubok sjaj desetljećima.',
    texture: { palette: ['#131416', '#1e2023', '#2b2e32', '#3b3f44', '#565b61'], grain: 0.55, contrast: 1.35, crystal: 4, seed: 11 },
  },
  {
    id: 'nero-assoluto',
    name: 'Nero Assoluto',
    country: 'Zimbabve',
    kind: 'granit',
    colors: ['crna'],
    uses: ['spomenici', 'kuhinje', 'stubista'],
    featured: true,
    priceFactor: 1.3,
    description:
      'Najčišći crni granit na tržištu, bez vidljivih zrna. Polirana površina djeluje poput ogledala i savršeno ističe zlatna slova i gravirane portrete.',
    texture: { palette: ['#08090a', '#0f1011', '#151617', '#1b1c1e'], grain: 0.7, contrast: 0.9, crystal: 2, cloud: 0.1, seed: 2 },
  },
  {
    id: 'shanxi-black',
    name: 'Shanxi Black',
    country: 'Kina',
    kind: 'granit',
    colors: ['crna'],
    uses: ['spomenici', 'kuhinje', 'stubista', 'fasade'],
    priceFactor: 1.1,
    description:
      'Duboko crni granit s vrlo finim sivim zrnom. Pristupačnija alternativa Nero Assolutu, jednako pogodan za spomenike i vanjske površine.',
    texture: { palette: ['#0d0e10', '#161719', '#1f2123', '#2a2c2f', '#3a3c40'], grain: 0.6, contrast: 1.2, crystal: 2, seed: 3 },
  },
  {
    id: 'bianco-sardo',
    name: 'Bianco Sardo',
    country: 'Italija',
    kind: 'granit',
    colors: ['bijela', 'siva'],
    uses: ['spomenici', 'stubista', 'fasade', 'kuhinje'],
    featured: true,
    priceFactor: 1.0,
    description:
      'Svijetli sardinijski granit s bijelim, sivim i crnim zrnima. Klasičan izbor za spomenike i postolja – elegantan, svijetao i vrlo izdržljiv.',
    texture: { palette: ['#3f3f3f', '#8a8a86', '#b7b6b0', '#d6d4cd', '#ebe9e2'], grain: 0.45, contrast: 1.4, crystal: 4, seed: 4 },
  },
  {
    id: 'kuru-grey',
    name: 'Kuru Grey',
    country: 'Finska',
    kind: 'granit',
    colors: ['siva'],
    uses: ['spomenici', 'stubista', 'fasade'],
    featured: true,
    priceFactor: 1.05,
    description:
      'Ujednačeni srednje sivi granit iz Finske, s ravnomjernim zrnom. Omiljen za moderne, mirne spomenike i vanjska stubišta.',
    texture: { palette: ['#2c2d2f', '#525457', '#777a7d', '#999c9f', '#b6b8ba'], grain: 0.5, contrast: 1.3, crystal: 4, seed: 5 },
  },
  {
    id: 'rosa-beta',
    name: 'Rosa Beta',
    country: 'Italija',
    kind: 'granit',
    colors: ['ruzicasta', 'siva'],
    uses: ['spomenici', 'stubista', 'fasade'],
    priceFactor: 1.0,
    description:
      'Sardinijski granit toplog ružičasto‑sivog tona. Nježna boja koja lijepo stari i dobro podnosi vremenske uvjete.',
    texture: { palette: ['#3a3436', '#8b7f7b', '#b9aaa3', '#d1c2b9', '#e4d8cf'], grain: 0.5, contrast: 1.35, crystal: 4, seed: 6 },
  },
  {
    id: 'multicolor-red',
    name: 'Multicolor Red',
    country: 'Indija',
    kind: 'granit',
    colors: ['crvena', 'crna'],
    uses: ['spomenici', 'kuhinje', 'stubista'],
    featured: true,
    priceFactor: 1.2,
    description:
      'Dramatični crveni granit s tamnim valovitim venama – svaka ploča je unikat. Jedan od najtraženijih materijala za spomenike u našoj radionici.',
    texture: {
      palette: ['#2a1815', '#6b2d26', '#964236', '#b45c48', '#c9846c'],
      grain: 0.35,
      contrast: 1.1,
      cloud: 0.45,
      crystal: 4,
      veins: { color: '#17100f', width: 0.3, warp: 0.28, freq: 5, angle: 0.55, strength: 0.9 },
      seed: 7,
    },
  },
  {
    id: 'imperial-red',
    name: 'Imperial Red',
    country: 'Indija',
    kind: 'granit',
    colors: ['crvena'],
    uses: ['spomenici', 'kuhinje', 'stubista'],
    featured: true,
    priceFactor: 1.25,
    description:
      'Intenzivno crveni granit ujednačene strukture. U kombinaciji s crnim granitom daje raskošne obiteljske grobnice.',
    texture: { palette: ['#2a0e0e', '#5a1b19', '#882924', '#a5443a', '#c06858'], grain: 0.55, contrast: 1.4, crystal: 4, seed: 8 },
  },
  {
    id: 'paradiso',
    name: 'Paradiso',
    altName: 'Paradiso Bash',
    country: 'Indija',
    kind: 'granit',
    colors: ['ljubicasta', 'siva', 'ruzicasta'],
    uses: ['spomenici', 'kuhinje', 'stubista'],
    featured: true,
    priceFactor: 1.2,
    description:
      'Granit prošaran ljubičastim, sivim i ružičastim venama. Živ, topao kamen koji na suncu mijenja ton.',
    texture: {
      palette: ['#3a3340', '#675868', '#8c7785', '#a8919a', '#c1afb2'],
      grain: 0.4,
      contrast: 1.15,
      cloud: 0.5,
      veins: { color: '#2a2430', width: 0.12, warp: 0.7, freq: 2.6, angle: 0.9, strength: 0.75 },
      seed: 9,
    },
  },
  {
    id: 'vizag-blue',
    name: 'Vizag Blue',
    country: 'Indija',
    kind: 'granit',
    colors: ['plava', 'siva'],
    uses: ['spomenici', 'kuhinje', 'stubista', 'fasade'],
    featured: true,
    priceFactor: 1.15,
    description:
      'Sivoplavi granit s valovitim svjetlijim venama. Vrlo tvrd i otporan, podjednako lijep na spomeniku i na kuhinjskoj ploči.',
    texture: {
      palette: ['#272c33', '#454d57', '#66717d', '#88939f', '#a6b0ba'],
      grain: 0.45,
      contrast: 1.25,
      cloud: 0.35,
      veins: { color: '#1c2026', width: 0.14, warp: 0.4, freq: 4, angle: 0.3, strength: 0.75 },
      seed: 10,
    },
  },
  {
    id: 'steel-grey',
    name: 'Steel Grey',
    country: 'Indija',
    kind: 'granit',
    colors: ['siva', 'crna'],
    uses: ['spomenici', 'kuhinje', 'stubista', 'fasade'],
    priceFactor: 1.05,
    description:
      'Tamnosivi granit „čelične“ boje s finim svjetlucavim zrnom. Diskretan i moderan, vrlo postojan.',
    texture: { palette: ['#26282c', '#45484d', '#64686e', '#83878d', '#9da1a7'], grain: 0.6, contrast: 1.3, crystal: 2, seed: 12 },
  },
  {
    id: 'olive-green',
    name: 'Olive Green',
    country: 'Indija',
    kind: 'granit',
    colors: ['zelena', 'crna'],
    uses: ['spomenici', 'kuhinje', 'stubista'],
    priceFactor: 1.15,
    description:
      'Tamni granit maslinastozelenog tona s crnim zrnima. Neobičan, dostojanstven izbor za spomenike koji se izdvajaju.',
    texture: { palette: ['#121812', '#223121', '#344733', '#495e46', '#667a60'], grain: 0.5, contrast: 1.3, crystal: 4, seed: 13 },
  },
  {
    id: 'tropical-green',
    name: 'Tropical Green',
    altName: 'Verde Tropical',
    country: 'Indija',
    kind: 'granit',
    colors: ['zelena'],
    uses: ['spomenici', 'kuhinje', 'stubista'],
    priceFactor: 1.2,
    description:
      'Zeleni granit s krupnim svijetlim kristalima. Izrazita tekstura koja na poliranoj površini djeluje gotovo trodimenzionalno.',
    texture: { palette: ['#0f1a13', '#1f3a2a', '#2f5a3e', '#4b7a57', '#80a680'], grain: 0.4, contrast: 1.5, crystal: 8, seed: 14 },
  },
  {
    id: 'blue-pearl',
    name: 'Blue Pearl',
    country: 'Norveška',
    kind: 'granit',
    colors: ['plava', 'siva'],
    uses: ['spomenici', 'kuhinje', 'stubista'],
    featured: true,
    priceFactor: 1.5,
    description:
      'Norveški larvikit s krupnim kristalima koji se na svjetlu prelijevaju u plavo‑srebrnim tonovima. Jedan od najluksuznijih granita.',
    texture: { palette: ['#1a1e29', '#2a3246', '#3c4a66', '#55668c', '#90a3c8'], grain: 0.3, contrast: 1.6, crystal: 8, seed: 15 },
  },
  {
    id: 'balmoral-red',
    name: 'Balmoral Red',
    country: 'Finska',
    kind: 'granit',
    colors: ['crvena', 'ruzicasta'],
    uses: ['spomenici', 'stubista', 'fasade'],
    priceFactor: 1.25,
    description:
      'Finski crveni granit s krupnim ružičasto‑crvenim zrnima. Vrlo tvrd, idealan za spomenike i vanjske površine izložene mrazu.',
    texture: { palette: ['#3a1a16', '#7a3a2f', '#a7584a', '#c27c67', '#dba48e'], grain: 0.45, contrast: 1.35, crystal: 8, seed: 16 },
  },
  {
    id: 'aurora',
    name: 'Aurora',
    country: 'Finska',
    kind: 'granit',
    colors: ['smeda', 'ruzicasta'],
    uses: ['spomenici', 'kuhinje', 'stubista'],
    priceFactor: 1.2,
    description:
      'Topli smeđe‑ružičasti granit sa sivim i crnim venama. Mekana paleta koja se lijepo slaže s drvom i svijetlim fasadama.',
    texture: {
      palette: ['#2c2521', '#6a4d43', '#997466', '#b89384', '#d1b2a2'],
      grain: 0.45,
      contrast: 1.2,
      cloud: 0.35,
      veins: { color: '#24201f', width: 0.1, warp: 0.7, freq: 2.2, angle: 0.7, strength: 0.65 },
      seed: 17,
    },
  },
  {
    id: 'kashmir-white',
    name: 'Kashmir White',
    country: 'Indija',
    kind: 'granit',
    colors: ['bijela', 'siva'],
    uses: ['kuhinje', 'kupaonice', 'stubista'],
    priceFactor: 1.1,
    description:
      'Svijetli granit s krem podlogom i sitnim crvenim granatima. Omiljen izbor za kuhinjske ploče i svijetle interijere.',
    texture: { palette: ['#7a3b3b', '#9a918a', '#c3bcb4', '#ded9d2', '#efece7'], grain: 0.45, contrast: 1.35, crystal: 4, seed: 18 },
  },
  {
    id: 'tan-brown',
    name: 'Tan Brown',
    country: 'Indija',
    kind: 'granit',
    colors: ['smeda', 'crna'],
    uses: ['kuhinje', 'stubista', 'spomenici'],
    priceFactor: 1.05,
    description:
      'Smeđe‑crni granit s krupnim zrnima. Jedan od najčešće korištenih granita za kuhinjske radne ploče – praktičan i topao.',
    texture: { palette: ['#1c1311', '#48322a', '#78533f', '#9b7158', '#b78f72'], grain: 0.45, contrast: 1.4, crystal: 8, seed: 19 },
  },
  {
    id: 'himalaya-blue',
    name: 'Himalaya Blue',
    country: 'Indija',
    kind: 'granit',
    colors: ['plava', 'ljubicasta', 'siva'],
    uses: ['spomenici', 'kuhinje', 'stubista'],
    priceFactor: 1.2,
    description:
      'Granit plavo‑ljubičastih tonova s bijelim i sivim venama. Za one koji žele kamen koji se pamti.',
    texture: {
      palette: ['#292933', '#484c5e', '#6e7390', '#9497ad', '#b9bbc9'],
      grain: 0.4,
      contrast: 1.2,
      cloud: 0.4,
      veins: { color: '#e3e4ea', width: 0.07, warp: 0.8, freq: 2.8, angle: 1.1, strength: 0.55 },
      seed: 20,
    },
  },
  {
    id: 'bianco-carrara',
    name: 'Bianco Carrara',
    country: 'Italija',
    kind: 'mramor',
    colors: ['bijela', 'siva'],
    uses: ['kuhinje', 'kupaonice', 'stubista'],
    featured: true,
    description:
      'Najpoznatiji mramor na svijetu, iz kamenoloma u Carrari. Bijela podloga s mekim sivim venama – za kupaonice, stubišta i interijere bez kompromisa.',
    texture: {
      palette: ['#c7c7c5', '#dcdbd8', '#eae9e6', '#f2f1ee', '#f8f7f5'],
      grain: 0.2,
      contrast: 0.8,
      cloud: 0.4,
      crystal: 8,
      veins: [
        { color: '#8c8f93', width: 0.04, warp: 0.95, freq: 1.6, angle: 0.7, strength: 0.7 },
        { color: '#a9acb0', width: 0.03, warp: 0.8, freq: 2.4, angle: 1.1, strength: 0.35 },
      ],
      seed: 21,
    },
  },
  {
    id: 'travertino-classico',
    name: 'Travertino Classico',
    country: 'Italija',
    kind: 'travertin',
    colors: ['bez'],
    uses: ['fasade', 'kupaonice', 'stubista'],
    description:
      'Topli bež travertin s karakterističnim vodoravnim slojevima. Vječni klasik za fasade, podove i kupaonice mediteranskog ugođaja.',
    texture: {
      palette: ['#b59976', '#cab293', '#d9c6a9', '#e5d6bc', '#ede1cc'],
      grain: 0.35,
      contrast: 1.0,
      cloud: 0.5,
      crystal: 8,
      veins: { color: '#a3845f', width: 0.12, warp: 0.12, freq: 14, angle: 1.5708, strength: 0.55 },
      seed: 22,
    },
  },
  {
    id: 'rosso-verona',
    name: 'Rosso Verona',
    country: 'Italija',
    kind: 'mramor',
    colors: ['crvena', 'ruzicasta'],
    uses: ['kupaonice', 'stubista', 'kuhinje'],
    description:
      'Crvenkasti mramor iz okolice Verone s bijelim i bež žilicama. Daje interijerima toplinu i povijesni karakter.',
    texture: {
      palette: ['#5a2a2a', '#8c4844', '#ad685e', '#c68b7e', '#dbb0a3'],
      grain: 0.25,
      contrast: 1.0,
      cloud: 0.6,
      crystal: 8,
      veins: { color: '#ebe0d8', width: 0.035, warp: 0.9, freq: 2, angle: 0.4, strength: 0.7 },
      seed: 23,
    },
  },
  {
    id: 'verde-guatemala',
    name: 'Verde Guatemala',
    country: 'Indija',
    kind: 'mramor',
    colors: ['zelena'],
    uses: ['kupaonice', 'kuhinje', 'stubista'],
    description:
      'Duboko zeleni mramor sa svijetlim venama. Spektakularan na kupaonskim zidovima i kao dekorativni detalj.',
    texture: {
      palette: ['#0e2a1f', '#1a4a36', '#2a6a4d', '#4c8a6a', '#9bc0a6'],
      grain: 0.25,
      contrast: 1.1,
      cloud: 0.55,
      crystal: 8,
      veins: { color: '#cfe2d4', width: 0.035, warp: 0.95, freq: 2.2, angle: 0.9, strength: 0.75 },
      seed: 24,
    },
  },
  {
    id: 'crema-marfil',
    name: 'Crema Marfil',
    country: 'Španjolska',
    kind: 'mramor',
    colors: ['bez', 'bijela'],
    uses: ['kupaonice', 'stubista', 'kuhinje'],
    description:
      'Krem‑bež španjolski mramor jednolične strukture. Svijetao, miran kamen koji vizualno povećava prostor.',
    texture: {
      palette: ['#cbbb9d', '#dbceb4', '#e6dcc6', '#ede5d3', '#f3edde'],
      grain: 0.2,
      contrast: 0.9,
      cloud: 0.5,
      crystal: 8,
      veins: { color: '#c0ad8c', width: 0.05, warp: 0.9, freq: 1.5, angle: 0.5, strength: 0.4 },
      seed: 25,
    },
  },
]

export const ORIGINS = Array.from(new Set(materials.map((m) => m.country))).sort((a, b) => a.localeCompare(b, 'hr'))

export const byId = (id: string) => materials.find((m) => m.id === id)
