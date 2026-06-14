import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Camera, Church, MapPin, Newspaper, Users } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { CoverArt } from "@/components/news/CoverArt";
import { Button } from "@/components/ui/button";
import logoImg from "@/assets/logo-milosevac.png";

const highlights = [
  {
    title: "Mjesto zajednice",
    text: "Miloševac je posavsko mjesto u kojem se lokalne priče, porodične veze i svakodnevni rad prepliću sa jakim osjećajem pripadnosti.",
    icon: Users,
  },
  {
    title: "Život uz Posavinu",
    text: "Ravnica, poljoprivreda, sport i okupljanja čine prepoznatljiv ritam mjesta i okolnih naselja.",
    icon: MapPin,
  },
  {
    title: "Kultura i tradicija",
    text: "Lokalne manifestacije, KUD, vjerski i društveni događaji čuvaju sjećanje i otvaraju prostor novim generacijama.",
    icon: Church,
  },
];

const gallery = [
  { title: "Pejzaži Posavine", hue: 145, pattern: "waves" as const },
  { title: "Događaji i okupljanja", hue: 22, pattern: "blocks" as const },
  { title: "Arhiva mjesta", hue: 265, pattern: "grid" as const },
];

const timeline = [
  ["Zajednica", "Miloševac se razvijao kao mjesto okupljeno oko porodice, rada i komšijskih veza."],
  ["Sport", "FK Posavina i lokalni sportski događaji važan su dio identiteta mjesta."],
  ["Portal", "Ova stranica čuva vijesti, obavještenja, fotografije i priče iz Miloševca na jednom mjestu."],
];

const AboutMilosevac = () => {
  useEffect(() => {
    document.title = "O Miloševcu - Miloševac";
    const description = "O Miloševcu: istorija, život, ljudi, fotografije i lokalne priče iz Miloševca, Modriča, Republika Srpska.";
    let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }
    meta.content = description;
    window.scrollTo({ top: 0 });
  }, []);

  return (
    <SiteLayout>
      <section className="container-news pt-6">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-stretch">
          <div className="relative overflow-hidden rounded-lg bg-gradient-brand p-6 text-primary-foreground shadow-card sm:p-10">
            <div className="relative max-w-3xl">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white ring-1 ring-white/25">
                <MapPin className="h-4 w-4" /> O mjestu
              </span>
              <h1 className="mt-4 text-4xl font-extrabold leading-none text-white sm:text-5xl">Miloševac</h1>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-primary-foreground/86 sm:text-lg">
                Miloševac je mjesto koje se najbolje razumije kroz ljude, svakodnevni rad, lokalne običaje,
                sport, fotografije i priče koje se prenose iz generacije u generaciju.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
                  <Link to="/kontakt">Pošaljite priču</Link>
                </Button>
                <Button asChild variant="outline" className="border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white">
                  <Link to="/kategorija/milosevac">Vijesti iz mjesta</Link>
                </Button>
              </div>
            </div>
          </div>

          <div className="editorial-panel overflow-hidden">
            <div className="aspect-[4/3] bg-secondary">
              <img src={logoImg} alt="Miloševac" className="h-full w-full object-cover" />
            </div>
            <div className="p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Miloševac, Modriča</p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Stranica je zamišljena kao digitalno mjesto za vijesti, fotografije, obavještenja i zapise o Miloševcu.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="container-news mt-10 grid gap-4 md:grid-cols-3">
        {highlights.map((item) => (
          <article key={item.title} className="editorial-panel p-5">
            <item.icon className="h-6 w-6 text-primary" />
            <h2 className="mt-4 text-lg font-extrabold">{item.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
          </article>
        ))}
      </section>

      <section className="container-news mt-12 grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="editorial-panel p-5 sm:p-7">
          <div className="mb-5 flex items-center gap-2 border-b border-border/70 pb-3">
            <Newspaper className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-extrabold">Priča o Miloševcu</h2>
          </div>
          <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
            <p>
              Miloševac pripada prostoru Posavine, gdje se svakodnevni život gradi oko zemlje, porodice,
              komšiluka i lokalnih okupljanja. Mjesto ima svoj miran ritam, ali i jaku potrebu da važne
              informacije brzo dođu do svih stanovnika.
            </p>
            <p>
              Zato je ovaj portal zamišljen kao savremena digitalna arhiva: mjesto za vijesti, najave,
              fotografije, sportske rezultate, priče o ljudima, kulturi, običajima i svemu što čini
              Miloševac prepoznatljivim.
            </p>
            <p>
              Sadržaj ove stranice se može dopunjavati istorijskim podacima, arhivskim fotografijama,
              kazivanjima mještana i važnim dokumentima, tako da “O Miloševcu” postane trajna i korisna
              prezentacija mjesta.
            </p>
          </div>
        </div>

        <aside className="space-y-4">
          {timeline.map(([title, text]) => (
            <div key={title} className="rounded-lg border border-border/70 bg-card p-4 shadow-card">
              <h3 className="font-extrabold">{title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{text}</p>
            </div>
          ))}
        </aside>
      </section>

      <section className="container-news mt-12">
        <div className="mb-5 flex items-end justify-between border-b border-border/70 pb-3">
          <div>
            <h2 className="text-2xl font-extrabold">Slike i motivi</h2>
            <p className="mt-1 text-sm text-muted-foreground">Prostor za galerije, arhivu i fotografije mjesta.</p>
          </div>
          <Link to="/kategorija/slike" className="action-link">
            Galerije <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {gallery.map((item) => (
            <Link key={item.title} to="/kategorija/slike" className="group relative overflow-hidden rounded-lg border border-border/80 shadow-card">
              <CoverArt hue={item.hue} pattern={item.pattern} className="aspect-[4/3] transition-transform duration-500 group-hover:scale-[1.04]" label={item.title} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                <Camera className="mb-2 h-5 w-5 opacity-80" />
                <h3 className="text-lg font-extrabold text-white">{item.title}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
};

export default AboutMilosevac;
