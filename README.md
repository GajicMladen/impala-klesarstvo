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
| `/materijali` | Katalog sa filterima (boja, vrsta, primjena) |
| `/konfigurator` | Konfigurator spomenika (prima `?kamen=<id>` iz modala materijala) |

## Šta sajt sadrži

| Sekcija | Opis |
| --- | --- |
| Hero | Naslov, CTA dugmad, 3 fotografije radova. Ako postoji `public/video/hero.mp4`, automatski se prikazuje kao pozadinski video. |
| Materijali (3D karusel) | Margraf-style perspektivni karusel sa svim materijalima (`featured`). Strelice, prevlačenje, tastatura. |
| Katalog | 9 granita iz stvarne ponude radionice (fotografije ploča), filteri: boja i primjena (vrsta se prikazuje tek kad postoji više od jedne). Klik otvara detalje. |
| Radovi | 12 fotografija: 10 s Instagram profila `@impalaklesarstvo` + stubište i šank koje je dostavila radionica, lightbox. Linkovi na Instagram i Facebook. |
| Usluge | 6 kartica usluga. |
| Konfigurator spomenika | Oblik i dimenzije, kamen ploče i postolja, font i boja slova. Svi elementi na skici se **slobodno prevlače** (miš i touch): natpisi (prezime, više imena/godina/epitafa), fotografije (prazan okvir ili upload prave slike, ostaje lokalno), gravirani ukrasi (križ, pravoslavni križ, ruža, golubica, anđeo), 3D skulpture (anđeo, Gospa, stojeći križ, knjiga), vaze (3 oblika) i lampioni (2). Dugme „Docrtaj spomenik“ uključuje crtanje linija sa teksturom odabranog kamena. Odabrani element se može smanjiti/povećati/ukloniti (i tipkom Delete). Toast poruke potvrđuju svaku akciju. Cena se namerno ne prikazuje (zahtev radionice – konkurencija), PNG skica, slanje upita WhatsApp-om: na telefonu preko Web Share API-ja (skica kao slika + tekst upita u sistemskom „Podijeli“ meniju), na računaru skica se preuzme i otvori se WhatsApp sa tekstom. Mobilni: skica je sticky na vrhu, kontrole u tabovima. |
| O nama / Kontakt | Podaci o firmi, telefoni (Jovan je primarni broj svuda, uključujući WhatsApp upite), OSM mapa, Instagram i Facebook. Svi kontakt podaci su u `src/data/contact.ts`. |

## Teksture kamena

Materijali koriste **prave fotografije ploča** koje je dostavila radionica (originali u `dostavljeni-materijal/` u korenu projekta – nisu u gitu ni na sajtu). Skripta [scripts/materijali.py](scripts/materijali.py) iz svake pravi:

- `public/materijali/<id>.jpg` – isječak bez odsjaja za katalog, modal i karusel (`photo` u `materials.ts`),
- `public/materijali/tile/<id>.jpg` – bešavnu pločicu 512 px za skicu u konfiguratoru i pozadinu naslovnice (`tile`), da zrno kamena na spomeniku bude u realnoj razmeri,
- paletu boja (`texture.palette`) za boju dok se slika učitava i za izbor boje slova (svetao/taman kamen).

Pločice se u konfiguratoru učitavaju kao data URL, jer izvoz skice u PNG serijalizuje SVG i spoljne slike u njemu ne bi bile vidljive. Proceduralni generator (`src/lib/textures.ts`) ostaje za mramorne skulpture u konfiguratoru i kao rezerva ako fotografija ne može da se učita.

## Šta je placeholder i treba potvrditi sa firmom

- **Radno vrijeme** u sekciji Kontakt (Pon–Pet 07–16, Sub po dogovoru) – pretpostavka.
- **Opisi materijala** – lista je stvarna (9 granita od radionice), ali opisi i primena su naši; zemlja porekla se namerno ne prikazuje; neka ih radionica potvrdi.
- **Kamen na radovima** – gde nismo sigurni, opis je opšti (npr. „Crni granit“); tačne nazive za stubište i šank treba dobiti od radionice.
- **Lokacija na mapi** – koordinate ulice Željeznička u Borovu (približno, kućni broj nije geokodiran).
- **E-mail adresa** – nije poznata, zato upit ide preko WhatsApp-a / telefona.
- **Logo** – korišćena je profilna slika sa Instagrama (150 px). Tražiti vektorski logo.
- **Hero fotografije** – pozadina je uklonjena macOS Vision framework-om (`VNGenerateForegroundInstanceMaskRequest`); za produkciju tražiti originale u visokoj rezoluciji.
- **Sličice ukrasa, vaza i lampiona** – nacrtane SVG ilustracije; zameniti pravim fotografijama iz kataloga dobavljača.
- **Fotografije radova** – 640 px verzije sa Instagrama. Za produkciju tražiti originale (i saglasnost porodica za prikaz imena na spomenicima).

## Dodavanje sadržaja

- Video: `public/video/hero.mp4` (mp4, H.264, bez zvuka, 10–20 s).
- Fotografije radova: `public/radovi/` + unos u `src/data/works.ts`.
- Materijali: fotografija u `dostavljeni-materijal/` → red u `CROPS` u `scripts/materijali.py` → pokrenuti skriptu → unos u `src/data/materials.ts` (`...photos('<id>')` + paleta iz ispisa skripte).

## Sledeći koraci (predlog za prezentaciju)

1. Konfigurator v2: 3D prikaz (three.js), više oblika, biblioteka ornamenata, upload fotografije pokojnika, generisanje PDF ponude.
2. Admin panel za unos materijala, radova i cena (npr. Payload/Strapi ili Supabase).
3. Kontakt forma sa slanjem na e-mail + čuvanje upita.
4. Višejezičnost (HR / SR ćirilica / EN) – Vukovar je dvojezična sredina.
5. SEO i Google Business profil, povezivanje sa Instagram API-jem za automatsku galeriju.

## Slanje skice WhatsApp-om

WhatsApp linkovi (`wa.me`) primaju samo tekst, pa prilog ide na jedan od dva načina:

1. **Bez backend-a (podrazumevano)** – postupak u dva koraka u prozoru „Pošalji upit“: (1) `wa.me` link otvara razgovor sa brojem radionice i upisuje tekst upita (broj ne mora biti sačuvan), (2) „Podijeli skicu“ otvara sistemski meni (telefon) gde je taj razgovor na vrhu liste, ili kopira/preuzima PNG (računar) za lepljenje u razgovor. Tu je i „Spremi kontakt radionice“ (`public/impala-klesarstvo.vcf`).
2. **Automatski** – ako je u `.env` postavljen `VITE_IMGBB_KEY` (besplatan ključ sa api.imgbb.com), skica se uploaduje i WhatsApp se otvara sa tekstom i linkom na sliku, broj je već upisan. Ključ se ugrađuje u bundle, pa je javan; za produkciju je bolje upload preko sopstvenog backenda (Supabase/Cloudinary).

## Interna analitika

Sajt beleži događaje (`page_view`, `material_open`, `configurator_open`, `sketch_downloaded`, `sketch_shared`, `inquiry_sent`, `phone_click`, `whatsapp_click`) bez kolačića i bez trećih strana, u **vašu Google tabelu** preko Apps Script skripte [analytics/Code.gs](analytics/Code.gs). Pregled je na skrivenoj stranici **`/analitika`** (zaštićena tokenom): posete i upiti po danu, konverzija, uređaji, top stranice, materijali i izvori prometa, plus tabelarni prikaz.

Postavljanje (5 minuta): nova Google tabela → Proširenja → Apps Script → zalepi `analytics/Code.gs` → Svojstva skripte `TOKEN` (lozinka za čitanje) i opcionalno `KEY` → Implementiraj kao web-aplikaciju (Izvrši kao: ja, Pristup: svi) → URL u `.env` kao `VITE_ANALYTICS_ENDPOINT` (+ `VITE_ANALYTICS_KEY`) → `npm run deploy`. Dok endpoint nije podešen, sajt ne šalje ništa, a `/analitika` prikazuje uputstvo.

## Deploy (GitHub Pages)

```bash
npm run deploy
```

Skripta [scripts/deploy.sh](scripts/deploy.sh) napravi `npm run build:pages` (Vite `base` = `/impala-klesarstvo/`, plus `404.html` kopija za SPA rute i `.nojekyll`) i force-pushuje `dist/` na granu `gh-pages`, koju GitHub Pages servira na **https://gajicmladen.github.io/impala-klesarstvo/**.

Za hosting na vlastitoj domeni koristiti običan `npm run build` (base `/`) i rewrite svih putanja na `index.html`.
