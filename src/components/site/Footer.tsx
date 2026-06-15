import { Link } from "react-router-dom";
import { Facebook, Instagram, Mail, MapPin } from "lucide-react";
import { Logo } from "./Logo";
import { openCookieSettings } from "@/lib/cookie-consent";

const portalLinks = [
  { label: "Vijesti", href: "/kategorija/vijesti" },
  { label: "Sport", href: "/kategorija/sport" },
  { label: "O Miloševcu", href: "/omilosevcu" },
  { label: "FK Posavina", href: "/fk-posavina" },
  { label: "Vrijeme", href: "/vrijeme" },
  { label: "Kontakt", href: "/kontakt" },
];

const legalLinks = [
  { label: "Privatnost", href: "/politika-privatnosti" },
  { label: "Kolačići", href: "/politika-kolacica" },
  { label: "Uslovi korištenja", href: "/uslovi-koristenja" },
];

export function Footer() {
  return (
    <footer className="mt-16 bg-primary-deep text-primary-foreground">
      <div className="container-news py-10 text-center sm:py-12">
        <Logo variant="footer" className="justify-center" />
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-primary-foreground/75">
          Lokalni informativni portal za Miloševac i okolinu - vijesti, obavještenja, sport i zajednica.
        </p>

        <nav className="mt-7 flex flex-wrap items-center justify-center gap-x-5 gap-y-3 text-sm font-bold" aria-label="Linkovi u footeru">
          {portalLinks.map((item) => (
            <Link key={item.href} to={item.href} className="text-primary-foreground/85 transition hover:text-white">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="mx-auto mt-8 flex max-w-xl flex-col items-center justify-center gap-3 text-sm text-primary-foreground/70 sm:flex-row sm:gap-6">
          <span className="inline-flex items-center gap-2">
            <MapPin className="h-4 w-4" /> Miloševac, Modriča
          </span>
          <a href="mailto:info@milosevac.com" className="inline-flex items-center gap-2 transition hover:text-white">
            <Mail className="h-4 w-4" /> info@milosevac.com
          </a>
        </div>

        <div className="mt-7 flex justify-center gap-3">
          <a
            href="https://www.facebook.com/milosevac.official"
            target="_blank"
            rel="noreferrer"
            aria-label="Miloševac na Facebooku"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-primary-foreground/10 transition hover:bg-primary-foreground/20"
          >
            <Facebook className="h-5 w-5" />
          </a>
          <a
            href="https://www.instagram.com/milosevac.official/"
            target="_blank"
            rel="noreferrer"
            aria-label="Miloševac na Instagramu"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-primary-foreground/10 transition hover:bg-primary-foreground/20"
          >
            <Instagram className="h-5 w-5" />
          </a>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 border-t border-primary-foreground/15 pt-5 text-xs text-primary-foreground/60">
          {legalLinks.map((item) => (
            <Link key={item.href} to={item.href} className="transition hover:text-white">
              {item.label}
            </Link>
          ))}
          <button type="button" onClick={openCookieSettings} className="transition hover:text-white">
            Postavke kolačića
          </button>
        </div>
      </div>

      <div className="border-t border-primary-foreground/15">
        <div className="container-news flex flex-col items-center gap-1 py-4 text-center text-xs text-primary-foreground/60 sm:flex-row sm:justify-between">
          <span>© {new Date().getFullYear()} Miloševac. Sva prava zadržana.</span>
          <span>Oficijalna stranica Miloševca · milosevac.com</span>
        </div>
      </div>
    </footer>
  );
}
