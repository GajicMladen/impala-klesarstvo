# Impala Klesarstvo – prezentacijska web stranica

Demo sajt za **Impala Klesarstvo d.o.o.** (Borovo – Vukovar), inspirisan dizajnom [margraf.it](https://www.margraf.it/it/).

## Pokretanje

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # produkcijski build u dist/
npm run preview    # pregled builda
```

Stack: Vite + React 19 + TypeScript + Tailwind CSS v4 + Framer Motion + React Router. Nema backend-a – sve je statično i može se hostovati bilo gde. Pošto postoje rute (`/materijali`, `/konfigurator`), hosting mora da vraća `index.html` za sve putanje: uključeni su `public/_redirects` (Netlify/Cloudflare) i `vercel.json` (Vercel); za cPanel/Apache dodati `.htaccess` rewrite.

## Stranice

| Ruta | Sadržaj |
| --- | --- |
| `/` | Hero (izolovani radovi bez pozadine), 3D karusel materijala, radovi, usluge, teaser konfiguratora, o nama, kontakt |
| `/materijali` | Katalog sa filterima (boja, vrsta, primjena, porijeklo) |
| `/konfigurator` | Konfigurator spomenika (prima `?kamen=<id>` iz modala materijala) |

## Šta sajt sadrži

| Sekcija | Opis |
| --- | --- |
| Hero | Naslov, CTA dugmad, 3 fotografije radova. Ako postoji `public/video/hero.mp4`, automatski se prikazuje kao pozadinski video. |
| Materijali (3D karusel) | Margraf-style perspektivni karusel sa 10 istaknutih materijala. Strelice, prevlačenje, tastatura. |
| Katalog | 24 materijala, filteri: boja, vrsta, primjena, porijeklo. Klik otvara detalje. |
| Radovi | 10 fotografija sa Instagram profila `@impalaklesarstvo`, lightbox. |
| Usluge | 6 kartica usluga. |
| Konfigurator spomenika | Oblik i dimenzije, kamen ploče i postolja, font i boja slova. Svi elementi na skici se **slobodno prevlače** (miš i touch): natpisi (prezime, više imena/godina/epitafa), fotografije (prazan okvir ili upload prave slike, ostaje lokalno), gravirani ukrasi (križ, pravoslavni križ, ruža, golubica, anđeo), 3D skulpture (anđeo, Gospa, stojeći križ, knjiga), vaze (3 oblika) i lampioni (2). Dugme „Docrtaj spomenik“ uključuje crtanje linija sa teksturom odabranog kamena. Odabrani element se može smanjiti/povećati/ukloniti (i tipkom Delete). Toast poruke potvrđuju svaku akciju. Okvirna cena (demo), PNG skica, slanje upita WhatsApp-om: na telefonu preko Web Share API-ja (skica kao slika + tekst upita u sistemskom „Podijeli“ meniju), na računaru skica se preuzme i otvori se WhatsApp sa tekstom. Mobilni: skica je sticky na vrhu, kontrole u tabovima. |
| O nama / Kontakt | Podaci o firmi, telefoni, OSM mapa, linkovi na društvene mreže. |

## Teksture kamena

Teksture se **generišu proceduralno** na klijentu (`src/lib/textures.ts`) iz seeda i palete boja, tako da demo ne zavisi od tuđih fotografija. Kada radionica dostavi prave fotografije ploča, dovoljno je u `src/data/materials.ts` zameniti `texture` sa URL-om slike (i u `StoneTile`/konfiguratoru koristiti tu sliku umesto generisane).

## Šta je placeholder i treba potvrditi sa firmom

- **Radno vrijeme** u sekciji Kontakt (Pon–Pet 07–16, Sub po dogovoru) – pretpostavka.
- **Cene u konfiguratoru** – čisto ilustrativne, označene kao „demo“. Formula je u `Configurator.tsx` (`price`).
- **Lista materijala i opisi** – tipični graniti/mramori iz klesarske prakse; uskladiti sa stvarnom ponudom.
- **Lokacija na mapi** – koordinate ulice Željeznička u Borovu (približno, kućni broj nije geokodiran).
- **E-mail adresa** – nije poznata, zato upit ide preko WhatsApp-a / telefona.
- **Logo** – korišćena je profilna slika sa Instagrama (150 px). Tražiti vektorski logo.
- **Hero fotografije** – pozadina je uklonjena macOS Vision framework-om (`VNGenerateForegroundInstanceMaskRequest`); za produkciju tražiti originale u visokoj rezoluciji.
- **Sličice ukrasa, vaza i lampiona** – nacrtane SVG ilustracije; zameniti pravim fotografijama iz kataloga dobavljača.
- **Fotografije radova** – 640 px verzije sa Instagrama. Za produkciju tražiti originale (i saglasnost porodica za prikaz imena na spomenicima).

## Dodavanje sadržaja

- Video: `public/video/hero.mp4` (mp4, H.264, bez zvuka, 10–20 s).
- Fotografije radova: `public/radovi/` + unos u `src/data/works.ts`.
- Materijali: `src/data/materials.ts`.

## Sledeći koraci (predlog za prezentaciju)

1. Konfigurator v2: 3D prikaz (three.js), više oblika, biblioteka ornamenata, upload fotografije pokojnika, generisanje PDF ponude.
2. Admin panel za unos materijala, radova i cena (npr. Payload/Strapi ili Supabase).
3. Kontakt forma sa slanjem na e-mail + čuvanje upita.
4. Višejezičnost (HR / SR ćirilica / EN) – Vukovar je dvojezična sredina.
5. SEO i Google Business profil, povezivanje sa Instagram API-jem za automatsku galeriju.

## Deploy (GitHub Pages)

```bash
npm run deploy
```

Skripta [scripts/deploy.sh](scripts/deploy.sh) napravi `npm run build:pages` (Vite `base` = `/impala-klesarstvo/`, plus `404.html` kopija za SPA rute i `.nojekyll`) i force-pushuje `dist/` na granu `gh-pages`, koju GitHub Pages servira na **https://gajicmladen.github.io/impala-klesarstvo/**.

Za hosting na vlastitoj domeni koristiti običan `npm run build` (base `/`) i rewrite svih putanja na `index.html`.
