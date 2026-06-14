import { Link } from "react-router-dom";
import { Facebook, Mail, MapPin, Phone } from "lucide-react";
import { Logo } from "./Logo";
import { categories } from "@/data/content";
import { openCookieSettings } from "@/lib/cookie-consent";

export function Footer() {
  return (
    <footer className="mt-16 bg-primary-deep text-primary-foreground">
      <div className="container-news py-12">
        <div className="grid gap-10 md:grid-cols-[1.2fr_0.8fr_0.8fr_1fr]">
          <div>
            <Logo variant="footer" />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-primary-foreground/75">
              Lokalni informativni portal za Miloševac i okolinu - vijesti, obavještenja, sport,
              kultura i zajednica.
            </p>
            <div className="mt-5 flex gap-2">
              <a
                href="#"
                aria-label="Facebook"
                className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-primary-foreground/10 transition hover:bg-primary-foreground/20"
              >
                <Facebook className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-primary-foreground/90">Kategorije</h3>
            <ul className="space-y-2.5 text-sm">
              {categories
                .filter((c) => c.slug !== "kontakt" && c.slug !== "milosevac")
                .map((cat) => (
                  <li key={cat.slug}>
                    <Link to={`/kategorija/${cat.slug}`} className="text-primary-foreground/75 hover:text-primary-foreground">
                      {cat.name}
                    </Link>
                  </li>
                ))}
              <li>
                <Link to="/omilosevcu" className="text-primary-foreground/75 hover:text-primary-foreground">
                  O Miloševcu
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-primary-foreground/90">Brzi linkovi</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/" className="text-primary-foreground/75 hover:text-primary-foreground">Naslovna</Link></li>
              <li><Link to="/omilosevcu" className="text-primary-foreground/75 hover:text-primary-foreground">O Miloševcu</Link></li>
              <li><Link to="/kategorija/vijesti" className="text-primary-foreground/75 hover:text-primary-foreground">Sve vijesti</Link></li>
              <li><Link to="/fk-posavina" className="text-primary-foreground/75 hover:text-primary-foreground">FK Posavina</Link></li>
              <li><Link to="/kategorija/slike" className="text-primary-foreground/75 hover:text-primary-foreground">Galerije</Link></li>
              <li><Link to="/kontakt" className="text-primary-foreground/75 hover:text-primary-foreground">Kontakt</Link></li>
              <li><Link to="/politika-privatnosti" className="text-primary-foreground/75 hover:text-primary-foreground">Privatnost / GDPR</Link></li>
              <li><Link to="/politika-kolacica" className="text-primary-foreground/75 hover:text-primary-foreground">Politika kolačića</Link></li>
              <li><Link to="/uslovi-koristenja" className="text-primary-foreground/75 hover:text-primary-foreground">Uslovi korištenja</Link></li>
              <li><button type="button" onClick={openCookieSettings} className="text-primary-foreground/75 hover:text-primary-foreground">Postavke kolačića</button></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-primary-foreground/90">Kontakt</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2 text-primary-foreground/75">
                <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0" /> Miloševac, Modriča, Republika Srpska
              </li>
              <li className="flex items-start gap-2 text-primary-foreground/75">
                <Mail className="mt-0.5 h-4 w-4 flex-shrink-0" /> redakcija@milosevac.com
              </li>
              <li className="flex items-start gap-2 text-primary-foreground/75">
                <Phone className="mt-0.5 h-4 w-4 flex-shrink-0" /> +387 00 000 000
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-primary-foreground/15">
        <div className="container-news flex flex-col items-center justify-between gap-2 py-4 text-center text-xs text-primary-foreground/60 sm:flex-row">
          <span>© {new Date().getFullYear()} Miloševac. Sva prava zadržana.</span>
          <span>Oficijalna stranica Miloševca · milosevac.com</span>
        </div>
      </div>
    </footer>
  );
}
