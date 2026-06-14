import { useEffect, type ReactNode } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { openCookieSettings } from "@/lib/cookie-consent";

type LegalPageProps = {
  title: string;
  kicker: string;
  intro: string;
  children: ReactNode;
};

function LegalPage({ title, kicker, intro, children }: LegalPageProps) {
  useEffect(() => {
    document.title = `${title} - Miloševac`;
    window.scrollTo({ top: 0 });
  }, [title]);

  return (
    <SiteLayout showBreaking={false}>
      <section className="container-news py-8 sm:py-12">
        <div className="grid gap-8 lg:grid-cols-[300px_minmax(0,1fr)]">
          <aside className="h-fit rounded-xl bg-gradient-brand p-6 text-white shadow-card lg:sticky lg:top-28">
            <span className="text-xs font-extrabold uppercase tracking-wider text-white/75">{kicker}</span>
            <h1 className="mt-3 text-3xl font-extrabold leading-tight text-white">{title}</h1>
            <p className="mt-4 text-sm leading-relaxed text-white/80">{intro}</p>
          </aside>
          <article className="editorial-panel p-5 sm:p-8">
            <div className="legal-prose">{children}</div>
          </article>
        </div>
      </section>
    </SiteLayout>
  );
}

export function PrivacyPolicy() {
  return (
    <LegalPage title="Politika privatnosti" kicker="GDPR i privatnost" intro="Kako portal prikuplja, koristi i štiti podatke posjetilaca.">
      <p>Portal obrađuje minimalnu količinu podataka potrebnu za rad, sigurnost, komunikaciju sa redakcijom, mjerenje posjeta i prikaz oglasa kada korisnik prihvati odgovarajuće kolačiće.</p>
      <h2>Ko je voditelj obrade</h2>
      <p>Voditelj obrade je redakcija portala. Kontakt za pitanja privatnosti: <a href="mailto:redakcija@milosevac.com">redakcija@milosevac.com</a>.</p>
      <h2>Koje podatke obrađujemo</h2>
      <ul>
        <li>tehničke podatke potrebne za isporuku stranice i sigurnost servera;</li>
        <li>podatke koje sami pošaljete putem e-maila ili kontakt forme;</li>
        <li>agregirane analitičke podatke samo nakon pristanka;</li>
        <li>podatke potrebne za prikaz Google oglasa samo nakon pristanka;</li>
        <li>podatke korisničkih naloga autora i urednika u CMS-u.</li>
      </ul>
      <h2>Pravna osnova i vaša prava</h2>
      <p>Neophodna obrada zasniva se na legitimnom interesu za sigurnost i funkcionisanje portala. Analitika i marketing zasnivaju se na pristanku koji možete povući u svakom trenutku.</p>
      <p>Možete zatražiti pristup, ispravku, brisanje, ograničenje obrade ili podnijeti prigovor putem e-maila redakcije.</p>
      <h2>Rokovi čuvanja</h2>
      <p>Kontakt poruke čuvamo koliko je potrebno za komunikaciju, sigurnosne logove ograničeno, a izbor kolačića u vašem browseru dok ga ne promijenite ili obrišete.</p>
    </LegalPage>
  );
}

export function CookiePolicy() {
  return (
    <LegalPage title="Politika kolačića" kicker="Privatnost" intro="Kolačiće možete prihvatiti, odbiti ili naknadno promijeniti svoj izbor.">
      <h2>Šta su kolačići</h2>
      <p>Kolačići su male tekstualne datoteke koje web stranica sprema u browser radi tehničkih postavki, izbora korisnika ili, uz pristanak, analize korištenja stranice.</p>
      <h2>Kategorije koje koristimo</h2>
      <div className="grid gap-3">
        <div className="rounded-lg border p-4"><strong>Neophodni</strong><p>Čuvanje izbora, sigurnost i osnovne funkcije portala. Uvijek aktivni.</p></div>
        <div className="rounded-lg border p-4"><strong>Analitika</strong><p>Mjerenje posjeta i popularnosti sadržaja. Opcionalno.</p></div>
        <div className="rounded-lg border p-4"><strong>Marketing i oglasi</strong><p>Google oglasi i povezane usluge. Opcionalno.</p></div>
      </div>
      <h2>Vaš izbor</h2>
      <p>Ako ne prihvatite analitiku ili marketing, pripadajuće skripte se ne učitavaju.</p>
      <Button onClick={openCookieSettings}>Otvori postavke kolačića</Button>
    </LegalPage>
  );
}

export function TermsOfUse() {
  return (
    <LegalPage title="Uslovi korištenja" kicker="Portal" intro="Pravila korištenja sadržaja i usluga portala Miloševac.">
      <h2>Sadržaj portala</h2>
      <p>Portal objavljuje lokalne vijesti, servisne informacije, sportski i magazinski sadržaj. Sadržaj je informativnog karaktera i može se ažurirati nakon objave.</p>
      <h2>Autorska prava</h2>
      <p>Tekstovi, fotografije, dizajn i drugi materijali ne smiju se preuzimati bez dozvole, osim kratkih citata uz jasno navođenje izvora i linka na originalni članak.</p>
      <h2>Korisnički nalozi</h2>
      <p>Autori i urednici odgovorni su za čuvanje pristupnih podataka. Zabranjeno je neovlašteno korištenje CMS panela i pokušaji zaobilaženja sigurnosti.</p>
      <h2>Odgovornost i kontakt</h2>
      <p>Nastojimo objavljivati tačne informacije, ali ne garantujemo potpunu dostupnost portala niti odsustvo grešaka. Za zahtjeve i ispravke pišite na <a href="mailto:redakcija@milosevac.com">redakcija@milosevac.com</a>.</p>
    </LegalPage>
  );
}
