import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { SiteLayout } from "@/components/site/SiteLayout";
import { AdSlot } from "@/components/site/AdSlot";
import { NewsCard } from "@/components/news/NewsCard";
import { fkPosavinaGalleryMatches, type FkPosavinaGalleryMatch } from "@/data/content";
import { usePortalContent } from "@/hooks/usePortalContent";

function formatDate(iso?: string) {
  if (!iso) {
    return "";
  }

  const date = new Date(iso);
  return `${String(date.getDate()).padStart(2, "0")}.${String(date.getMonth() + 1).padStart(2, "0")}.${date.getFullYear()}.`;
}

const FkPosavina = () => {
  const { articles } = usePortalContent({ category: "sport", limit: 60 });
  const sportArticles = articles.filter((a) => a.category === "sport" || a.tags?.includes("fk-posavina"));
  const [matches, setMatches] = useState<FkPosavinaGalleryMatch[]>(fkPosavinaGalleryMatches);
  const featuredMatch = matches[0] || fkPosavinaGalleryMatches[0];

  useEffect(() => {
    document.title = "FK Posavina - Miloševac";
    window.scrollTo({ top: 0 });

    if (window.location.hash) {
      const target = document.querySelector(window.location.hash);
      setTimeout(() => target?.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
    }

    fetch("/api/fk-posavina")
      .then((response) => {
        if (!response.ok) {
          throw new Error("FK Posavina API nije dostupan");
        }

        return response.json();
      })
      .then((data) => {
        const liveMatches = data.galleryMatches?.length ? data.galleryMatches : data.matches;
        if (liveMatches?.length) {
          setMatches(liveMatches);
        }
      })
      .catch(() => {
        setMatches(fkPosavinaGalleryMatches);
      });
  }, []);

  return (
    <SiteLayout>
      <section className="club-page">
        <div className="container-news club-hero">
          <div>
            <nav className="archive-breadcrumb" aria-label="Breadcrumb">
              <Link to="/">Naslovna</Link>
              <span>/</span>
              <span>FK Posavina</span>
            </nav>
            <span className="archive-kicker">Klub</span>
            <h1>FK Posavina</h1>
            <p>Rezultati, tabela, vijesti i foto galerije utakmica kluba iz Miloševca.</p>
            <div className="club-actions">
              <a className="btn cta-btn" href="#rezultati">Rezultati i tabela</a>
              <a className="btn secondary" href="#galerije">Foto galerije</a>
            </div>
          </div>

          <aside className="club-score-panel club-last-match" aria-label="Zadnja utakmica FK Posavina">
            <div className="club-last-match-head">
              <span>Zadnja utakmica</span>
              <small>{formatDate(featuredMatch.date)}</small>
            </div>
            <div className="club-last-score">
              <strong>{featuredMatch.home}</strong>
              <b>{featuredMatch.homeScore}:{featuredMatch.awayScore}</b>
              <strong>{featuredMatch.away}</strong>
            </div>
            <p>{featuredMatch.excerpt}</p>
            <Link to={`/fk-posavina/utakmica/${featuredMatch.slug}`}>Otvori izvještaj</Link>
          </aside>
        </div>

        <div className="container-news club-layout">
          <div className="club-main-column">
            <section id="rezultati" className="club-section club-embed-card">
              <div className="section-heading sport-heading">
                <div>
                  <span />
                  <h2>Rezultati i utakmice</h2>
                  <p>Rezultati i raspored utakmica FK Posavina</p>
                </div>
              </div>
              <div className="sportdc-frame-wrap sportdc-frame-wrap--results">
                <iframe
                  src="https://sportdc.net/embed/results/5919"
                  title="FK Posavina rezultati i raspored - SportDC"
                  frameBorder="0"
                  scrolling="no"
                  width="100%"
                  height="270"
                  loading="lazy"
                  referrerPolicy="strict-origin-when-cross-origin"
                  style={{ height: 270 }}
                />
              </div>

              <h3 className="club-embed-subtitle">Tabela</h3>
              <div className="sportdc-frame-wrap sportdc-frame-wrap--standings">
                <iframe
                  src="https://sportdc.net/embed/standings/5919"
                  title="FK Posavina tabela - SportDC"
                  frameBorder="0"
                  scrolling="no"
                  width="100%"
                  height="414"
                  loading="lazy"
                  referrerPolicy="strict-origin-when-cross-origin"
                  style={{ height: 414 }}
                />
                <span className="sportdc-frame-mask sportdc-frame-mask--app" aria-hidden="true" />
                <span className="sportdc-frame-mask sportdc-frame-mask--footer" aria-hidden="true" />
              </div>

              <p className="club-source">Izvor takmičarskih podataka: SportDC.</p>
            </section>

            <AdSlot variant="inline" lazy />
          </div>

          <aside className="club-sidebar">
            <AdSlot variant="sidebar" lazy />
          </aside>
        </div>

        <section id="galerije" className="container-news club-section club-full-section">
          <div className="section-heading">
            <div>
              <span />
              <h2>Foto galerije utakmica</h2>
              <p>Fotografije i izvještaji sa utakmica FK Posavina</p>
            </div>
            <Link to="/kategorija/sport">Sve sportske vijesti</Link>
          </div>

          <AdSlot variant="banner" lazy className="mb-5" />

          <div className="match-card-grid">
            {matches.map((match) => (
              <Link className="match-card" key={match.slug} to={`/fk-posavina/utakmica/${match.slug}`}>
                <div className="match-card-cover">
                  {match.cover ? <img src={match.cover} alt={match.title} loading="lazy" /> : <span>{match.home} - {match.away}</span>}
                  <span className="photo-watermark">Miloševac</span>
                </div>
                <div>
                  <small>{formatDate(match.date)} · {match.photosCount ?? match.photos?.length ?? 0} slika</small>
                  <strong>{match.title}</strong>
                  <span>{match.home} {match.score || `${match.homeScore}:${match.awayScore}`} {match.away}</span>
                </div>
              </Link>
            ))}
          </div>

          <div className="section-heading match-reports-heading">
            <div>
              <span />
              <h2>Sportske vijesti</h2>
            </div>
          </div>
          <div className="club-post-grid">
            {sportArticles.map((article) => (
              <NewsCard key={article.slug} article={article} />
            ))}
          </div>
        </section>
      </section>
    </SiteLayout>
  );
};

export default FkPosavina;
