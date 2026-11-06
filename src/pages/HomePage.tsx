import type { Material } from '../data/materials'
import { Hero } from '../components/Hero'
import { MaterialCarousel } from '../components/MaterialCarousel'
import { Works } from '../components/Works'
import { Services } from '../components/Services'
import { ConfiguratorTeaser } from '../components/ConfiguratorTeaser'
import { About } from '../components/About'
import { Contact } from '../components/Contact'

export function HomePage({ onOpenMaterial }: { onOpenMaterial: (m: Material) => void }) {
  return (
    <>
      <Hero />
      <MaterialCarousel onOpen={onOpenMaterial} />
      <Works />
      <Services />
      <ConfiguratorTeaser />
      <About />
      <Contact />
    </>
  )
}
