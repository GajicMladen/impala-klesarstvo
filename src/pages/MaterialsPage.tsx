import type { Material } from '../data/materials'
import { MaterialCatalog } from '../components/MaterialCatalog'
import { SectionHead } from '../components/SectionHead'

export function MaterialsPage({ onOpenMaterial }: { onOpenMaterial: (m: Material) => void }) {
  return (
    <section className="pb-24 pt-32 md:pb-32 md:pt-40">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHead
          eyebrow="Katalog materijala"
          title="Pronađite svoj kamen"
          text="Filtrirajte po boji ili namjeni. Svaki materijal nabavljamo u blokovima i pločama te obrađujemo u vlastitoj radionici u Borovu."
        />
        <MaterialCatalog onOpen={onOpenMaterial} />
      </div>
    </section>
  )
}
