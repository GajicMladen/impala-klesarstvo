import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { track } from '../lib/analytics'
import { Configurator } from '../components/configurator/Configurator'
import { SectionHead } from '../components/SectionHead'

export function ConfiguratorPage() {
  const [params] = useSearchParams()
  const kamen = params.get('kamen') ?? undefined
  useEffect(() => {
    track('configurator_open', { material: kamen ?? '' })
  }, [kamen])
  return (
    <section className="pb-24 pt-28 md:pb-32 md:pt-40">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHead
          eyebrow="Konfigurator spomenika"
          title="Dizajnirajte spomenik u nekoliko klikova"
          text="Odaberite oblik i kamen, rasporedite natpise, fotografije i ukrase gdje god želite, docrtajte svoj oblik. Skicu preuzmite ili nam je pošaljite kao upit."
        />
      </div>
      <Configurator initialMaterial={kamen} />
    </section>
  )
}
