import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { openCookieSettingsEvent } from "@/lib/cookie-consent";

const consentKey = "milosevac_cookie_consent_v2";

type Consent = {
  analytics: boolean;
  marketing: boolean;
};

function readConsent(): Consent | null {
  try {
    return JSON.parse(localStorage.getItem(consentKey) || "null") as Consent | null;
  } catch {
    return null;
  }
}

export function CookieConsent() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!readConsent()) setOpen(true);

    const handleOpen = () => setOpen(true);
    window.addEventListener(openCookieSettingsEvent, handleOpen);
    return () => window.removeEventListener(openCookieSettingsEvent, handleOpen);
  }, []);

  const save = (value: Consent) => {
    localStorage.setItem(consentKey, JSON.stringify(value));
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-x-3 bottom-3 z-[100] mx-auto max-w-3xl rounded-xl border border-border bg-background/95 p-4 shadow-2xl backdrop-blur sm:p-5">
      <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-wider text-primary">Privatnost i kolačići</p>
          <h2 className="mt-1 text-lg font-extrabold">Koristimo kolačiće</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Uz neophodne kolačiće, koristimo analitiku i marketing oglase kada prihvatite sve.
          </p>
          <div className="mt-3 flex flex-wrap gap-4 text-xs font-bold text-primary">
            <Link to="/politika-privatnosti">Politika privatnosti</Link>
            <Link to="/politika-kolacica">Politika kolačića</Link>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 sm:max-w-52 sm:justify-end">
          <Button variant="outline" onClick={() => save({ analytics: false, marketing: false })}>
            Samo neophodni
          </Button>
          <Button onClick={() => save({ analytics: true, marketing: true })}>
            Prihvati sve
          </Button>
        </div>
      </div>
    </div>
  );
}
