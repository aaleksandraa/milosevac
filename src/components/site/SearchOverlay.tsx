import { Search, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { NewsCard } from "@/components/news/NewsCard";
import { usePortalContent } from "@/hooks/usePortalContent";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

export function SearchOverlay({ open, onOpenChange }: Props) {
  const { articles } = usePortalContent({ enabled: open, limit: 100 });
  const [q, setQ] = useState("");

  useEffect(() => {
    if (!open) setQ("");
  }, [open]);

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return [];
    return articles
      .filter((a) => [a.title, a.excerpt, a.category, a.author].join(" ").toLowerCase().includes(term))
      .slice(0, 6);
  }, [articles, q]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[90] bg-black/45 p-3 pt-[10vh]" role="dialog" aria-modal="true" aria-label="Pretraga vijesti">
      <button className="absolute inset-0 cursor-default" onClick={() => onOpenChange(false)} aria-label="Zatvori pretragu" />
      <div className="relative mx-auto max-w-2xl overflow-hidden rounded-lg border bg-background shadow-2xl">
        <div className="flex items-center gap-2 border-b px-4 py-3">
          <Search className="h-5 w-5 text-muted-foreground" />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Pretraži vijesti, kategorije, autore..."
            className="flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground"
          />
          <button
            onClick={() => onOpenChange(false)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-secondary"
            aria-label="Zatvori"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="max-h-[60vh] overflow-y-auto bg-background/70 p-4">
          {q.trim() === "" ? (
            <p className="py-8 text-center text-sm text-muted-foreground">Počnite kucati da vidite rezultate.</p>
          ) : results.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">Nema rezultata za "{q}".</p>
          ) : (
            <div className="grid gap-3">
              {results.map((a) => (
                <NewsCard key={a.slug} article={a} variant="horizontal" />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
