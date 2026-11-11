import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { byId, materials } from '../data/materials'
import { useTileTexture } from '../lib/useTexture'
import { asset } from '../lib/asset'
import { PRIMARY_PHONE } from '../data/contact'

/* Izolirani radovi (pozadina uklonjena) – public/hero/ */
const cutouts = [
  { src: '/hero/grobnica.png', alt: 'Obiteljska grobnica od crnog i crvenog granita', className: 'bottom-0 left-1/2 w-[92%] -translate-x-1/2 lg:w-[88%]', delay: 0.3 },
  { src: '/hero/spomenik-srce.png', alt: 'Spomenik u obliku srca s klesanom ružom', className: 'left-0 top-0 w-[46%]', delay: 0.5 },
  { src: '/hero/spomenik-andjeo.png', alt: 'Spomenik s anđelom od bijelog mramora', className: 'right-0 -top-[3%] w-[40%]', delay: 0.65 },
]

/** 2–4 vrste, inače vrsta (1 vrsta, 5 vrsta, 21 vrsta …). */
const stoneKinds = (n: number) => (n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 12 || n % 100 > 14) ? 'vrste kamena' : 'vrsta kamena')

export function Hero() {
  const impala = byId('impala')!
  const tex = useTileTexture(impala)
  const [video, setVideo] = useState(true)

  return (
    <section id="top" className="relative flex min-h-screen items-end overflow-hidden">
      <div className="absolute inset-0" aria-hidden="true">
        <div
          className="hero-pan absolute inset-0 opacity-35"
          style={{ backgroundImage: tex ? `url(${tex})` : undefined, backgroundSize: '512px', backgroundColor: '#161719' }}
        />
        {video && (
          /* Ubacite video radionice u public/video/hero.mp4 – automatski se prikazuje. */
          <video
            className="absolute inset-0 h-full w-full object-cover opacity-70"
            src={asset('video/hero.mp4')}
            autoPlay
            muted
            loop
            playsInline
            onError={() => setVideo(false)}
          />
        )}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_25%_15%,rgba(62,163,111,0.22),transparent_55%)]" />
        <div className="absolute inset-0 bg-linear-to-t from-ink via-ink/75 to-ink/25" />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-5 pb-12 pt-28 md:px-8 md:pb-16 md:pt-32">
        <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-14">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="mb-6 flex items-center gap-3 text-xs font-medium uppercase tracking-[0.22em] text-accent"
            >
              <span className="h-px w-8 bg-accent" />
              Klesarstvo · Borovo, Vukovar
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="text-[2.75rem] font-light leading-[0.98] tracking-tight sm:text-5xl md:text-6xl lg:text-[4.25rem]"
            >
              Obiteljska tradicija
              <br />
              duga <span className="font-semibold">30 godina</span>,
              <br />
              uklesana u kamen.
            </motion.h1>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.35 }}
              className="mt-9 flex flex-wrap items-center gap-4"
            >
              <Link
                to="/konfigurator"
                className="rounded-full bg-accent px-6 py-3.5 font-medium text-ink transition hover:bg-paper"
              >
                Dizajnirajte svoj spomenik
              </Link>
              <a
                href={`tel:${PRIMARY_PHONE.tel}`}
                className="rounded-full border border-paper/30 px-6 py-3.5 font-medium transition hover:border-paper hover:bg-paper/5"
              >
                Nazovite: {PRIMARY_PHONE.label}
              </a>
            </motion.div>
          </div>

          {/* desktop: collage */}
          <div className="relative hidden h-[520px] lg:block" aria-hidden="true">
            {cutouts.map((p) => (
              <motion.img
                key={p.src}
                src={asset(p.src)}
                alt={p.alt}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: p.delay, ease: [0.22, 1, 0.36, 1] }}
                className={`absolute ${p.className} drop-shadow-[0_30px_35px_rgba(0,0,0,0.75)]`}
                loading="eager"
              />
            ))}
          </div>
          {/* mobile / tablet: a single isolated monument */}
          <div className="flex justify-center lg:hidden" aria-hidden="true">
            <motion.img
              src={asset('/hero/spomenik-andjeo.png')}
              alt="Spomenik s anđelom od bijelog mramora"
              initial={{ opacity: 0, x: 90 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="w-[74%] max-w-sm drop-shadow-[0_24px_30px_rgba(0,0,0,0.75)]"
              loading="eager"
            />
          </div>
        </div>

        <motion.dl
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-10 grid max-w-xl grid-cols-3 gap-6 border-t border-line pt-6 lg:mt-14"
        >
          {[
            ['30+', 'godina iskustva'],
            [String(materials.length), stoneKinds(materials.length)],
            ['1', 'radionica, vlastita proizvodnja'],
          ].map(([n, l]) => (
            <div key={l}>
              <dt className="text-2xl font-semibold md:text-3xl">{n}</dt>
              <dd className="mt-1 text-xs uppercase tracking-[0.16em] text-mist">{l}</dd>
            </div>
          ))}
        </motion.dl>
      </div>
    </section>
  )
}
