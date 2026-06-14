import { useEffect } from "react";
import { Mail } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";

const Contact = () => {
  useEffect(() => {
    document.title = "Kontakt - Miloševac";
    window.scrollTo({ top: 0 });
  }, []);

  return (
    <SiteLayout showBreaking={false}>
      <section className="container-news pt-6">
        <div className="relative overflow-hidden rounded-lg bg-gradient-brand p-6 text-primary-foreground shadow-card sm:p-10">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white ring-1 ring-white/25">
              Redakcija
            </span>
            <h1 className="mt-4 text-4xl font-extrabold leading-none text-white sm:text-5xl">Kontakt</h1>
            <p className="mt-4 text-base leading-relaxed text-primary-foreground/85 sm:text-lg">
              Imate vijest, najavu, fotografiju ili sugestiju? Pišite nam - vaše informacije su važne za našu zajednicu.
            </p>
          </div>
        </div>
      </section>

      <section className="container-news max-w-4xl py-10">
        <div className="editorial-panel p-6 text-center sm:p-10">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <Mail className="h-7 w-7 text-primary" />
          </div>
          <h2 className="mt-5 text-2xl font-extrabold">Pošaljite vijest ili informaciju</h2>
          <p className="mx-auto mt-3 max-w-2xl leading-relaxed text-muted-foreground">
            Vijesti, fotografije, video snimke, najave događaja, obavještenja, sugestije i sve druge informacije
            možete poslati našoj redakciji putem emaila:
          </p>
          <a
            href="mailto:info@milosevac.com"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-lg font-extrabold text-primary-foreground transition hover:bg-primary/90"
          >
            <Mail className="h-5 w-5" />
            info@milosevac.com
          </a>
          <p className="mt-5 text-sm text-muted-foreground">
            Uz poruku navedite što više detalja kako bismo informaciju mogli provjeriti i objaviti.
          </p>
        </div>
      </section>
    </SiteLayout>
  );
};

export default Contact;
