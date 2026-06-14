// Centralizovani demo podaci za portal Miloševac.
// U produkciji se zamjenjuju WordPress REST API pozivima.

export type Category = {
  slug: string;
  name: string;
  color: string; // tailwind text/bg utility prefix-friendly hsl token
  description: string;
};

export const categories: Category[] = [
  { slug: "vijesti", name: "Vijesti", color: "cat-vijesti", description: "Najnovije vijesti iz Miloševca i okoline." },
  { slug: "milosevac", name: "Miloševac", color: "cat-milosevac", description: "Život, ljudi i događaji u Miloševcu." },
  { slug: "sport", name: "Sport", color: "cat-sport", description: "FK Posavina, lokalna takmičenja i sportske vijesti." },
  { slug: "slike", name: "Slike", color: "cat-kultura", description: "Galerije fotografija iz Miloševca." },
  { slug: "projekti", name: "Projekti", color: "cat-projekti", description: "Lokalni projekti, intervjui i zanimljivosti." },
  { slug: "kontakt", name: "Kontakt", color: "cat-vijesti", description: "Pišite nam." },
];

export type Article = {
  slug: string;
  title: string;
  excerpt: string;
  category: string; // category slug
  author: string;
  date: string; // ISO
  readingTime: number;
  cover: { hue: number; pattern: "waves" | "grid" | "dots" | "diagonal" | "blocks" };
  image?: string | null;
  imageSrcSet?: string | null;
  imageAlt?: string | null;
  urgent?: boolean;
  tags?: string[];
  views?: number;
  body: string[]; // paragraphs (markdown-lite)
  contentHtml?: string;
};

// Demo tagovi po članku — u produkciji dolaze iz WordPress-a
const tagMap: Record<string, { tags: string[]; views: number }> = {
  "prekid-isporuke-elektricne-energije": { tags: ["struja", "obavjestenje", "komunalno"], views: 2840 },
  "pozar-u-milosevcu": { tags: ["vatrogasci", "hitno", "milosevac"], views: 4120 },
  "fk-posavina-pobjeda": { tags: ["fk-posavina", "fudbal", "rezultati"], views: 1980 },
  "lista-lijekova-fonda-rs": { tags: ["zdravstvo", "fond-rs", "lijekovi"], views: 1240 },
  "kud-milosevac-godisnji-koncert": { tags: ["kud", "kultura", "koncert"], views: 890 },
  "putovanja-i-najave": { tags: ["izlet", "najava", "manastir"], views: 540 },
  "recept-domaca-pita": { tags: ["recepti", "tradicija", "kuhinja"], views: 1620 },
  "intervju-mladi-poljoprivrednik": { tags: ["intervjui", "poljoprivreda", "mladi"], views: 760 },
};

export const articles: Article[] = [
  {
    slug: "prekid-isporuke-elektricne-energije",
    title: "Obavještenje o prekidu isporuke električne energije u dijelu Miloševca",
    excerpt:
      "U srijedu od 09:00 do 14:00 časova doći će do planiranog prekida isporuke električne energije u ulicama Posavskih brigada i Vidovdanska, zbog redovnih radova na mreži.",
    category: "vijesti",
    author: "Redakcija",
    date: "2026-04-27T08:30:00Z",
    readingTime: 2,
    cover: { hue: 22, pattern: "diagonal" },
    urgent: true,
    body: [
      "Elektroprivreda obavještava potrošače da će u srijedu, zbog planiranih radova na distributivnoj mreži, doći do privremenog prekida isporuke električne energije u dijelu Miloševca.",
      "## Vrijeme i lokacija",
      "Prekid je predviđen od **09:00 do 14:00 časova**. Bez napajanja će ostati ulice Posavskih brigada, Vidovdanska i dio Karađorđeve ulice.",
      "## Preporuke građanima",
      "Molimo potrošače da na vrijeme isključe osjetljive uređaje. U slučaju da se radovi završe ranije, napajanje će biti vraćeno bez dodatne najave.",
      "Za sve dodatne informacije možete kontaktirati lokalni distributivni centar.",
    ],
  },
  {
    slug: "pozar-u-milosevcu",
    title: "Vatrogasci brzo reagovali na požar u Miloševcu — nema povrijeđenih",
    excerpt:
      "Požar koji je sinoć izbio u pomoćnom objektu u centralnom dijelu Miloševca lokalizovan je za manje od sat vremena, zahvaljujući brzoj reakciji DVD-a.",
    category: "milosevac",
    author: "M. Jovanović",
    date: "2026-04-26T19:45:00Z",
    readingTime: 3,
    cover: { hue: 12, pattern: "blocks" },
    urgent: true,
    body: [
      "Sinoć je u centralnom dijelu Miloševca izbio požar u pomoćnom objektu u dvorištu porodične kuće. Vatrogasna jedinica reagovala je u roku od nekoliko minuta.",
      "Prema riječima komandira intervencije, vatra je lokalizovana za manje od sat vremena. **Nema povrijeđenih osoba**, a materijalna šteta je u procjeni.",
      "## Uzrok požara",
      "Uvid u lice mjesta obavila je policija. Pretpostavlja se da je uzrok kvar na električnoj instalaciji, no zvanični nalaz se očekuje narednih dana.",
      "Mještani su zahvalili dobrovoljnim vatrogascima na brzoj i organizovanoj akciji.",
    ],
  },
  {
    slug: "fk-posavina-pobjeda",
    title: "FK Posavina ubjedljiva pobjeda na domaćem terenu — 3:0",
    excerpt:
      "Fudbaleri FK Posavina ostvarili su važnu pobjedu pred svojom publikom i nastavili niz dobrih rezultata u proljećnom dijelu sezone.",
    category: "sport",
    author: "S. Nikolić",
    date: "2026-04-25T17:00:00",
    readingTime: 4,
    cover: { hue: 145, pattern: "grid" },
    body: [
      "Fudbaleri FK Posavina zabilježili su uvjerljivu pobjedu rezultatom 3:0 u utakmici odigranoj na stadionu u Miloševcu.",
      "## Tok utakmice",
      "Domaćin je poveo već u 12. minuti, da bi do poluvremena povisio na 2:0. Treći gol postignut je iz prekida u finišu susreta.",
      "Trener je istakao odličan pristup igrača i podršku publike koja je u velikom broju ispratila utakmicu.",
      "## Naredni mečevi",
      "Sljedećeg vikenda Posavina gostuje u susjednom mjestu, a navijači najavljuju organizovan odlazak.",
    ],
  },
  {
    slug: "lista-lijekova-fonda-rs",
    title: "Objavljena nova lista lijekova Fonda zdravstvenog osiguranja RS",
    excerpt:
      "Na zvaničnoj listi nalazi se više od 800 preparata, a uvedeno je i nekoliko novih lijekova za hronične bolesti.",
    category: "vijesti",
    author: "Redakcija",
    date: "2026-04-24T11:00:00Z",
    readingTime: 3,
    cover: { hue: 200, pattern: "dots" },
    body: [
      "Fond zdravstvenog osiguranja Republike Srpske objavio je novu listu lijekova koji se izdaju na recept.",
      "Lista obuhvata više od 800 preparata, uključujući i nekoliko novih lijekova za **hronične bolesti**, te lijekove za rijetke bolesti kod djece.",
      "## Šta to znači za pacijente",
      "Pacijenti će lijekove sa liste moći podizati u ugovornim apotekama uz važeći recept. Detaljna lista dostupna je na zvaničnom sajtu Fonda.",
    ],
  },
  {
    slug: "kud-milosevac-godisnji-koncert",
    title: "KUD Miloševac priprema godišnji koncert — najavljeni i gosti iz regije",
    excerpt:
      "Kulturno-umjetničko društvo Miloševac najavljuje tradicionalni godišnji koncert na kojem će se predstaviti sve sekcije ansambla.",
    category: "milosevac",
    author: "A. Petrović",
    date: "2026-04-23T10:00:00Z",
    readingTime: 3,
    cover: { hue: 265, pattern: "waves" },
    body: [
      "KUD Miloševac najavljuje tradicionalni godišnji koncert koji će biti održan u domu kulture sljedeće subote.",
      "Na koncertu će učestvovati dječji, omladinski i izvršni ansambl, kao i gosti iz nekoliko KUD-ova iz regije.",
      "## Program",
      "Program obuhvata igre iz Posavine, Šumadije i Vojvodine, uz pratnju narodnog orkestra. Ulaz je slobodan.",
    ],
  },
  {
    slug: "putovanja-i-najave",
    title: "Najavljen organizovani izlet do manastira Tavna — prijave u toku",
    excerpt:
      "Lokalno udruženje organizuje jednodnevni izlet do manastira Tavna. Polazak je u ranim jutarnjim satima.",
    category: "projekti",
    author: "Redakcija",
    date: "2026-04-22T09:00:00Z",
    readingTime: 2,
    cover: { hue: 200, pattern: "waves" },
    body: [
      "Lokalno udruženje organizuje jednodnevni izlet do manastira Tavna. Polazak je predviđen u ranim jutarnjim satima ispred doma kulture.",
      "Prijave se primaju do petka. U cijenu su uračunati prevoz i ručak.",
    ],
  },
  {
    slug: "recept-domaca-pita",
    title: "Recept iz Posavine: domaća pita sa jabukama kao kod bake",
    excerpt: "Tradicionalni recept koji se generacijama prenosi u Miloševcu — jednostavan, mirisan i uvijek uspješan.",
    category: "projekti",
    author: "M. Stojanović",
    date: "2026-04-21T12:00:00Z",
    readingTime: 5,
    cover: { hue: 30, pattern: "blocks" },
    body: [
      "U rubrici **Recepti** ovog mjeseca donosimo tradicionalnu pitu sa jabukama, koja se generacijama priprema u domaćinstvima Posavine.",
      "## Sastojci",
      "- 500 g brašna\n- 1 kg jabuka\n- 200 g šećera\n- cimet po ukusu\n- ulje, voda i prstohvat soli",
      "## Priprema",
      "Tijesto razvući u tanke kore, premazati uljem i preliti naribanim jabukama pomiješanim sa šećerom i cimetom. Peći oko 35 minuta na 200°C.",
    ],
  },
  {
    slug: "intervju-mladi-poljoprivrednik",
    title: "Intervju: Mladi poljoprivrednik iz Miloševca koji je pokrenuo plastenik",
    excerpt:
      "Razgovor sa mladim mještaninom koji je odlučio da ostane u rodnom mjestu i pokrene proizvodnju povrća u plasteniku.",
    category: "projekti",
    author: "J. Tomić",
    date: "2026-04-20T08:00:00Z",
    readingTime: 6,
    cover: { hue: 145, pattern: "diagonal" },
    body: [
      "U novoj epizodi rubrike **Intervjui** razgovaramo sa mladim poljoprivrednikom iz Miloševca koji je prošle godine pokrenuo plastenik za uzgoj povrća.",
      "„Najteži je bio prvi korak — papirologija i početna investicija. Ali kada se odlučiš ostati, sve drugo dolazi.“",
      "## Planovi za budućnost",
      "Sagovornik najavljuje proširenje proizvodnje i saradnju sa lokalnim restoranima i prodavnicama.",
    ],
  },
];

export type FkPosavinaMatch = {
  id: string;
  status: "played" | "upcoming";
  competition: string;
  date: string;
  venue: string;
  home: string;
  away: string;
  homeScore?: number;
  awayScore?: number;
  note: string;
};

export const fkPosavinaMatches: FkPosavinaMatch[] = [
  {
    id: "m1",
    status: "played",
    competition: "Liga Posavine",
    date: "2026-04-25T17:00:00",
    venue: "Stadion Miloševac",
    home: "FK Posavina",
    away: "Sloga",
    homeScore: 3,
    awayScore: 0,
    note: "Sigurna pobjeda pred domaćom publikom.",
  },
  {
    id: "m2",
    status: "upcoming",
    competition: "Liga Posavine",
    date: "2026-05-30T16:00:00Z",
    venue: "Gostovanje",
    home: "Mladost",
    away: "FK Posavina",
    note: "Naredno kolo, polazak navijača biće naknadno objavljen.",
  },
  {
    id: "m3",
    status: "upcoming",
    competition: "Kup opštine",
    date: "2026-06-06T18:00:00Z",
    venue: "Stadion Miloševac",
    home: "FK Posavina",
    away: "Borac",
    note: "Kup utakmica na domaćem terenu.",
  },
];

export const fkPosavinaGallery = [
  { title: "FK Posavina - sezona u slikama", date: "2026-04-25", hue: 145, pattern: "grid" as const, count: 52 },
  { title: "Navijači na domaćoj utakmici", date: "2026-04-25", hue: 30, pattern: "diagonal" as const, count: 28 },
  { title: "Trening pionira i omladinaca", date: "2026-04-19", hue: 200, pattern: "dots" as const, count: 34 },
  { title: "Stadion Miloševac iz arhive", date: "2026-04-12", hue: 265, pattern: "blocks" as const, count: 18 },
];

export type FkPosavinaGalleryPhoto = {
  id: string;
  src: string;
  fullSrc?: string;
  alt: string;
  caption?: string;
};

export type FkPosavinaGalleryMatch = {
  slug: string;
  title: string;
  date: string;
  venue: string;
  author: string;
  home: string;
  away: string;
  homeScore: number;
  awayScore: number;
  excerpt: string;
  content: string[];
  contentHtml?: string;
  cover: string;
  photosCount?: number;
  score?: string;
  url?: string;
  frontendUrl?: string;
  photos: FkPosavinaGalleryPhoto[];
};

const fkSamplePhotos = [
  "/fk-posavina-gallery-1.svg",
  "/fk-posavina-gallery-2.svg",
  "/fk-posavina-gallery-3.svg",
];

export const fkPosavinaGalleryMatches: FkPosavinaGalleryMatch[] = [
  {
    slug: "fk-posavina-sloga-3-0",
    title: "FK Posavina - Sloga 3:0",
    date: "2026-04-25T17:00:00",
    venue: "Stadion Miloševac",
    author: "Redakcija",
    home: "FK Posavina",
    away: "Sloga",
    homeScore: 3,
    awayScore: 0,
    excerpt:
      "FK Posavina je pred domaćom publikom odigrala sigurnu utakmicu i slavila rezultatom 3:0.",
    content: [
      "FK Posavina je pred domaćom publikom odigrala sigurnu utakmicu i slavila rezultatom 3:0.",
      "Domaći tim je kontrolisao igru i iskoristio prilike za ubjedljivu pobjedu.",
      "U galeriji pogledajte fotografije sa utakmice.",
    ],
    cover: "/fk-posavina-gallery-1.svg",
    photos: Array.from({ length: 126 }, (_, index) => {
      const photoNumber = index + 1;
      return {
        id: `fk-posavina-sloga-${photoNumber}`,
        src: fkSamplePhotos[index % fkSamplePhotos.length],
        alt: `FK Posavina - Sloga fotografija ${photoNumber}`,
      };
    }),
  },
  {
    slug: "navijaci-na-domacoj-utakmici",
    title: "Navijači na domaćoj utakmici",
    date: "2026-04-25T17:00:00",
    venue: "Stadion Miloševac",
    author: "Redakcija",
    home: "FK Posavina",
    away: "Sloga",
    homeScore: 3,
    awayScore: 0,
    excerpt: "Atmosfera sa tribina i podrška domaćem timu tokom utakmice.",
    content: [
      "Domaća publika je pratila Posavinu od prvog minuta i dala dodatnu energiju ekipi.",
      "Pogledajte dio atmosfere sa tribina u foto galeriji.",
    ],
    cover: "/fk-posavina-gallery-2.svg",
    photos: Array.from({ length: 42 }, (_, index) => {
      const photoNumber = index + 1;
      return {
        id: `navijaci-${photoNumber}`,
        src: fkSamplePhotos[(index + 1) % fkSamplePhotos.length],
        alt: `Navijači FK Posavina fotografija ${photoNumber}`,
      };
    }),
  },
  {
    slug: "trening-pionira-i-omladinaca",
    title: "Trening pionira i omladinaca",
    date: "2026-04-19T18:00:00",
    venue: "Stadion Miloševac",
    author: "Redakcija",
    home: "FK Posavina",
    away: "Omladinska selekcija",
    homeScore: 0,
    awayScore: 0,
    excerpt: "Foto priča sa treninga mlađih selekcija FK Posavina.",
    content: [
      "Mlađe selekcije su održale otvoreni trening na stadionu u Miloševcu.",
      "Trening je protekao u dobroj atmosferi uz rad na tehnici i timskoj igri.",
    ],
    cover: "/fk-posavina-gallery-3.svg",
    photos: Array.from({ length: 34 }, (_, index) => {
      const photoNumber = index + 1;
      return {
        id: `trening-${photoNumber}`,
        src: fkSamplePhotos[(index + 2) % fkSamplePhotos.length],
        alt: `Trening FK Posavina fotografija ${photoNumber}`,
      };
    }),
  },
];

export const alerts = [
  {
    id: "a1",
    type: "Hitno",
    title: "Prekid isporuke električne energije — srijeda 09:00–14:00",
    location: "Posavskih brigada, Vidovdanska",
    severity: "high" as const,
    href: "/clanak/obavjestenje-o-prekidu-isporuke-elektricne-energije-u-dijelu-milosevca",
  },
  {
    id: "a2",
    type: "Najava",
    title: "Akcija prikupljanja pomoći za porodicu Marković",
    location: "Dom kulture, subota 10:00",
    severity: "info" as const,
    href: "#",
  },
  {
    id: "a3",
    type: "Komunalno",
    title: "Privremena izmjena režima odvoza smeća tokom praznika",
    location: "Cijelo područje MZ Miloševac",
    severity: "medium" as const,
    href: "#",
  },
];

export const breakingItems: { text: string; slug: string }[] = [
  { text: "⚡ Prekid struje u srijedu 09:00–14:00 u dijelu Miloševca", slug: "obavjestenje-o-prekidu-isporuke-elektricne-energije-u-dijelu-milosevca" },
  { text: "🚒 Vatrogasci lokalizovali sinoćnji požar — nema povrijeđenih", slug: "vatrogasci-brzo-reagovali-na-pozar-u-milosevcu" },
  { text: "⚽ FK Posavina slavila 3:0 pred domaćom publikom", slug: "fk-posavina-ubjedljiva-pobjeda-na-domacem-terenu" },
  { text: "🎭 KUD Miloševac najavljuje godišnji koncert", slug: "kud-milosevac-priprema-godisnji-koncert" },
  { text: "💊 Objavljena nova lista lijekova Fonda RS", slug: "objavljena-nova-lista-lijekova-fonda-zdravstvenog-osiguranja-rs" },
];

export function formatDateBs(iso: string) {
  const d = new Date(iso);
  const months = [
    "januar",
    "februar",
    "mart",
    "april",
    "maj",
    "jun",
    "jul",
    "august",
    "septembar",
    "oktobar",
    "novembar",
    "decembar",
  ];
  return `${String(d.getDate()).padStart(2, "0")}. ${months[d.getMonth()]} ${d.getFullYear()}.`;
}

export function relativeTimeBs(iso: string) {
  const d = new Date(iso).getTime();
  const diff = (Date.now() - d) / 1000;
  if (diff < 3600) return `prije ${Math.max(1, Math.round(diff / 60))} min`;
  if (diff < 86400) return `prije ${Math.round(diff / 3600)} h`;
  const days = Math.round(diff / 86400);
  if (days < 7) return `prije ${days} d`;
  return formatDateBs(iso);
}

export function getCategory(slug: string) {
  return categories.find((c) => c.slug === slug);
}

export function getArticle(slug: string) {
  return articles.find((a) => a.slug === slug);
}

export function getArticlesByCategory(slug: string) {
  return articles.filter((a) => a.category === slug);
}

// Apply tag/views demo data
articles.forEach((a) => {
  const m = tagMap[a.slug];
  if (m) {
    a.tags = m.tags;
    a.views = m.views;
  }
});

// All unique tags across articles
export function getAllTags(): string[] {
  const set = new Set<string>();
  articles.forEach((a) => a.tags?.forEach((t) => set.add(t)));
  return Array.from(set).sort();
}

export function getTagsForCategory(catSlug: string): string[] {
  const set = new Set<string>();
  articles.filter((a) => a.category === catSlug).forEach((a) => a.tags?.forEach((t) => set.add(t)));
  return Array.from(set).sort();
}
