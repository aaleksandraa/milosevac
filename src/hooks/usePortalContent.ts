import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { type Article } from "@/data/content";
import portalSnapshot from "@/data/portal-content.snapshot.json";

export type ApiArticle = Omit<Article, "cover"> & {
  cover?: Article["cover"];
};

type PortalContentOptions = {
  enabled?: boolean;
  limit?: number;
  category?: string;
};

const storagePrefix = "portal-content-v1:";

function readCachedContent(key: string): Article[] | undefined {
  try {
    const cached = localStorage.getItem(storagePrefix + key);
    return cached ? JSON.parse(cached) as Article[] : undefined;
  } catch {
    return undefined;
  }
}

function cacheContent(key: string, articles: Article[]) {
  try {
    localStorage.setItem(storagePrefix + key, JSON.stringify(articles));
  } catch {
    // Network data remains available when browser storage is disabled.
  }
}

function coverFor(slug: string, index: number): Article["cover"] {
  const hue = Array.from(slug).reduce((sum, character) => sum + character.charCodeAt(0), 0) % 360;
  const patterns: Article["cover"]["pattern"][] = ["waves", "grid", "dots", "diagonal", "blocks"];
  return { hue, pattern: patterns[index % patterns.length] };
}

export function normalizeApiArticle(article: ApiArticle, index = 0): Article {
  return {
    ...article,
    body: article.body ?? [],
    cover: article.cover ?? coverFor(article.slug, index),
  };
}

async function fetchPortalContent(limit: number, category?: string): Promise<Article[]> {
  const params = new URLSearchParams({ limit: String(limit) });
  if (category) params.set("category", category);

  const response = await fetch(`/api/content?${params}`, {
    headers: { Accept: "application/json" },
  });
  if (!response.ok) throw new Error("Portal content API nije dostupan");

  const payload = await response.json() as { articles?: ApiArticle[] };
  return (payload.articles ?? []).map(normalizeApiArticle);
}

export function usePortalContent(options: boolean | PortalContentOptions = {}) {
  const normalized = typeof options === "boolean" ? { enabled: options } : options;
  const enabled = normalized.enabled ?? true;
  const limit = normalized.limit ?? 40;
  const category = normalized.category;
  const cacheKey = `${limit}:${category ?? ""}`;
  const bundledArticles = !category
    ? ((portalSnapshot as { articles?: ApiArticle[] }).articles ?? []).slice(0, limit).map(normalizeApiArticle)
    : undefined;
  const query = useQuery({
    queryKey: ["portal-content", limit, category ?? ""],
    queryFn: () => fetchPortalContent(limit, category),
    initialData: () => readCachedContent(cacheKey) ?? bundledArticles,
    initialDataUpdatedAt: 0,
    enabled,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (query.data && !query.isFetching) cacheContent(cacheKey, query.data);
  }, [cacheKey, query.data, query.isFetching]);

  return {
    articles: query.data ?? [],
    loading: enabled && query.isPending,
    error: query.isError,
  };
}
