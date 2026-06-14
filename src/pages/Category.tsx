import { useEffect, useMemo, useState } from "react";
import { Link, Navigate, useParams, useSearchParams } from "react-router-dom";
import {
  CalendarDays,
  Camera,
  ChevronDown,
  ChevronRight,
  Clock,
  Eye,
  Shield,
  SlidersHorizontal,
  Tag as TagIcon,
  TrendingUp,
  X,
} from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { NewsCard } from "@/components/news/NewsCard";
import { Button } from "@/components/ui/button";
import { getCategory } from "@/data/content";
import { usePersistentState } from "@/hooks/usePersistentState";
import { usePortalContent } from "@/hooks/usePortalContent";
import { cn } from "@/lib/utils";

type SortKey = "new" | "old" | "popular" | "reading";

const sortOptions: { key: SortKey; label: string }[] = [
  { key: "new", label: "Najnovije" },
  { key: "old", label: "Najstarije" },
  { key: "popular", label: "Popularno" },
  { key: "reading", label: "Najduže čitanje" },
];

const Category = () => {
  const { slug = "" } = useParams();
  const isAllNews = slug === "vijesti";
  const { articles } = usePortalContent({ category: isAllNews ? undefined : slug, limit: isAllNews ? 1000 : 100 });
  const [searchParams] = useSearchParams();
  const cat = getCategory(slug);
  const pageArticles = useMemo(
    () => articles.filter((article) => isAllNews || article.category === slug),
    [articles, isAllNews, slug],
  );

  const [sort, setSort] = usePersistentState<SortKey>(`cat:${slug}:sort`, "new");
  const [activeTags, setActiveTags] = usePersistentState<string[]>(`cat:${slug}:tags`, []);
  const [shown, setShown] = useState(8);

  useEffect(() => {
    const urlTag = searchParams.get("tag");
    if (urlTag) {
      setActiveTags([urlTag]);
    } else {
      setActiveTags([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  useEffect(() => {
    window.scrollTo({ top: 0 });
    setShown(8);
    if (cat) document.title = `${cat.name} - Miloševac`;
  }, [slug, cat]);

  const tags = useMemo(() => Array.from(new Set(
    pageArticles.flatMap((article) => article.tags ?? []),
  )).sort(), [pageArticles]);

  const list = useMemo(() => {
    let arr = pageArticles;
    if (activeTags.length > 0) {
      arr = arr.filter((a) => a.tags?.some((t) => activeTags.includes(t)));
    }
    const sorted = [...arr];
    switch (sort) {
      case "new":
        sorted.sort((a, b) => +new Date(b.date) - +new Date(a.date));
        break;
      case "old":
        sorted.sort((a, b) => +new Date(a.date) - +new Date(b.date));
        break;
      case "popular":
        sorted.sort((a, b) => (b.views ?? 0) - (a.views ?? 0));
        break;
      case "reading":
        sorted.sort((a, b) => b.readingTime - a.readingTime);
        break;
    }
    return sorted;
  }, [pageArticles, sort, activeTags]);

  if (!cat) return <Navigate to="/404" replace />;

  const visible = list.slice(0, shown);
  const allCategoryArticles = pageArticles;
  const popular = [...allCategoryArticles].sort((a, b) => (b.views ?? 0) - (a.views ?? 0)).slice(0, 5);

  const toggleTag = (t: string) => {
    setActiveTags(activeTags.includes(t) ? activeTags.filter((x) => x !== t) : [...activeTags, t]);
    setShown(8);
  };

  const clearFilters = () => {
    setActiveTags([]);
    setSort("new");
    setShown(8);
  };

  const hasFilters = activeTags.length > 0 || sort !== "new";

  return (
    <SiteLayout>
      <nav aria-label="Breadcrumb" className="container-news pt-5 text-sm text-muted-foreground">
        <ol className="flex flex-wrap items-center gap-1">
          <li>
            <Link to="/" className="hover:text-primary">
              Naslovna
            </Link>
          </li>
          <ChevronRight className="h-3.5 w-3.5" />
          <li className="text-foreground">{cat.name}</li>
        </ol>
      </nav>

      <header className="container-news mt-4">
        <div className="flex flex-wrap items-end justify-between gap-3 border-b border-border/70 pb-4">
          <div>
            <h1 className="text-2xl font-extrabold leading-tight sm:text-3xl">{cat.name}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{cat.description}</p>
          </div>
          <div className="rounded-md border border-border/70 bg-card px-3 py-2 text-sm font-bold text-muted-foreground shadow-sm">
            {allCategoryArticles.length} {allCategoryArticles.length === 1 ? "članak" : "članaka"}
          </div>
        </div>

        {slug === "sport" && (
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <Link to="/fk-posavina" className="soft-panel group flex items-center gap-3 p-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-md bg-cat-sport/10 text-cat-sport">
                <Shield className="h-5 w-5" />
              </span>
              <span>
                <span className="block text-sm font-extrabold group-hover:text-primary">FK Posavina</span>
                <span className="block text-xs text-muted-foreground">Klupska stranica</span>
              </span>
            </Link>
            <Link to="/fk-posavina#utakmice" className="soft-panel group flex items-center gap-3 p-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-md bg-accent/10 text-accent">
                <CalendarDays className="h-5 w-5" />
              </span>
              <span>
                <span className="block text-sm font-extrabold group-hover:text-primary">Utakmice</span>
                <span className="block text-xs text-muted-foreground">Raspored i rezultati</span>
              </span>
            </Link>
            <Link to="/fk-posavina#galerija" className="soft-panel group flex items-center gap-3 p-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                <Camera className="h-5 w-5" />
              </span>
              <span>
                <span className="block text-sm font-extrabold group-hover:text-primary">Galerija</span>
                <span className="block text-xs text-muted-foreground">Slike sa terena</span>
              </span>
            </Link>
          </div>
        )}
      </header>

      <section className="container-news mt-5 grid gap-7 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="min-w-0">
          <div className="soft-panel sticky top-[116px] z-20 overflow-hidden">
            <details className="filter-details group [&[open]>summary>svg.chev]:rotate-180">
              <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 select-none hover:bg-secondary/70 lg:hidden [&::-webkit-details-marker]:hidden">
                <span className="inline-flex items-center gap-2 text-sm font-semibold">
                  <SlidersHorizontal className="h-4 w-4 text-primary" />
                  Sortiraj
                  <span className="text-xs font-normal text-muted-foreground">
                    · {sortOptions.find((o) => o.key === sort)?.label}
                  </span>
                </span>
                <ChevronDown className="chev h-4 w-4 text-muted-foreground transition-transform" />
              </summary>
              <div className="px-4 pb-4 pt-2 lg:p-4">
                <div className="hidden items-center gap-3 lg:flex">
                  <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    <SlidersHorizontal className="h-4 w-4 text-primary" />
                    Sortiraj
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {sortOptions.map((opt) => (
                      <button
                        key={opt.key}
                        onClick={() => setSort(opt.key)}
                        className={cn(
                          "rounded-md border px-3 py-1.5 text-xs font-bold transition",
                          sort === opt.key
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border bg-background text-muted-foreground hover:border-primary hover:text-primary",
                        )}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                  {hasFilters && (
                    <button
                      onClick={clearFilters}
                      className="ml-auto inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
                    >
                      <X className="h-3 w-3" /> Resetuj
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap gap-1.5 lg:hidden">
                  {sortOptions.map((opt) => (
                    <button
                      key={opt.key}
                      onClick={() => setSort(opt.key)}
                      className={cn(
                        "rounded-md border px-3 py-1.5 text-xs font-bold transition",
                        sort === opt.key
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-background text-muted-foreground hover:border-primary hover:text-primary",
                      )}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </details>

            {tags.length > 0 && (
              <details className="filter-details group border-t border-border/70 [&[open]>summary>svg.chev]:rotate-180">
                <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 select-none hover:bg-secondary/70 lg:hidden [&::-webkit-details-marker]:hidden">
                  <span className="inline-flex items-center gap-2 text-sm font-semibold">
                    <TagIcon className="h-4 w-4 text-accent" />
                    Tagovi
                    {activeTags.length > 0 && (
                      <span className="inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-accent-foreground">
                        {activeTags.length}
                      </span>
                    )}
                  </span>
                  <ChevronDown className="chev h-4 w-4 text-muted-foreground transition-transform" />
                </summary>
                <div className="px-4 pb-4 pt-2 lg:border-t lg:border-border/70 lg:p-4">
                  <div className="mb-3 hidden items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground lg:flex">
                    <TagIcon className="h-4 w-4 text-accent" />
                    Teme
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {tags.map((t) => {
                      const active = activeTags.includes(t);
                      return (
                        <button
                          key={t}
                          onClick={() => toggleTag(t)}
                          className={cn(
                            "rounded-sm border px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide transition",
                            active
                              ? "border-accent bg-accent text-accent-foreground"
                              : "border-border bg-background text-muted-foreground hover:border-accent hover:text-accent",
                          )}
                        >
                          #{t}
                        </button>
                      );
                    })}
                    {hasFilters && (
                      <button
                        onClick={clearFilters}
                        className="inline-flex items-center gap-1 rounded-sm border border-primary/20 bg-primary/5 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-primary lg:hidden"
                      >
                        <X className="h-3 w-3" /> Reset
                      </button>
                    )}
                  </div>
                </div>
              </details>
            )}
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-muted-foreground">
                Prikazano <span className="text-foreground">{visible.length}</span> od {list.length}
              </p>
              {hasFilters && (
                <p className="mt-1 text-xs text-muted-foreground">Aktivni filteri se pamte za sljedeću posjetu.</p>
              )}
            </div>
          </div>

          {list.length === 0 ? (
            <div className="editorial-panel mt-5 py-16 text-center">
              <p className="font-semibold text-foreground">Nema članaka koji odgovaraju filterima.</p>
              <p className="mt-1 text-sm text-muted-foreground">Uklonite filtere ili izaberite drugu temu.</p>
              {hasFilters && (
                <Button variant="outline" className="mt-5" onClick={clearFilters}>
                  Ukloni filtere
                </Button>
              )}
            </div>
          ) : (
            <>
              <div className="mt-5 grid gap-5 sm:grid-cols-2 xl:grid-cols-1">
                {visible.map((a) => (
                  <NewsCard key={a.slug} article={a} variant="wide" className="hidden xl:grid" />
                ))}
                {visible.map((a) => (
                  <NewsCard key={`m-${a.slug}`} article={a} className="xl:hidden" />
                ))}
              </div>
              {shown < list.length && (
                <div className="mt-8 text-center">
                  <Button variant="outline" size="lg" onClick={() => setShown((s) => s + 8)}>
                    Učitaj još
                  </Button>
                </div>
              )}
            </>
          )}
        </div>

        <aside className="space-y-5 lg:sticky lg:top-[116px] lg:self-start">
          <div className="editorial-panel p-5">
            <div className="mb-4 flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 text-primary">
                <TrendingUp className="h-4 w-4" />
              </span>
              <div>
                <h2 className="text-base font-extrabold">Najčitanije</h2>
                <p className="text-xs text-muted-foreground">Iz kategorije {cat.name}</p>
              </div>
            </div>
            <div className="divide-y divide-border/70">
              {popular.map((a, index) => (
                <Link
                  key={a.slug}
                  to={`/clanak/${a.slug}`}
                  className="group flex gap-3 py-3 first:pt-0 last:pb-0"
                >
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-secondary text-xs font-extrabold text-primary">
                    {index + 1}
                  </span>
                  <span className="min-w-0">
                    <span className="line-clamp-2 text-sm font-bold leading-snug group-hover:text-primary">
                      {a.title}
                    </span>
                    <span className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                      {a.views && (
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" /> {a.views.toLocaleString("bs-BA")}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {a.readingTime} min
                      </span>
                    </span>
                  </span>
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-primary/15 bg-primary/5 p-5">
            <h2 className="text-base font-extrabold">Pošaljite informaciju</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Imate novu vijest, fotografiju ili najavu događaja iz Miloševca?
            </p>
            <Button asChild className="mt-4 w-full">
              <Link to="/kontakt">Kontakt redakcije</Link>
            </Button>
          </div>
        </aside>
      </section>
    </SiteLayout>
  );
};

export default Category;
