# Miloševac — lokalni news portal

Zvanični informativni portal za Miloševac i okolinu: vijesti, obavještenja,
sport (FK Posavina), kultura i informacije za zajednicu.

## Tehnologije

- **React 18** + **TypeScript**
- **Vite** (build i dev server)
- **Tailwind CSS** + Radix UI komponente
- **TanStack Query** za dohvat sadržaja
- **React Router** za rutiranje

Backend (Laravel CMS) se nalazi u `backend/` folderu i služi kao izvor sadržaja
preko `/api` rute. Frontend uz to koristi i ugrađeni snapshot
(`src/data/portal-content.snapshot.json`) kako bi se početna stranica prikazala
trenutno, bez čekanja na mrežu.

## Pokretanje

Produkcijski deployment za Hetzner/Nginx, MySQL transfer, GitHub Actions,
backup i rollback dokumentovani su u [`deploy/README.md`](deploy/README.md).

```bash
npm install
npm run dev      # razvojni server na http://localhost:8080
npm run build    # produkcijski build
npm run start    # preview produkcijskog builda
npm run test     # testovi (Vitest)
npm run lint     # ESLint
```

## Struktura

- `src/pages` — stranice (Naslovna, Članak, Kategorija, FK Posavina, ...)
- `src/components` — UI i komponente portala
- `src/data` — tipovi sadržaja i ugrađeni snapshot
- `src/hooks` — React hookovi (dohvat sadržaja, perzistencija, ...)
- `public` — statički resursi, `robots.txt`, sitemap

## SEO

Meta podaci, Open Graph i Twitter kartice definisani su u `index.html`, a svaka
vijest postavlja vlastiti `title` i strukturirane podatke (JSON-LD `NewsArticle`).
