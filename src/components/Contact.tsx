import { SectionHead } from './SectionHead'
import { FACEBOOK_URL, INSTAGRAM_URL, PHONES, PRIMARY_PHONE } from '../data/contact'

const LAT = 45.4067
const LON = 18.9724
const mapSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${LON - 0.018}%2C${LAT - 0.009}%2C${LON + 0.018}%2C${LAT + 0.009}&layer=mapnik&marker=${LAT}%2C${LON}`

export function Contact() {
  return (
    <section id="kontakt" className="border-t border-line bg-ink-2 py-24 md:py-32">
      <div className="mx-auto grid max-w-7xl gap-14 px-5 md:px-8 lg:grid-cols-[1fr_1.15fr]">
        <div>
          <SectionHead eyebrow="Kontakt" title="Dođite u radionicu ili nas nazovite" />
          <dl className="mt-10 space-y-8">
            <div>
              <dt className="text-xs font-medium uppercase tracking-[0.2em] text-mist">Radionica</dt>
              <dd className="mt-2 text-lg">
                Željeznička 45
                <br />
                32227 Borovo, Vukovar
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-[0.2em] text-mist">Telefon</dt>
              <dd className="mt-2 space-y-1 text-lg">
                {PHONES.map((p) => (
                  <a key={p.tel} href={`tel:${p.tel}`} className="block transition hover:text-accent">
                    {p.label} <span className="text-sm text-mist">· {p.name}</span>
                  </a>
                ))}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-[0.2em] text-mist">Radno vrijeme</dt>
              <dd className="mt-2 text-lg">
                Pon – Pet: 07:00 – 16:00
                <br />
                Sub: po dogovoru
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-[0.2em] text-mist">Pratite nas</dt>
              <dd className="mt-3 flex gap-3">
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-line px-4 py-2 text-sm transition hover:border-paper"
                >
                  Instagram
                </a>
                <a
                  href={FACEBOOK_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-line px-4 py-2 text-sm transition hover:border-paper"
                >
                  Facebook
                </a>
                <a
                  href={`https://wa.me/${PRIMARY_PHONE.wa}`}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-line px-4 py-2 text-sm transition hover:border-paper"
                >
                  WhatsApp
                </a>
              </dd>
            </div>
          </dl>
        </div>

        <div className="overflow-hidden rounded-3xl border border-line bg-ink">
          <iframe
            title="Karta – Impala Klesarstvo, Borovo"
            src={mapSrc}
            className="h-[420px] w-full lg:h-full lg:min-h-[560px]"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  )
}
