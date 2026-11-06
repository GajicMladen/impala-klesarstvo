import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const features = [
  ['Oblik i kamen', 'Šest oblika ploče, 19 granita, dimenzije po želji – ili docrtajte vlastiti oblik.'],
  ['Natpisi i fotografije', 'Prezime, imena, godine, epitafi i fotografije – rasporedite ih prstom na skici.'],
  ['Skica kao upit', 'Preuzmite skicu ili nam je pošaljite WhatsAppom. Mi je pretvaramo u kamen.'],
]

export function ConfiguratorTeaser() {
  return (
    <section id="konfigurator" className="border-t border-line py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7 }}
          className="relative overflow-hidden rounded-3xl border border-line bg-ink-2 p-8 md:p-14"
        >
          <div className="pointer-events-none absolute -right-24 -top-24 size-96 rounded-full bg-accent/15 blur-3xl" />
          <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-center">
            <div>
              <div className="mb-4 flex items-center gap-3 text-xs font-medium uppercase tracking-[0.22em] text-accent">
                <span className="h-px w-8 bg-accent" />
                Konfigurator spomenika
              </div>
              <h2 className="text-3xl font-light leading-[1.05] tracking-tight md:text-5xl">
                Dizajnirajte spomenik sami – na telefonu ili računalu
              </h2>
              <p className="mt-5 max-w-xl text-mist md:text-lg">
                Nema obveze i nema krivih odgovora. Složite skicu onako kako je zamišljate, a mi ćemo je zajedno s vama
                doraditi u radionici.
              </p>
              <Link
                to="/konfigurator"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3.5 font-medium text-ink transition hover:bg-paper"
              >
                Otvori konfigurator
                <span aria-hidden="true">→</span>
              </Link>
            </div>
            <ul className="grid gap-3">
              {features.map(([t, d], i) => (
                <li key={t} className="flex gap-4 rounded-2xl border border-line bg-ink p-5">
                  <span className="grid size-9 shrink-0 place-items-center rounded-full bg-accent/15 text-sm font-semibold text-accent">
                    {i + 1}
                  </span>
                  <div>
                    <div className="font-medium">{t}</div>
                    <div className="mt-1 text-sm text-mist">{d}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
