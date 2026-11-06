import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { analyticsEnabled, fetchStats, type Stats } from '../lib/analytics'
import { SectionHead } from '../components/SectionHead'

const ACCENT = '#3ea36f'
const ACCENT_HOVER = '#62c48f'
const GRID = '#2a2a2e'
const PERIODS = [7, 30, 90]
const fmt = (n: number) => n.toLocaleString('hr-HR')
const dayLabel = (iso: string) => {
  const [, m, d] = iso.split('-')
  return `${Number(d)}.${Number(m)}.`
}

/* ---------- column chart: one series, hover tooltip, clean ticks ---------- */
function Columns({ title, data, valueLabel }: { title: string; data: { day: string; value: number }[]; valueLabel: string }) {
  const [hover, setHover] = useState<number | null>(null)
  const W = 640
  const H = 220
  const padL = 36
  const padR = 8
  const padT = 14
  const padB = 28
  const max = Math.max(1, ...data.map((d) => d.value))
  const step = max <= 5 ? 1 : max <= 10 ? 2 : max <= 50 ? 10 : max <= 100 ? 20 : max <= 500 ? 100 : Math.pow(10, Math.floor(Math.log10(max)))
  const top = Math.ceil(max / step) * step
  const ticks = Array.from({ length: top / step + 1 }, (_, i) => i * step)
  const plotW = W - padL - padR
  const plotH = H - padT - padB
  const band = plotW / data.length
  const barW = Math.min(24, Math.max(2, band - 2))
  const y = (v: number) => padT + plotH - (v / top) * plotH
  const labelEvery = data.length > 45 ? 15 : data.length > 14 ? 7 : 1
  const h = hover !== null ? data[hover] : null

  return (
    <div className="rounded-3xl border border-line bg-ink-2 p-5">
      <div className="mb-3 flex items-baseline justify-between">
        <h3 className="font-medium">{title}</h3>
        <span className="text-xs text-mist">{valueLabel}</span>
      </div>
      <div className="relative">
        <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full" role="img" aria-label={`${title}: ${valueLabel} po danu`}>
          {ticks.map((tk) => (
            <g key={tk}>
              <line x1={padL} x2={W - padR} y1={y(tk)} y2={y(tk)} stroke={GRID} strokeWidth="1" />
              <text x={padL - 6} y={y(tk) + 3.5} textAnchor="end" fontSize="10" fill="#a3a09b" fontFamily="Gantari, sans-serif" style={{ fontVariantNumeric: 'tabular-nums' }}>
                {fmt(tk)}
              </text>
            </g>
          ))}
          {data.map((d, i) => {
            const x = padL + i * band + (band - barW) / 2
            const bh = Math.max(0, y(0) - y(d.value))
            const r = Math.min(4, bh / 2, barW / 2)
            const path = bh === 0 ? '' : `M${x},${y(0)} L${x},${y(0) - bh + r} Q${x},${y(0) - bh} ${x + r},${y(0) - bh} L${x + barW - r},${y(0) - bh} Q${x + barW},${y(0) - bh} ${x + barW},${y(0) - bh + r} L${x + barW},${y(0)} Z`
            return (
              <g key={d.day} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)} onFocus={() => setHover(i)} onBlur={() => setHover(null)} tabIndex={0} role="img" aria-label={`${dayLabel(d.day)}: ${fmt(d.value)}`}>
                <rect x={padL + i * band} y={padT} width={band} height={plotH} fill="#000" fillOpacity="0" />
                {path && <path d={path} fill={hover === i ? ACCENT_HOVER : ACCENT} />}
                {i % labelEvery === 0 && (
                  <text x={padL + i * band + band / 2} y={H - 8} textAnchor="middle" fontSize="10" fill="#a3a09b" fontFamily="Gantari, sans-serif">
                    {dayLabel(d.day)}
                  </text>
                )}
              </g>
            )
          })}
        </svg>
        {h && hover !== null && (
          <div
            className="pointer-events-none absolute -top-2 -translate-x-1/2 -translate-y-full rounded-xl border border-line bg-ink px-3 py-2 text-xs shadow-xl"
            style={{ left: `${((padL + hover * band + band / 2) / W) * 100}%` }}
          >
            <div className="text-base font-semibold">{fmt(h.value)}</div>
            <div className="text-mist">{dayLabel(h.day)} · {valueLabel}</div>
          </div>
        )}
      </div>
    </div>
  )
}

/* ---------- horizontal bars: one hue, value at the tip ---------- */
function Bars({ title, rows, empty = 'Još nema podataka.' }: { title: string; rows: [string, number][]; empty?: string }) {
  const max = Math.max(1, ...rows.map((r) => r[1]))
  return (
    <div className="rounded-3xl border border-line bg-ink-2 p-5">
      <h3 className="mb-4 font-medium">{title}</h3>
      {rows.length === 0 ? (
        <div className="text-sm text-mist">{empty}</div>
      ) : (
        <ul className="space-y-2.5">
          {rows.map(([label, value]) => (
            <li key={label} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 text-sm">
              <div className="min-w-0">
                <div className="truncate text-paper/85" title={label}>
                  {label}
                </div>
                <div className="mt-1 h-2 w-full rounded-full bg-ink-3">
                  <div className="h-2 rounded-full" style={{ width: `${(value / max) * 100}%`, background: ACCENT }} />
                </div>
              </div>
              <div className="w-10 text-right tabular-nums text-paper">{fmt(value)}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function Tile({ label, value, hint }: { label: string; value: ReactNode; hint?: string }) {
  return (
    <div className="rounded-2xl border border-line bg-ink-2 p-4">
      <div className="text-xs text-mist">{label}</div>
      <div className="mt-1 text-2xl font-semibold">{value}</div>
      {hint && <div className="mt-1 text-xs text-mist">{hint}</div>}
    </div>
  )
}

/* ---------- setup guide (endpoint not configured) ---------- */
function Setup() {
  const steps = [
    'Napravite novu Google tablicu, npr. „Impala analitika“.',
    'Proširenja → Apps Script → zalijepite sadržaj datoteke analytics/Code.gs.',
    'Postavke projekta → Svojstva skripte: TOKEN (lozinka za ovu stranicu) i po želji KEY.',
    'Implementiraj → Nova implementacija → Web-aplikacija (Izvrši kao: ja · Pristup: svi) → kopirajte URL.',
    'U .env sajta: VITE_ANALYTICS_ENDPOINT=<URL> (i VITE_ANALYTICS_KEY), zatim npm run deploy.',
  ]
  return (
    <div className="mt-12 max-w-2xl rounded-3xl border border-line bg-ink-2 p-7">
      <div className="text-xs font-medium uppercase tracking-[0.22em] text-gold">Nije konfigurirano</div>
      <h3 className="mt-2 text-xl font-medium">Analitika još ne prima podatke</h3>
      <p className="mt-2 text-sm text-mist">Sajt bilježi posjete i upite tek kad postavite vlastitu Google tablicu kao spremište. Bez kolačića, bez trećih strana.</p>
      <ol className="mt-5 space-y-2 text-sm">
        {steps.map((s, i) => (
          <li key={s} className="flex gap-3">
            <span className="grid size-6 shrink-0 place-items-center rounded-full bg-accent/15 text-xs font-semibold text-accent">{i + 1}</span>
            <span className="text-paper/85">{s}</span>
          </li>
        ))}
      </ol>
    </div>
  )
}

export function AnalyticsPage() {
  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem('impala-analytics-token') ?? ''
    } catch {
      return ''
    }
  })
  const [days, setDays] = useState(30)
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [table, setTable] = useState(false)

  const load = async (d = days) => {
    if (!token) return
    setLoading(true)
    setError(null)
    try {
      const s = await fetchStats(token, d)
      setStats(s)
      try {
        localStorage.setItem('impala-analytics-token', token)
      } catch {
        /* ignore */
      }
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (analyticsEnabled && token) void load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const derived = useMemo(() => {
    if (!stats) return null
    const t = stats.totals
    const sketches = (t.sketch_downloaded ?? 0) + (t.sketch_shared ?? 0)
    const inquiries = t.inquiry_sent ?? 0
    const conv = stats.sessions ? Math.round((inquiries / stats.sessions) * 1000) / 10 : 0
    const devices = Object.entries(stats.devices).sort((a, b) => b[1] - a[1]) as [string, number][]
    return { sketches, inquiries, conv, devices, phone: t.phone_click ?? 0, cfg: t.configurator_open ?? 0 }
  }, [stats])

  return (
    <section className="pb-24 pt-32 md:pb-32 md:pt-40">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHead eyebrow="Interno" title="Analitika" text="Posjete, upiti i ponašanje posjetitelja. Podaci žive u vašoj Google tablici; ova stranica ih samo prikazuje." />

        {!analyticsEnabled ? (
          <Setup />
        ) : (
          <>
            <form
              className="mt-10 flex flex-wrap items-center gap-3"
              onSubmit={(e) => {
                e.preventDefault()
                void load()
              }}
            >
              <input
                type="password"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Token za pristup"
                className="w-56 rounded-full border border-line bg-ink px-4 py-2.5 text-sm outline-none transition focus:border-accent"
                aria-label="Token za pristup"
              />
              <button type="submit" className="rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-ink transition hover:bg-paper">
                Prikaži
              </button>
              <span className="mx-1 hidden h-5 w-px bg-line sm:block" />
              {PERIODS.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => {
                    setDays(p)
                    void load(p)
                  }}
                  aria-pressed={days === p}
                  className={`rounded-full border px-4 py-2 text-sm transition ${days === p ? 'border-accent bg-accent text-ink' : 'border-line text-paper/85 hover:border-paper/60'}`}
                >
                  {p} dana
                </button>
              ))}
              {error && <span className="text-sm text-red-300">{error}</span>}
            </form>

            {stats && derived && (
              <div className={`mt-8 space-y-5 transition-opacity ${loading ? 'opacity-50' : ''}`}>
                <div className="grid gap-4 lg:grid-cols-[1.2fr_2fr]">
                  <div className="rounded-3xl border border-line bg-ink-2 p-6">
                    <div className="text-xs text-mist">Posjete u zadnjih {stats.days} dana</div>
                    <div className="mt-1 text-5xl font-semibold leading-none md:text-6xl">{fmt(stats.sessions)}</div>
                    <div className="mt-2 text-sm text-mist">
                      {fmt(stats.visitors)} različitih posjetitelja · {fmt(stats.totals.page_view ?? 0)} pregleda stranica
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                    <Tile label="Poslani upiti" value={fmt(derived.inquiries)} hint={`konverzija ${derived.conv.toLocaleString('hr-HR')} %`} />
                    <Tile label="Klikovi na telefon" value={fmt(derived.phone)} />
                    <Tile label="Otvoren konfigurator" value={fmt(derived.cfg)} />
                    <Tile label="Skice (preuzete + podijeljene)" value={fmt(derived.sketches)} />
                    <Tile label="Otvoreni materijali" value={fmt(stats.totals.material_open ?? 0)} />
                    <Tile label="WhatsApp s kontakta" value={fmt(stats.totals.whatsapp_click ?? 0)} />
                  </div>
                </div>

                <div className="grid gap-5 lg:grid-cols-2">
                  <Columns title="Posjete po danu" valueLabel="posjete" data={stats.byDay.map((d) => ({ day: d.day, value: d.sessions }))} />
                  <Columns title="Upiti po danu" valueLabel="upiti" data={stats.byDay.map((d) => ({ day: d.day, value: d.inquiries }))} />
                </div>

                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                  <Bars title="Uređaji" rows={derived.devices} />
                  <Bars title="Najposjećenije stranice" rows={stats.pages} />
                  <Bars title="Materijali koji zanimaju" rows={stats.materials} />
                  <Bars title="Izvori prometa" rows={stats.refs} />
                </div>

                <div className="rounded-3xl border border-line bg-ink-2 p-5">
                  <button type="button" onClick={() => setTable((v) => !v)} className="text-sm text-mist underline-offset-4 hover:text-paper hover:underline" aria-expanded={table}>
                    {table ? 'Sakrij tablicu' : 'Prikaži tablicu po danima'}
                  </button>
                  {table && (
                    <div className="mt-4 overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="text-left text-xs uppercase tracking-[0.14em] text-mist">
                          <tr>
                            <th className="py-2 pr-4 font-medium">Dan</th>
                            <th className="py-2 pr-4 font-medium">Posjete</th>
                            <th className="py-2 pr-4 font-medium">Pregledi</th>
                            <th className="py-2 pr-4 font-medium">Upiti</th>
                            <th className="py-2 pr-4 font-medium">Pozivi</th>
                          </tr>
                        </thead>
                        <tbody className="tabular-nums">
                          {[...stats.byDay].reverse().map((d) => (
                            <tr key={d.day} className="border-t border-line">
                              <td className="py-1.5 pr-4">{d.day}</td>
                              <td className="py-1.5 pr-4">{fmt(d.sessions)}</td>
                              <td className="py-1.5 pr-4">{fmt(d.views)}</td>
                              <td className="py-1.5 pr-4">{fmt(d.inquiries)}</td>
                              <td className="py-1.5 pr-4">{fmt(d.phone)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
                <div className="text-xs text-mist">Ažurirano {new Date(stats.generatedAt).toLocaleString('hr-HR')}</div>
              </div>
            )}
            {!stats && !error && <p className="mt-8 text-sm text-mist">Unesite token i kliknite „Prikaži“.</p>}
          </>
        )}
      </div>
    </section>
  )
}
