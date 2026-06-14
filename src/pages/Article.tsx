import { Link, Navigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Calendar, Clock, Facebook, Link2, Share2, User } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { AdSlot } from "@/components/site/AdSlot";
import { CoverArt } from "@/components/news/CoverArt";
import { NewsCard } from "@/components/news/NewsCard";
import { SectionTitle } from "@/components/news/SectionTitle";
import { Button } from "@/components/ui/button";
import { formatDateBs, getCategory, type Article as ArticleType } from "@/data/content";
import { normalizeApiArticle, type ApiArticle, usePortalContent } from "@/hooks/usePortalContent";

const articleAliases: Record<string, string> = {
  "prekid-isporuke-elektricne-energije": "obavjestenje-o-prekidu-isporuke-elektricne-energije-u-dijelu-milosevca",
  "fk-posavina-pobjeda": "fk-posavina-ubjedljiva-pobjeda-na-domacem-terenu",
  "lista-lijekova-fonda-rs": "objavljena-nova-lista-lijekova-fonda-zdravstvenog-osiguranja-rs",
  "kud-milosevac-godisnji-koncert": "kud-milosevac-priprema-godisnji-koncert",
};

function formatArticleDate(iso: string) {
  const d = new Date(iso);
  const months = ["JAN", "FEB", "MAR", "APR", "MAJ", "JUN", "JUL", "AUG", "SEP", "OKT", "NOV", "DEC"];
  return `${String(d.getDate()).padStart(2, "0")}. ${months[d.getMonth()]} ${d.getFullYear()}.`;
}

function articleCategoryLabel(slug?: string, name?: string) {
  if (slug === "milosevac" || slug === "vijesti") return "Lokalne vijesti";
  if (slug === "slike") return "Kultura";
  return name ?? "Vijesti";
}

function renderParagraph(p: string, i: number) {
  if (p.startsWith("## ")) return <h2 key={i}>{p.slice(3)}</h2>;

  if (p.startsWith("- ")) {
    const items = p.split("\n").map((l) => l.replace(/^-\s*/, ""));
    return (
      <ul key={i}>
        {items.map((it, j) => (
          <li key={j}>{it}</li>
        ))}
      </ul>
    );
  }

  if (/^[„"“]/.test(p)) {
    return <blockquote key={i}>{renderInline(p)}</blockquote>;
  }

  return <p key={i}>{renderInline(p)}</p>;
}

function renderInline(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) =>
    part.startsWith("**") ? <strong key={i}>{part.slice(2, -2)}</strong> : part,
  );
}

const Article = () => {
  const { slug = "" } = useParams();
  const canonicalSlug = articleAliases[slug] ?? slug;
  const [fetchedArticle, setFetchedArticle] = useState<ArticleType | null>();
  const [lookupFailed, setLookupFailed] = useState(false);
  const { articles } = usePortalContent(Boolean(fetchedArticle));
  const article = fetchedArticle ?? articles.find((item) => item.slug === canonicalSlug);

  useEffect(() => {
    const controller = new AbortController();
    setFetchedArticle(undefined);
    setLookupFailed(false);

    fetch(`/api/content/${encodeURIComponent(canonicalSlug)}`, {
      headers: { Accept: "application/json" },
      signal: controller.signal,
    })
      .then((response) => {
        if (response.status === 404) return null;
        if (!response.ok) throw new Error("Članak nije dostupan");
        return response.json() as Promise<{ article: ApiArticle }>;
      })
      .then((payload) => setFetchedArticle(payload ? normalizeApiArticle(payload.article) : null))
      .catch((error) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setLookupFailed(true);
      });

    return () => controller.abort();
  }, [canonicalSlug]);

  useEffect(() => {
    window.scrollTo({ top: 0 });
    if (article) {
      document.title = `${article.title} - Miloševac`;
    }
  }, [canonicalSlug, article]);

  if (canonicalSlug !== slug) {
    return <Navigate to={`/clanak/${canonicalSlug}`} replace />;
  }

  if (!article && fetchedArticle === undefined && !lookupFailed) {
    return <SiteLayout><div className="container-news py-16 text-center text-muted-foreground">Učitavam članak...</div></SiteLayout>;
  }

  if (!article && lookupFailed) {
    return <SiteLayout><div className="container-news py-16 text-center text-muted-foreground">Članak trenutno nije moguće učitati. Pokušajte ponovo malo kasnije.</div></SiteLayout>;
  }

  if (!article) return <Navigate to="/404" replace />;

  const cat = getCategory(article.category);
  const related = articles.filter((a) => a.slug !== article.slug && a.category === article.category).slice(0, 3);
  const latest = articles.filter((a) => a.slug !== article.slug).slice(0, 3);

  const ld = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    datePublished: article.date,
    dateModified: article.date,
    author: { "@type": "Person", name: article.author },
    publisher: { "@type": "Organization", name: "Miloševac" },
    description: article.excerpt,
  };

  return (
    <SiteLayout>
      <article className="article-page">
        <header className="container-news article-hero">
          <div className="mx-auto max-w-5xl text-center">
            <div className="article-kicker">
              <Link to={cat ? `/kategorija/${cat.slug}` : "/kategorija/vijesti"}>
                {articleCategoryLabel(cat?.slug, cat?.name)}
              </Link>
              <span aria-hidden>•</span>
              <time dateTime={article.date}>{formatArticleDate(article.date)}</time>
            </div>

            <h1>{article.title}</h1>
            <p className="article-lead">{article.excerpt}</p>
          </div>

          <div className="article-cover-wrap">
            <CoverArt
              hue={article.cover.hue}
              pattern={article.cover.pattern}
              className="article-cover"
              label={article.imageAlt || article.title}
              src={article.image}
              srcSet={article.imageSrcSet}
              sizes="(max-width: 1024px) 100vw, 1100px"
              priority
            />
          </div>
        </header>

        <div className="container-news">
          <div className="article-content">
            <AdSlot variant="inline" lazy className="mb-8" />
            {article.contentHtml ? (
              <div className="article-prose article-prose-clean" dangerouslySetInnerHTML={{ __html: article.contentHtml }} />
            ) : (
              <div className="article-prose article-prose-clean">{article.body.map(renderParagraph)}</div>
            )}
            <AdSlot variant="inline" lazy className="mt-8" />

            <div className="article-meta-panel">
              <span>
                <User className="h-4 w-4" />
                <strong>{article.author}</strong>
              </span>
              <span>
                <Calendar className="h-4 w-4" />
                {formatDateBs(article.date)}
              </span>
              <span>
                <Clock className="h-4 w-4" />
                {article.readingTime} min čitanja
              </span>
            </div>

            {article.tags && article.tags.length > 0 && (
              <div className="article-tags">
                {article.tags.map((tag) => (
                  <Link key={tag} to={`/kategorija/${article.category}?tag=${encodeURIComponent(tag)}`}>
                    #{tag}
                  </Link>
                ))}
              </div>
            )}

            <div className="article-share">
              <span>
                <Share2 className="h-4 w-4" />
                Podijeli članak
              </span>
              <div>
                <Button variant="outline" size="sm" className="gap-1.5">
                  <Facebook className="h-4 w-4" />
                  Facebook
                </Button>
                <Button variant="outline" size="sm" className="gap-1.5">
                  <Link2 className="h-4 w-4" />
                  Kopiraj link
                </Button>
              </div>
            </div>
          </div>
        </div>

        {(related.length > 0 || latest.length > 0) && (
          <section className="container-news article-more">
            <SectionTitle title={related.length > 0 ? "Povezani članci" : "Najnovije iz portala"} />
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {(related.length > 0 ? related : latest).map((a) => (
                <NewsCard key={a.slug} article={a} />
              ))}
            </div>
          </section>
        )}
      </article>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
    </SiteLayout>
  );
};

export default Article;
