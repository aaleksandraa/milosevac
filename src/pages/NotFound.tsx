import { Link } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft, Home } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  useEffect(() => {
    document.title = "Stranica nije pronađena — Miloševac";
  }, []);

  return (
    <SiteLayout>
      <main className="container-news flex flex-col items-center justify-center py-20 text-center sm:py-28">
        <p className="text-6xl font-extrabold tracking-tight text-primary sm:text-7xl">404</p>
        <h1 className="mt-4 text-2xl font-extrabold sm:text-3xl">Stranica nije pronađena</h1>
        <p className="mt-3 max-w-md text-muted-foreground">
          Tražena stranica ne postoji ili je premještena. Provjerite adresu ili se
          vratite na naslovnu da pronađete najnovije vijesti iz Miloševca.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button asChild>
            <Link to="/">
              <Home className="h-4 w-4" /> Naslovna strana
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/kategorija/vijesti">
              <ArrowLeft className="h-4 w-4" /> Sve vijesti
            </Link>
          </Button>
        </div>
      </main>
    </SiteLayout>
  );
};

export default NotFound;
