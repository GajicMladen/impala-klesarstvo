import { motion } from 'framer-motion'
import { SectionHead } from './SectionHead'

const services = [
  {
    title: 'Nadgrobni spomenici',
    text: 'Jednostruki i dvostruki spomenici svih oblika – klasični, lukovi, srca, valovi – s graviranjem natpisa, portreta i ornamenata.',
    icon: 'M7 20V9a5 5 0 0 1 10 0v11M4 20h16M12 7v6M9.5 10h5',
  },
  {
    title: 'Obiteljske grobnice',
    text: 'Grobnice s pokrovnim pločama, okvirima i stazama. Projektiramo, izrađujemo i ugrađujemo na terenu.',
    icon: 'M3 20h18M5 20v-4h14v4M7 16v-3h10v3M9 13V9a3 3 0 0 1 6 0v4',
  },
  {
    title: 'Kuhinjske radne ploče',
    text: 'Granitne i mramorne ploče rezane po mjeri, s izrezima za sudoper i ploču za kuhanje te obradom rubova.',
    icon: 'M3 8h18v3H3zM5 11v9M19 11v9M9 8V5h6v3M13 14h4v3h-4z',
  },
  {
    title: 'Stubišta i podovi',
    text: 'Unutarnja i vanjska stubišta, podne obloge i terase od granita, mramora i travertina.',
    icon: 'M3 21v-4h4v-4h4v-4h4V5h6',
  },
  {
    title: 'Klupčice i fasade',
    text: 'Prozorske klupčice, pragovi, sokli i fasadne obloge otporne na mraz i vremenske uvjete.',
    icon: 'M3 4h18v16H3zM3 12h18M12 4v16',
  },
  {
    title: 'Restauracija i obnova',
    text: 'Čišćenje, poliranje i obnova starih spomenika i kamenih elemenata, dodavanje novih natpisa.',
    icon: 'M14 4l6 6-9 9H5v-6zM4 20h16',
  },
]

export function Services() {
  return (
    <section id="usluge" className="border-t border-line bg-ink-2 py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHead
          eyebrow="Usluge"
          title="Od bloka kamena do ugradnje"
          text="Cijeli proces radimo sami: savjetovanje i odabir materijala, rezanje, poliranje, graviranje i ugradnja."
        />
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <motion.article
              key={s.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.6, delay: (i % 3) * 0.1 }}
              className="group rounded-3xl border border-line bg-ink p-7 transition hover:border-accent/50"
            >
              <div className="grid size-12 place-items-center rounded-2xl bg-ink-3 text-accent transition group-hover:bg-accent group-hover:text-ink">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d={s.icon} />
                </svg>
              </div>
              <h3 className="mt-6 text-xl font-medium">{s.title}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-mist">{s.text}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
