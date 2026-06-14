import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { SiteLayout } from "@/components/site/SiteLayout";
import { AdSlot } from "@/components/site/AdSlot";
import { fkPosavinaGalleryMatches, type FkPosavinaGalleryMatch } from "@/data/content";

const INITIAL_GALLERY_LIMIT = 60;
const GALLERY_BATCH_SIZE = 60;

function formatDateTime(iso?: string) {
  if (!iso) {
    return "";
  }

  const date = new Date(iso);
  return `${String(date.getDate()).padStart(2, "0")}.${String(date.getMonth() + 1).padStart(2, "0")}.${date.getFullYear()}. ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}

const FkMatch = () => {
  const { slug } = useParams();
  const fallbackMatch = useMemo(
    () => fkPosavinaGalleryMatches.find((item) => item.slug === slug) ?? fkPosavinaGalleryMatches[0],
    [slug],
  );
  const [match, setMatch] = useState<FkPosavinaGalleryMatch>(fallbackMatch);
  const [visibleCount, setVisibleCount] = useState(INITIAL_GALLERY_LIMIT);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    setMatch(fallbackMatch);

    if (!slug) {
      return;
    }

    fetch(`/api/fk-posavina/matches/${slug}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Utakmica nije dostupna u API-ju");
        }

        return response.json();
      })
      .then((data) => {
        if (data.match) {
          setMatch({
            ...data.match,
            content: data.match.content ?? [],
            photos: data.match.photos ?? [],
          });
        }
      })
      .catch(() => {
        setMatch(fallbackMatch);
      });
  }, [fallbackMatch, slug]);

  useEffect(() => {
    document.title = `${match.title} - FK Posavina`;
    window.scrollTo({ top: 0 });
    setVisibleCount(INITIAL_GALLERY_LIMIT);
  }, [match.slug, match.title]);

  useEffect(() => {
    document.body.classList.toggle("has-image-lightbox", lightboxIndex !== null);
    return () => document.body.classList.remove("has-image-lightbox");
  }, [lightboxIndex]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setLightboxIndex(null);
      }

      if (event.key === "ArrowLeft") {
        showPreviousLightboxImage();
      }

      if (event.key === "ArrowRight") {
        showNextLightboxImage();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [match.photos.length]);

  const visiblePhotos = match.photos.slice(0, visibleCount);
  const hasMorePhotos = visibleCount < match.photos.length;
  const activePhoto = lightboxIndex !== null ? match.photos[lightboxIndex] : null;

  const showPreviousLightboxImage = () => {
    setLightboxIndex((current) => {
      if (current === null || match.photos.length === 0) {
        return current;
      }

      return (current - 1 + match.photos.length) % match.photos.length;
    });
  };

  const showNextLightboxImage = () => {
    setLightboxIndex((current) => {
      if (current === null || match.photos.length === 0) {
        return current;
      }

      return (current + 1) % match.photos.length;
    });
  };

  const handleLightboxTouchEnd = (clientX: number) => {
    if (touchStartX.current === null) {
      return;
    }

    const deltaX = touchStartX.current - clientX;
    touchStartX.current = null;

    if (Math.abs(deltaX) < 40) {
      return;
    }

    if (deltaX > 0) {
      showNextLightboxImage();
    } else {
      showPreviousLightboxImage();
    }
  };

  return (
    <SiteLayout>
      <section className="match-page">
        <div className="container-news match-layout">
          <article className="match-article">
            <nav className="archive-breadcrumb" aria-label="Breadcrumb">
              <Link to="/">Naslovna</Link>
              <span>/</span>
              <Link to="/fk-posavina">FK Posavina</Link>
            </nav>
            <span className="archive-kicker">Utakmica</span>
            <h1>{match.title}</h1>

            <div className="match-scoreline">
              <strong>{match.home}</strong>
              <b>{match.score || `${match.homeScore}:${match.awayScore}`}</b>
              <strong>{match.away}</strong>
            </div>

            <div className="meta">
              <span>{match.author}</span>
              <span>{formatDateTime(match.date)}</span>
              <span>{match.venue}</span>
            </div>

            <figure className="match-cover">
              {match.cover ? <img src={match.cover} alt={match.title} loading="eager" decoding="async" /> : null}
              <span className="photo-watermark photo-watermark-large">Miloševac</span>
            </figure>

            <p className="excerpt">{match.excerpt}</p>

            {match.contentHtml ? (
              <div className="article-content" dangerouslySetInnerHTML={{ __html: match.contentHtml }} />
            ) : (
              <div className="article-content">
                {match.content.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            )}

            <section className="section">
              <AdSlot variant="inline" lazy className="mb-6" />
              <div className="section-heading sport-heading">
                <div>
                  <span />
                  <h2>Galerija utakmice</h2>
                  <p>{match.photosCount ?? match.photos.length} fotografija</p>
                </div>
              </div>

              <div className="match-gallery">
                {visiblePhotos.map((photo, index) => (
                  <figure key={photo.id}>
                    <button
                      className="match-gallery-trigger"
                      type="button"
                      onClick={() => setLightboxIndex(index)}
                      aria-label="Otvori sliku preko cijelog ekrana"
                    >
                      <img src={photo.src} alt={photo.alt} loading="lazy" decoding="async" />
                      <span className="photo-watermark">Miloševac</span>
                    </button>
                    {photo.caption ? <figcaption>{photo.caption}</figcaption> : null}
                  </figure>
                ))}
              </div>

              {hasMorePhotos ? (
                <div className="gallery-load-more">
                  <button
                    className="btn secondary"
                    type="button"
                    onClick={() => setVisibleCount((current) => Math.min(current + GALLERY_BATCH_SIZE, match.photos.length))}
                  >
                    Prikaži još fotografija
                  </button>
                </div>
              ) : null}
            </section>
          </article>
        </div>
      </section>

      {activePhoto ? (
        <div
          className="image-lightbox"
          onClick={() => setLightboxIndex(null)}
          onTouchStart={(event) => {
            touchStartX.current = event.changedTouches[0]?.clientX ?? null;
          }}
          onTouchEnd={(event) => handleLightboxTouchEnd(event.changedTouches[0]?.clientX ?? 0)}
          role="dialog"
          aria-modal="true"
        >
          <button className="image-lightbox-close" type="button" onClick={() => setLightboxIndex(null)} aria-label="Zatvori prikaz">
            ×
          </button>
          <button
            className="image-lightbox-nav image-lightbox-prev"
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              showPreviousLightboxImage();
            }}
            aria-label="Prethodna slika"
          >
            ‹
          </button>
          <button
            className="image-lightbox-nav image-lightbox-next"
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              showNextLightboxImage();
            }}
            aria-label="Sljedeća slika"
          >
            ›
          </button>
          <figure className="image-lightbox-frame" onClick={(event) => event.stopPropagation()}>
            <img src={activePhoto.fullSrc || activePhoto.src} alt={activePhoto.caption || activePhoto.alt} />
          </figure>
        </div>
      ) : null}
    </SiteLayout>
  );
};

export default FkMatch;
