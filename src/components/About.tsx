import { motion } from 'framer-motion'
import { SectionHead } from './SectionHead'
import { asset } from '../lib/asset'
import { PRIMARY_PHONE } from '../data/contact'

const points = [
  'Vlastita proizvodnja i strojna obrada kamena',
  'Graviranje portreta, natpisa i ornamenata',
  'Ugradnja na terenu i kasnije održavanje',
  'Savjetovanje pri odabiru materijala i oblika',
]

export function About() {
  return (
    <section id="o-nama" className="border-t border-line py-24 md:py-32">
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 md:px-8 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <div className="overflow-hidden rounded-3xl border border-line">
            <img src={asset('radovi/rad-02.jpg')} alt="Ugradnja obiteljske grobnice – vozila radionice Impala" className="block w-full object-cover" style={{ aspectRatio: '4 / 3' }} />
          </div>
          <div className="absolute -bottom-6 left-6 flex items-center gap-4 rounded-2xl border border-line bg-ink-2/95 p-4 pr-6 backdrop-blur">
            <span className="grid size-14 place-items-center overflow-hidden rounded-full bg-white">
              <img src={asset('logo-impala.jpg')} alt="" className="size-12 object-contain" />
            </span>
            <div>
              <div className="font-semibold">Impala Klesarstvo d.o.o.</div>
              <div className="text-sm text-mist">Borovo · Vukovar · od devedesetih</div>
            </div>
          </div>
        </motion.div>

        <div>
          <SectionHead eyebrow="O nama" title="Tri desetljeća rada s kamenom" />
          <div className="mt-6 space-y-4 leading-relaxed text-paper/85">
            <p>
              Impala Klesarstvo obiteljska je klesarska radionica iz Borova kraj Vukovara. Već 30 godina izrađujemo
              nadgrobne spomenike, obiteljske grobnice i kamene elemente za interijere i eksterijere – od odabira bloka do
              završne ugradnje.
            </p>
            <p>
              Radimo isključivo s prirodnim kamenom: granitima iz Indije, Južne Afrike, Italije i Španjolske. Svaki rad
              nastaje u dogovoru s obitelji, jer spomenik nije proizvod – on je sjećanje.
            </p>
          </div>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {points.map((p) => (
              <li key={p} className="flex items-start gap-3 text-[15px]">
                <span className="mt-1 grid size-5 shrink-0 place-items-center rounded-full bg-accent/15 text-accent">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                {p}
              </li>
            ))}
          </ul>
          <div className="mt-10 flex flex-wrap gap-4">
            <a href="#kontakt" className="rounded-full bg-paper px-6 py-3.5 font-medium text-ink transition hover:bg-accent">
              Dogovorite posjet radionici
            </a>
            <a href={`tel:${PRIMARY_PHONE.tel}`} className="rounded-full border border-paper/30 px-6 py-3.5 font-medium transition hover:border-paper">
              {PRIMARY_PHONE.label}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
