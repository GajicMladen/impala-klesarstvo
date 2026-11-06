import { Link } from 'react-router-dom'
import { asset } from '../lib/asset'

export function Footer() {
  return (
    <footer className="border-t border-line py-14">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 md:grid-cols-[1.4fr_1fr_1fr] md:px-8">
        <div>
          <div className="flex items-center gap-3">
            <span className="grid size-11 place-items-center overflow-hidden rounded-full bg-white">
              <img src={asset('logo-impala.jpg')} alt="" className="size-10 object-contain" />
            </span>
            <span className="leading-tight">
              <span className="block text-sm font-semibold tracking-[0.22em]">IMPALA</span>
              <span className="block text-[11px] uppercase tracking-[0.18em] text-mist">Klesarstvo · Vukovar</span>
            </span>
          </div>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-mist">
            Obiteljska tradicija duga 30 godina. Nadgrobni spomenici, grobnice i kameni elementi za dom od prirodnog kamena.
          </p>
        </div>
        <div>
          <div className="text-xs font-medium uppercase tracking-[0.2em] text-mist">Stranica</div>
          <ul className="mt-4 space-y-2 text-sm">
            {[
              ['/materijali', 'Materijali'],
              ['/#radovi', 'Radovi'],
              ['/#usluge', 'Usluge'],
              ['/konfigurator', 'Konfigurator spomenika'],
              ['/#o-nama', 'O nama'],
              ['/#kontakt', 'Kontakt'],
            ].map(([h, l]) => (
              <li key={h}>
                <Link to={h} className="transition hover:text-accent">
                  {l}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="text-xs font-medium uppercase tracking-[0.2em] text-mist">Kontakt</div>
          <ul className="mt-4 space-y-2 text-sm">
            <li>Željeznička 45, 32227 Borovo</li>
            <li>
              <a href="tel:+385981826790" className="transition hover:text-accent">
                098 182 6790
              </a>
            </li>
            <li>
              <a href="tel:+385989077071" className="transition hover:text-accent">
                098 9077 071
              </a>
            </li>
            <li>
              <a href="https://www.instagram.com/impalaklesarstvo/" target="_blank" rel="noreferrer" className="transition hover:text-accent">
                @impalaklesarstvo
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="mx-auto mt-12 flex max-w-7xl flex-col gap-2 border-t border-line px-5 pt-6 text-xs text-mist md:flex-row md:items-center md:justify-between md:px-8">
        <div>© {new Date().getFullYear()} Impala Klesarstvo d.o.o. · OIB 89374955035 · Borovo, Hrvatska</div>
        <div>Prezentacijska verzija web stranice</div>
      </div>
    </footer>
  )
}
