import { lazy, Suspense, useState, type ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { BreakingTicker } from "./BreakingTicker";
import { AdSlot } from "./AdSlot";

const SearchOverlay = lazy(() => import("./SearchOverlay").then((module) => ({ default: module.SearchOverlay })));
const CookieConsent = lazy(() => import("./CookieConsent").then((module) => ({ default: module.CookieConsent })));

interface SiteLayoutProps {
  children: ReactNode;
  showBreaking?: boolean;
}

export function SiteLayout({ children, showBreaking = true }: SiteLayoutProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {showBreaking && <BreakingTicker />}
      <Header onSearchClick={() => setSearchOpen(true)} />
      <AdSlot variant="banner" lazy className="container-news mt-4" />
      <main className="flex-1">{children}</main>
      <AdSlot variant="banner" lazy className="container-news mt-14" />
      <Footer />
      {searchOpen && <Suspense fallback={null}><SearchOverlay open onOpenChange={setSearchOpen} /></Suspense>}
      <Suspense fallback={null}><CookieConsent /></Suspense>
    </div>
  );
}
