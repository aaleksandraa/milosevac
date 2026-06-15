import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { CloudSun, Menu, Search, X } from "lucide-react";
import { Logo } from "./Logo";
import { cn } from "@/lib/utils";
import { backendLoginUrl } from "@/lib/backend";

const navItems = [
  { label: "Naslovna", href: "/" },
  { label: "Vijesti", href: "/kategorija/vijesti" },
  { label: "Obavještenja", href: "/kategorija/vijesti?tag=obavjestenje" },
  { label: "Sport", href: "/kategorija/sport" },
  { label: "FK Posavina", href: "/fk-posavina" },
  { label: "Vrijeme", href: "/vrijeme" },
  { label: "Kontakt", href: "/kontakt" },
];

function isActivePath(pathname: string, currentSearch: string, href: string) {
  const [path, search] = href.split("?");
  if (search) return pathname === path && currentSearch.includes(search);
  return pathname === path && currentSearch === "";
}

export function Header({ onSearchClick }: { onSearchClick: () => void }) {
  const [open, setOpen] = useState(false);
  const [temperature, setTemperature] = useState<number | null>(null);
  const location = useLocation();

  useEffect(() => setOpen(false), [location.pathname, location.search]);

  useEffect(() => {
    const controller = new AbortController();

    fetch("/api/weather", { headers: { Accept: "application/json" }, signal: controller.signal })
      .then((response) => response.ok ? response.json() : null)
      .then((payload) => setTemperature(payload?.current?.temperature ?? null))
      .catch(() => {});

    return () => controller.abort();
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-white/95 backdrop-blur-xl">
      <div className="container-news flex h-16 items-center justify-between gap-3 sm:h-20 sm:gap-4">
        <Logo className="hidden lg:flex" />

        <div className="flex min-w-0 items-center gap-2 lg:hidden">
          <Link
            to="/vrijeme"
            className="inline-flex h-10 items-center gap-1.5 rounded-md bg-slate-100 px-2.5 text-sm font-extrabold text-slate-700 transition hover:bg-slate-200 hover:text-primary"
            aria-label="Trenutna temperatura i vrijeme u Miloševcu"
          >
            <CloudSun className="h-4 w-4 text-primary" />
            {temperature === null ? "--°" : `${Math.round(temperature)}°`}
          </Link>
          <Link
            to="/kategorija/vijesti?tag=obavjestenje"
            className="truncate rounded-md bg-primary px-3 py-2.5 text-xs font-extrabold uppercase tracking-wide text-white transition hover:bg-primary/90"
          >
            Obavještenja
          </Link>
        </div>

        <nav className="hidden items-center gap-6 lg:flex xl:gap-8" aria-label="Glavna navigacija">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "text-sm font-extrabold uppercase tracking-[0.12em] text-slate-600 transition-colors hover:text-primary",
                isActivePath(location.pathname, location.search, item.href) && "text-primary",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          onClick={onSearchClick}
          className="hidden h-11 items-center gap-2 rounded-md bg-[#101827] px-5 text-sm font-bold text-white shadow-sm transition hover:bg-primary xl:inline-flex"
          aria-label="Pretraži vijesti"
        >
          <Search className="h-4 w-4" />
          Pretraži
        </button>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border/70 bg-card hover:bg-secondary lg:hidden"
          aria-label={open ? "Zatvori meni" : "Otvori meni"}
          aria-expanded={open}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="absolute inset-x-0 top-full border-b bg-white shadow-lg lg:hidden">
          <div className="container-news py-3">
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                onSearchClick();
              }}
              className="mb-2 flex w-full items-center gap-2 rounded-lg border bg-secondary px-3 py-3 text-sm text-muted-foreground hover:bg-muted"
            >
              <Search className="h-4 w-4" />
              Pretraži vijesti...
            </button>
            <nav aria-label="Mobilna navigacija">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "flex items-center justify-between border-b px-3 py-3 text-base font-semibold hover:text-primary",
                    isActivePath(location.pathname, location.search, item.href) && "text-primary",
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <a href={backendLoginUrl} className="mt-2 block px-3 py-3 text-sm font-semibold text-muted-foreground">
              Prijava za urednike
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
