import { Link } from "react-router-dom";
import { ArrowRight, Clock, Eye } from "lucide-react";
import { CoverArt } from "./CoverArt";
import { CategoryPill } from "./CategoryPill";
import { Article, formatDateBs, relativeTimeBs, getCategory } from "@/data/content";
import { cn } from "@/lib/utils";

interface NewsCardProps {
  article: Article;
  variant?: "default" | "horizontal" | "compact" | "wide";
  className?: string;
}

export function NewsCard({ article, variant = "default", className }: NewsCardProps) {
  const cat = getCategory(article.category);

  if (variant === "horizontal") {
    return (
      <Link
        to={`/clanak/${article.slug}`}
        className={cn("news-card flex gap-3 p-2.5 group", className)}
        aria-label={article.title}
      >
        <CoverArt
          hue={article.cover.hue}
          pattern={article.cover.pattern}
          className="w-24 h-24 sm:w-28 sm:h-28 rounded-md flex-shrink-0 transition-transform duration-300 group-hover:scale-[1.02]"
          label={article.title}
          src={article.image}
          srcSet={article.imageSrcSet}
        />
        <div className="flex min-w-0 flex-col justify-between py-1">
          {cat && <CategoryPill category={cat} size="sm" />}
          <h3 className="mt-1 font-bold text-sm sm:text-base leading-snug line-clamp-3 group-hover:text-primary transition-colors">
            {article.title}
          </h3>
          <span className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" /> {relativeTimeBs(article.date)}
          </span>
        </div>
      </Link>
    );
  }

  if (variant === "compact") {
    return (
      <Link to={`/clanak/${article.slug}`} className={cn("group block", className)}>
          <h3 className="text-sm font-semibold leading-snug line-clamp-2 group-hover:text-primary transition-colors sm:text-base">
          {article.title}
        </h3>
        <span className="text-xs text-muted-foreground mt-1 block">{relativeTimeBs(article.date)}</span>
      </Link>
    );
  }

  if (variant === "wide") {
    return (
      <Link
        to={`/clanak/${article.slug}`}
        className={cn("news-card group grid grid-cols-[40%_1fr] sm:grid-cols-[38%_1fr] overflow-hidden", className)}
        aria-label={article.title}
      >
        <div className="relative overflow-hidden">
          <CoverArt
            hue={article.cover.hue}
            pattern={article.cover.pattern}
            className="h-full w-full min-h-[160px] sm:min-h-[210px] transition-transform duration-500 group-hover:scale-[1.04]"
            label={article.title}
            src={article.image}
            srcSet={article.imageSrcSet}
          />
          {article.urgent && (
            <span className="absolute left-3 top-3 category-pill bg-urgent text-urgent-foreground shadow-sm">
              Hitno
            </span>
          )}
        </div>
        <div className="flex min-w-0 flex-col gap-2 p-4 sm:p-5">
          <div className="flex items-center gap-2">{cat && <CategoryPill category={cat} />}</div>
          <h3 className="text-base font-bold leading-snug line-clamp-3 group-hover:text-primary transition-colors text-balance sm:text-xl">
            {article.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2 sm:line-clamp-3">{article.excerpt}</p>
          <div className="mt-auto flex items-center justify-between gap-3 border-t border-border/70 pt-3 text-xs text-muted-foreground">
            <span className="line-clamp-1">{formatDateBs(article.date)}</span>
            <span className="flex shrink-0 items-center gap-3">
              {article.views && (
                <span className="flex items-center gap-1">
                  <Eye className="h-3 w-3" /> {article.views.toLocaleString("bs-BA")}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" /> {article.readingTime} min
              </span>
            </span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      to={`/clanak/${article.slug}`}
      className={cn("news-card group flex flex-col h-full", className)}
      aria-label={article.title}
    >
      <div className="relative overflow-hidden">
        <CoverArt
          hue={article.cover.hue}
          pattern={article.cover.pattern}
          className="aspect-[16/10] w-full transition-transform duration-500 group-hover:scale-[1.04]"
          label={article.title}
          src={article.image}
          srcSet={article.imageSrcSet}
        />
        <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-2 p-3">
          {cat && <CategoryPill category={cat} />}
          {article.urgent && (
            <span className="category-pill bg-urgent text-urgent-foreground shadow-sm">Hitno</span>
          )}
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="text-base font-bold leading-snug line-clamp-3 group-hover:text-primary transition-colors text-balance sm:text-lg">
          {article.title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2">{article.excerpt}</p>
        <div className="mt-auto flex items-center justify-between gap-3 border-t border-border/70 pt-3 text-xs text-muted-foreground">
          <span className="line-clamp-1">{formatDateBs(article.date)}</span>
          <span className="flex shrink-0 items-center gap-3">
            {article.views && (
              <span className="hidden items-center gap-1 sm:flex">
                <Eye className="h-3 w-3" /> {article.views.toLocaleString("bs-BA")}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" /> {article.readingTime} min
            </span>
            <ArrowRight className="h-3.5 w-3.5 text-primary opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100" />
          </span>
        </div>
      </div>
    </Link>
  );
}
