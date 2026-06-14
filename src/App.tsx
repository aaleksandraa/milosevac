import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Index from "./pages/Index.tsx";

const AboutMilosevac = lazy(() => import("./pages/AboutMilosevac.tsx"));
const Article = lazy(() => import("./pages/Article.tsx"));
const Category = lazy(() => import("./pages/Category.tsx"));
const Contact = lazy(() => import("./pages/Contact.tsx"));
const FkPosavina = lazy(() => import("./pages/FkPosavina.tsx"));
const FkMatch = lazy(() => import("./pages/FkMatch.tsx"));
const Weather = lazy(() => import("./pages/Weather.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));
const PrivacyPolicy = lazy(() => import("./pages/Legal.tsx").then((module) => ({ default: module.PrivacyPolicy })));
const CookiePolicy = lazy(() => import("./pages/Legal.tsx").then((module) => ({ default: module.CookiePolicy })));
const TermsOfUse = lazy(() => import("./pages/Legal.tsx").then((module) => ({ default: module.TermsOfUse })));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/omilosevcu" element={<AboutMilosevac />} />
          <Route path="/clanak/:slug" element={<Article />} />
          <Route path="/kategorija/:slug" element={<Category />} />
          <Route path="/fk-posavina" element={<FkPosavina />} />
          <Route path="/fk-posavina/utakmica/:slug" element={<FkMatch />} />
          <Route path="/vrijeme" element={<Weather />} />
          <Route path="/kontakt" element={<Contact />} />
          <Route path="/politika-privatnosti" element={<PrivacyPolicy />} />
          <Route path="/politika-kolacica" element={<CookiePolicy />} />
          <Route path="/uslovi-koristenja" element={<TermsOfUse />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
