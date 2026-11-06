/** Prefixes a public/ asset path with Vite's base URL so it works on GitHub Pages (/impala-klesarstvo/) and at the root. */
export const asset = (path: string) => import.meta.env.BASE_URL + path.replace(/^\//, '')
