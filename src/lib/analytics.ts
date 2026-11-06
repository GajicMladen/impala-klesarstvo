/**
 * Minimal first-party analytics. Events are posted (fire-and-forget) to VITE_ANALYTICS_ENDPOINT –
 * the Google Apps Script web app in analytics/Code.gs, which appends them to a Google Sheet and
 * serves aggregated statistics for the /analitika page. No cookies; a random per-tab session id
 * (sessionStorage) and a per-browser visitor id (localStorage) are the only identifiers.
 */
const ENDPOINT = ((import.meta.env.VITE_ANALYTICS_ENDPOINT as string | undefined) || '').trim() || undefined
const KEY = ((import.meta.env.VITE_ANALYTICS_KEY as string | undefined) || '').trim()

export const analyticsEnabled = !!ENDPOINT

export type EventName =
  | 'page_view'
  | 'material_open'
  | 'configurator_open'
  | 'sketch_downloaded'
  | 'sketch_shared'
  | 'inquiry_sent'
  | 'phone_click'
  | 'whatsapp_click'

type Props = Record<string, string | number | boolean>

function idFrom(storage: Storage, key: string) {
  try {
    let v = storage.getItem(key)
    if (!v) {
      v = Math.random().toString(36).slice(2, 10) + Date.now().toString(36)
      storage.setItem(key, v)
    }
    return v
  } catch {
    return 'na'
  }
}

export function track(event: EventName, props: Props = {}) {
  if (typeof window === 'undefined') return
  const ref = document.referrer && !document.referrer.includes(location.host) ? document.referrer : ''
  const payload = {
    key: KEY,
    event,
    path: location.pathname.replace(import.meta.env.BASE_URL.replace(/\/$/, ''), '') || '/',
    ref,
    sid: idFrom(sessionStorage, 'impala-sid'),
    vid: idFrom(localStorage, 'impala-vid'),
    device: window.matchMedia('(max-width: 767px)').matches ? 'mobilni' : 'računalo',
    lang: navigator.language,
    w: window.innerWidth,
    ts: new Date().toISOString(),
    props: JSON.stringify(props),
  }
  if (!ENDPOINT) {
    if (import.meta.env.DEV) console.debug('[analytics]', payload)
    return
  }
  const body = JSON.stringify(payload)
  try {
    if (navigator.sendBeacon && navigator.sendBeacon(ENDPOINT, new Blob([body], { type: 'text/plain' }))) return
  } catch {
    /* fall through */
  }
  fetch(ENDPOINT, { method: 'POST', body, mode: 'no-cors', keepalive: true, headers: { 'Content-Type': 'text/plain' } }).catch(() => {})
}

export interface Stats {
  ok: true
  days: number
  generatedAt: string
  totals: Record<string, number>
  sessions: number
  visitors: number
  byDay: { day: string; sessions: number; views: number; inquiries: number; phone: number }[]
  devices: Record<string, number>
  pages: [string, number][]
  materials: [string, number][]
  refs: [string, number][]
}

export async function fetchStats(token: string, days: number): Promise<Stats> {
  if (!ENDPOINT) throw new Error('Analitika nije konfigurirana.')
  const url = `${ENDPOINT}${ENDPOINT.includes('?') ? '&' : '?'}token=${encodeURIComponent(token)}&days=${days}`
  const res = await fetch(url, { redirect: 'follow' })
  const json = (await res.json()) as Stats | { ok: false; error?: string }
  if (!json.ok) throw new Error(json.error === 'unauthorized' ? 'Pogrešan token.' : json.error || 'Dohvaćanje nije uspjelo.')
  return json
}
