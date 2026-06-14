import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Article as ArticleType } from "@/data/content";
import Article from "./Article";

const article: ArticleType = {
  slug: "clanak-sa-slikom",
  title: "Članak sa slikom",
  excerpt: "Testni članak.",
  category: "vijesti",
  author: "Miloševac",
  date: "2026-06-15T08:00:00+00:00",
  readingTime: 1,
  cover: { hue: 0, pattern: "grid" },
  body: [],
  contentHtml: '<p>Tekst članka.</p><img src="/slika.jpg" alt="Slika iz teksta">',
};

vi.mock("@/components/site/SiteLayout", () => ({
  SiteLayout: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));
vi.mock("@/components/site/AdSlot", () => ({ AdSlot: () => null }));
vi.mock("@/components/news/CoverArt", () => ({ CoverArt: () => null }));
vi.mock("@/components/news/NewsCard", () => ({ NewsCard: () => null }));
vi.mock("@/components/news/SectionTitle", () => ({ SectionTitle: () => null }));
vi.mock("@/hooks/usePortalContent", () => ({
  normalizeApiArticle: (item: ArticleType) => item,
  usePortalContent: () => ({ articles: [article] }),
}));

describe("Article image lightbox", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn(() => new Promise(() => {})));
    vi.spyOn(window, "scrollTo").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    document.body.classList.remove("has-image-lightbox");
  });

  it("opens an inline image and closes it with Escape", () => {
    render(
      <MemoryRouter initialEntries={["/clanak/clanak-sa-slikom"]}>
        <Routes>
          <Route path="/clanak/:slug" element={<Article />} />
        </Routes>
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByAltText("Slika iz teksta"));

    expect(screen.getByRole("dialog", { name: "Uvećana slika iz članka" })).toBeInTheDocument();
    expect(document.body).toHaveClass("has-image-lightbox");

    fireEvent.keyDown(document, { key: "Escape" });

    expect(screen.queryByRole("dialog", { name: "Uvećana slika iz članka" })).not.toBeInTheDocument();
    expect(document.body).not.toHaveClass("has-image-lightbox");
  });
});
