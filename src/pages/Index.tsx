import { Link } from "react-router-dom";
import { ArrowRight, Bell, Clock, Newspaper, Send, Trophy } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { AdSlot } from "@/components/site/AdSlot";
import { NewsCard } from "@/components/news/NewsCard";
import { CoverArt } from "@/components/news/CoverArt";
import { CategoryPill } from "@/components/news/CategoryPill";
import { AlertCard } from "@/components/news/AlertCard";
import { SectionTitle } from "@/components/news/SectionTitle";
import { Button } from "@/components/ui/button";
import { getCategory, formatDateBs } from "@/data/content";
import { usePortalContent } from "@/hooks/usePortalContent";

const quickLinks = [
  ["Vijesti", "/kategorija/vijesti", "Brza lokalna obavještenja"],
  ["Sport", "/kategorija/sport", "FK Posavina i rezultati"],
  ["Vrijeme", "/vrijeme", "Prognoza i stanje u mjestu"],
  ["Kontakt", "/kontakt", "Pošaljite vijest redakciji"],
];

const Index = () => {
  const { articles, loading, error } = usePortalContent();
  const featured = articles[0];
  const sideFeatured = articles.slice(1, 4);
  const latest = articles.slice(3, 9);
  const sportArticles = articles.filter((a) => a.category === "sport");
  const notices = articles.filter((article) => article.urgent).slice(0, 3);

  if (loading) {
    return <SiteLayout><div className="container-news py-16 text-center text-muted-foreground">Učitavam članke...</div></SiteLayout>;
  }

  if (!featured) {
    return (
      <SiteLayout>
        <div className="container-news py-16 text-center text-muted-foreground">
          {error ? "Članke trenutno nije moguće učitati." : "Još nema objavljenih članaka."}
        </div>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <section className="container-news pt-6 sm:pt-8">
        <h1 className="sr-only">Miloševac - lokalne vijesti, obavještenja i zajednica</h1>

        <div className="mb-5 hidden gap-3 lg:grid lg:grid-cols-4">
          {quickLinks.map(([title, href, desc]) => (
            <Link key={href} to={href} className="soft-panel group flex items-center justify-between gap-3 p-4">
              <span>
                <span className="block text-sm font-extrabold group-hover:text-primary">{title}</span>
                <span className="mt-0.5 block text-xs text-muted-foreground">{desc}</span>
              </span>
              <ArrowRight className="h-4 w-4 text-primary transition group-hover:translate-x-0.5" />
            </Link>
          ))}
        </div>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
          <Link
            to={`/clanak/${featured.slug}`}
            className="group relative block min-h-[420px] overflow-hidden rounded-lg border border-border/80 shadow-card hover:shadow-card-hover"
          >
            <CoverArt
              hue={featured.cover.hue}
              pattern={featured.cover.pattern}
              className="absolute inset-0 h-full w-full transition-transform duration-700 group-hover:scale-[1.03]"
              label={featured.title}
              src={featured.image}
              srcSet={featured.imageSrcSet}
              sizes="(max-width: 1024px) 100vw, 900px"
              priority
            />
            <div className="absolute inset-0 bg-gradient-hero" />
            <div className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-7 lg:p-9">
              <div className="mb-4 flex flex-wrap items-center gap-2">
                {featured.urgent && <span className="category-pill bg-urgent text-urgent-foreground">Hitno</span>}
                {getCategory(featured.category) && <CategoryPill category={getCategory(featured.category)!} />}
                <span className="inline-flex items-center gap-1 rounded-sm bg-white/10 px-2 py-1 text-xs font-semibold text-white/85 ring-1 ring-white/15">
                  <Clock className="h-3 w-3" /> {formatDateBs(featured.date)}
                </span>
              </div>
              <h2 className="max-w-4xl text-3xl font-extrabold leading-tight text-white sm:text-4xl lg:text-5xl">
                {featured.title}
              </h2>
              <p className="mt-3 hidden max-w-2xl text-base leading-relaxed text-white/85 sm:block">
                {featured.excerpt}
              </p>
              <span className="mt-5 inline-flex items-center gap-2 rounded-md bg-accent px-3 py-2 text-sm font-bold text-accent-foreground">
                Pročitaj više <ArrowRight className="h-4 w-4" />
              </span>
            </div>
          </Link>

          <aside className="editorial-panel overflow-hidden">
            <div className="flex items-center justify-between border-b border-border/70 px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <Newspaper className="h-4 w-4" />
                </span>
                <h2 className="text-base font-extrabold">U fokusu</h2>
              </div>
              <Link to="/kategorija/vijesti" className="action-link">
                Sve <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="grid gap-0 divide-y divide-border/70">
              {sideFeatured.map((a) => (
                <NewsCard key={a.slug} article={a} variant="horizontal" className="rounded-none border-0 shadow-none hover:translate-y-0" />
              ))}
            </div>
          </aside>
        </div>
      </section>

      <section className="container-news mt-8">
        <AdSlot variant="banner" lazy />
      </section>

      {notices.length > 0 && <section className="container-news mt-10">
        <SectionTitle
          title="Lokalna obavještenja"
          subtitle="Praktične informacije za stanovnike Miloševca"
          accent="urgent"
          action={
            <Link to="/kategorija/vijesti" className="action-link">
              Sve <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          }
        />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {notices.map((article) => (
            <AlertCard
              key={article.slug}
              type="Obavještenje"
              title={article.title}
              severity="high"
              href={`/clanak/${article.slug}`}
            />
          ))}
        </div>
      </section>}

      <section className="container-news mt-12">
        <SectionTitle
          title="Najnovije vijesti"
          action={
            <Link to="/kategorija/vijesti" className="action-link">
              Sve vijesti <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          }
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {latest.map((a) => (
            <NewsCard key={a.slug} article={a} />
          ))}
        </div>
        <AdSlot variant="inline" lazy className="mt-6" />
      </section>

      <section className="mt-14 border-y border-border/70 bg-white/60 py-10">
        <div className="container-news">
          <SectionTitle
            title="FK Posavina"
            subtitle="Rezultati, vijesti i galerije iz kluba"
            action={
              <Link to="/fk-posavina" className="action-link">
                Stranica kluba <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            }
          />
          <div className="grid gap-6 lg:grid-cols-[340px_minmax(0,1fr)]">
            <div className="editorial-panel p-6">
              <span className="category-pill bg-cat-sport text-white">
                <Trophy className="h-3 w-3" /> Posljednja utakmica
              </span>
              <div className="mt-5 flex items-center justify-between">
                <div className="flex-1 text-center">
                  <div className="text-sm font-bold">FK Posavina</div>
                  <div className="mt-1 text-4xl font-extrabold">3</div>
                </div>
                <div className="rounded-md bg-secondary px-3 py-1 text-xs font-bold text-muted-foreground">25.04.</div>
                <div className="flex-1 text-center">
                  <div className="text-sm font-bold">Sloga</div>
                  <div className="mt-1 text-4xl font-extrabold text-muted-foreground">0</div>
                </div>
              </div>
              <p className="mt-4 text-center text-xs text-muted-foreground">Stadion Miloševac · Domaća utakmica</p>
              <div className="mt-5 border-t pt-4">
                <p className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">Naredna utakmica</p>
                <p className="text-sm font-bold">Mladost - FK Posavina</p>
                <p className="text-xs text-muted-foreground">subota, 16:00</p>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {sportArticles.length > 0 && <NewsCard article={sportArticles[0]} className="sm:col-span-2" />}
              {articles.slice(0, 2).map((a) => (
                <NewsCard key={a.slug} article={a} variant="horizontal" />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container-news mt-16">
        <div className="relative overflow-hidden rounded-lg bg-gradient-brand p-6 text-primary-foreground shadow-card sm:p-10">
          <div className="relative grid gap-5 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary-foreground/75">
                <Bell className="h-4 w-4" /> Redakcija
              </span>
              <h2 className="mt-2 text-2xl font-extrabold text-white sm:text-3xl">Imate vijest iz Miloševca?</h2>
              <p className="mt-2 max-w-xl text-primary-foreground/80">
                Najvažnije lokalne informacije objavljujemo brzo, jasno i provjereno.
              </p>
            </div>
            <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
              <Link to="/kontakt">
                <Send className="h-4 w-4" /> Pošaljite vijest
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="container-news mt-16 mb-4">
        <div className="soft-panel p-6 sm:p-8">
          <h2 className="text-xl font-extrabold">O Miloševcu</h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">
            Miloševac je jedno od poznatijih posavskih sela i nalazi se u opštini Modriča,
            u Republici Srpskoj (Bosna i Hercegovina). Na portalu{" "}
            <strong className="text-foreground">milosevac.com</strong> svakodnevno donosimo
            najnovije lokalne vijesti, obavještenja i događaje iz Miloševca i okoline —
            od komunalnih informacija, preko FK Posavina i sporta, do kulture, KUD-a i galerija.
            Cilj nam je da stanovnicima ponudimo brz, tačan i pregledan izvor informacija o
            svemu što se dešava u Miloševcu.
          </p>
          <p className="mt-3">
            <Link to="/omilosevcu" className="action-link">
              Više o Miloševcu <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </p>
        </div>
      </section>
    </SiteLayout>
  );
};

export default Index;
