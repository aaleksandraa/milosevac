import { useEffect, useMemo, useState } from "react";
import {
  Cloud,
  CloudLightning,
  CloudRain,
  CloudSun,
  Droplets,
  Gauge,
  Loader2,
  Snowflake,
  Sun,
  Sunrise,
  Sunset,
  ThermometerSun,
  Umbrella,
  Wind,
} from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";

type WeatherIconName = "sun" | "partly" | "cloud" | "rain" | "storm" | "snow";

type WeatherPayload = {
  configured: boolean;
  source: string;
  location: string;
  updated_at?: string;
  message?: string;
  current: null | {
    temperature: number | null;
    feels_like: number | null;
    humidity: number | null;
    precipitation: number | null;
    pressure: number | null;
    uv_index: number | null;
    wind_speed: number | null;
    wind_direction: string | null;
    weather_text: string;
    icon: WeatherIconName;
  };
  hourly: Array<{
    datetime: string | null;
    time: string | null;
    temperature: number | null;
    real_feel: number | null;
    rain_probability: number | null;
    wind_speed: number | null;
    weather_text: string;
    icon: WeatherIconName;
  }>;
  daily: Array<{
    date: string | null;
    label: string | null;
    min: number | null;
    max: number | null;
    day_text: string;
    rain_probability: number | null;
    wind_speed: number | null;
    sunrise: string | null;
    sunset: string | null;
    icon: WeatherIconName;
  }>;
};

function WeatherIcon({ name, className = "h-6 w-6" }: { name: WeatherIconName; className?: string }) {
  const icons = {
    sun: Sun,
    partly: CloudSun,
    cloud: Cloud,
    rain: CloudRain,
    storm: CloudLightning,
    snow: Snowflake,
  };
  const Icon = icons[name] ?? CloudSun;
  return <Icon className={className} />;
}

function value(value: number | null | undefined, suffix = "") {
  return value === null || value === undefined ? "-" : `${value}${suffix}`;
}

function dayDate(date?: string | null) {
  if (!date) return "";
  return new Intl.DateTimeFormat("bs-BA", { day: "2-digit", month: "2-digit" }).format(new Date(date));
}

function formatUpdated(iso?: string) {
  if (!iso) return "-";
  return new Intl.DateTimeFormat("bs-BA", { hour: "2-digit", minute: "2-digit" }).format(new Date(iso));
}

const Weather = () => {
  const [forecast, setForecast] = useState<WeatherPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadWeather = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/weather", { headers: { Accept: "application/json" } });
      if (!response.ok) throw new Error("Vremenska prognoza trenutno nije dostupna.");
      setForecast(await response.json());
    } catch {
      setError("Nije moguće učitati prognozu. Pokušajte ponovo malo kasnije.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = "Vrijeme - Miloševac";
    window.scrollTo({ top: 0 });
    loadWeather();
  }, []);

  const updated = useMemo(() => formatUpdated(forecast?.updated_at), [forecast?.updated_at]);
  const today = forecast?.daily[0];
  const previewHours = forecast?.hourly.slice(0, 5) ?? [];

  return (
    <SiteLayout>
      <section className="container-news pt-4 sm:pt-6">
        <div className="relative overflow-hidden rounded-lg bg-gradient-brand p-4 text-primary-foreground shadow-card sm:p-7">
          <div className="flex items-end justify-between gap-3">
            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-white ring-1 ring-white/25 sm:px-3 sm:text-xs">
                <CloudSun className="h-4 w-4" /> Open-Meteo
              </span>
              <h1 className="mt-2 text-2xl font-extrabold leading-tight text-white sm:mt-3 sm:text-4xl">
                Vrijeme u Miloševcu
              </h1>
              <p className="mt-2 hidden text-sm leading-relaxed text-primary-foreground/85 sm:block sm:text-base">
                Trenutno stanje, 7 dana prognoze i naredna 24 sata za Miloševac.
              </p>
            </div>
            <div className="shrink-0 rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-sm backdrop-blur sm:px-4 sm:py-3">
              <span className="block text-xs font-bold uppercase tracking-wider text-white/70">Ažurirano</span>
              <span className="text-lg font-extrabold text-white sm:text-xl">{updated}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="container-news py-5 sm:py-9">
        {loading ? (
          <div className="editorial-panel flex min-h-[220px] items-center justify-center p-8 text-muted-foreground">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Učitavam prognozu...
          </div>
        ) : error ? (
          <div className="editorial-panel p-6 sm:p-8">
            <h2 className="text-xl font-extrabold">Prognoza nije dostupna</h2>
            <p className="mt-2 text-sm text-muted-foreground">{error}</p>
            <Button onClick={loadWeather} className="mt-5">
              Pokušaj ponovo
            </Button>
          </div>
        ) : forecast ? (
          <div className="space-y-6 sm:space-y-8">
            <section className="grid items-start gap-3 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)] lg:gap-4">
              <div className="editorial-panel relative overflow-hidden p-4 sm:p-6">
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-brand" aria-hidden />
                <div className="flex items-start justify-between gap-3 sm:gap-4">
                  <div className="min-w-0">
                    <p className="line-clamp-1 text-[11px] font-bold uppercase tracking-wider text-muted-foreground sm:text-sm">
                      {forecast.location}
                    </p>
                    <div className="mt-2 flex flex-wrap items-end gap-x-3 gap-y-1 sm:mt-3 sm:gap-x-4">
                      <span className="text-5xl font-extrabold leading-none tracking-tight sm:text-7xl">
                        {value(forecast.current?.temperature, "°")}
                      </span>
                      <div className="pb-1">
                        <p className="text-sm font-extrabold text-foreground sm:text-base">
                          {forecast.current?.weather_text ?? "Promjenjivo"}
                        </p>
                        <p className="text-xs font-semibold text-muted-foreground sm:text-sm">
                          Osjećaj {value(forecast.current?.feels_like, "°")}
                        </p>
                      </div>
                    </div>
                  </div>
                  {forecast.current && (
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary/8 text-primary sm:h-24 sm:w-24">
                      <WeatherIcon name={forecast.current.icon} className="h-10 w-10 sm:h-14 sm:w-14" />
                    </div>
                  )}
                </div>

                <div className="mt-4 grid grid-cols-4 gap-2 sm:mt-6 sm:gap-3">
                  {[
                    ["Maks", value(today?.max, "°"), ThermometerSun],
                    ["Min", value(today?.min, "°"), ThermometerSun],
                    ["Izlazak", today?.sunrise ?? "-", Sunrise],
                    ["Zalazak", today?.sunset ?? "-", Sunset],
                  ].map(([label, itemValue, Icon]) => (
                    <div key={label as string} className="rounded-lg border border-border/70 bg-secondary/45 p-2 sm:p-3">
                      <Icon className="h-3.5 w-3.5 text-primary sm:h-4 sm:w-4" />
                      <p className="mt-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground sm:mt-2 sm:text-[11px]">
                        {label as string}
                      </p>
                      <p className="mt-0.5 text-sm font-extrabold sm:text-lg">{itemValue as string}</p>
                    </div>
                  ))}
                </div>

                {previewHours.length > 0 && (
                  <div className="mt-4 border-t border-border/70 pt-3 sm:mt-5 sm:pt-4">
                    <div className="mb-2 flex items-center justify-between sm:mb-3">
                      <h2 className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground sm:text-sm">
                        Sljedeći sati
                      </h2>
                      <span className="text-xs font-semibold text-muted-foreground">Izvor: {forecast.source}</span>
                    </div>
                    <div className="grid grid-cols-5 gap-2">
                      {previewHours.map((hour) => (
                        <div
                          key={`preview-${hour.datetime}`}
                          className="rounded-md bg-background px-1.5 py-2 text-center ring-1 ring-border/70 sm:px-2 sm:py-3"
                        >
                          <p className="text-xs font-bold text-muted-foreground">{hour.time}</p>
                          <WeatherIcon name={hour.icon} className="mx-auto mt-1.5 h-4 w-4 text-primary sm:mt-2 sm:h-5 sm:w-5" />
                          <p className="mt-1.5 text-base font-extrabold sm:mt-2 sm:text-lg">{value(hour.temperature, "°")}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                {[
                  ["Vlažnost", value(forecast.current?.humidity, "%"), Droplets],
                  ["Vjetar", `${value(forecast.current?.wind_speed, " km/h")} ${forecast.current?.wind_direction ?? ""}`, Wind],
                  ["Padavine", value(forecast.current?.precipitation, " mm"), Umbrella],
                  ["Pritisak", value(forecast.current?.pressure, " mb"), Gauge],
                ].map(([label, itemValue, Icon]) => (
                  <div key={label as string} className="editorial-panel p-3 sm:p-5">
                    <div className="flex items-center justify-between gap-3">
                      <Icon className="h-4 w-4 text-primary sm:h-5 sm:w-5" />
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground sm:text-xs">
                        {label as string}
                      </span>
                    </div>
                    <p className="mt-2 text-lg font-extrabold tracking-tight sm:mt-3 sm:text-3xl">{itemValue as string}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <div className="mb-3 flex items-end justify-between border-b-2 border-foreground pb-2 sm:mb-4">
                <h2 className="text-xl font-extrabold leading-tight text-foreground sm:text-3xl">Prognoza po danima</h2>
              </div>
              <div className="grid auto-cols-[150px] grid-flow-col gap-3 overflow-x-auto pb-2 sm:auto-cols-auto sm:grid-flow-row sm:grid-cols-2 sm:overflow-visible sm:pb-0 lg:grid-cols-4 xl:grid-cols-7">
                {forecast.daily.map((day) => (
                  <div key={day.date} className="editorial-panel p-3 sm:p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-extrabold sm:text-base">{day.label}</p>
                        <p className="mt-0.5 text-xs font-semibold text-muted-foreground">{dayDate(day.date)}</p>
                      </div>
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary text-primary sm:h-10 sm:w-10">
                        <WeatherIcon name={day.icon} className="h-5 w-5 sm:h-6 sm:w-6" />
                      </div>
                    </div>
                    <p className="mt-3 min-h-[34px] text-xs font-semibold leading-snug text-muted-foreground sm:text-sm">
                      {day.day_text}
                    </p>
                    <div className="mt-3 flex items-baseline gap-2 sm:mt-4">
                      <span className="text-2xl font-extrabold sm:text-3xl">{value(day.max, "°")}</span>
                      <span className="text-base font-extrabold text-muted-foreground sm:text-lg">{value(day.min, "°")}</span>
                    </div>
                    <div className="mt-3 space-y-1 text-xs font-semibold text-muted-foreground sm:mt-4 sm:space-y-1.5">
                      <p className="flex items-center justify-between">
                        <span>Kiša</span>
                        <strong>{value(day.rain_probability, "%")}</strong>
                      </p>
                      <p className="flex items-center justify-between">
                        <span>Vjetar</span>
                        <strong>{value(day.wind_speed, " km/h")}</strong>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <div className="mb-3 flex items-end justify-between border-b-2 border-foreground pb-2 sm:mb-4">
                <h2 className="text-xl font-extrabold leading-tight text-foreground sm:text-3xl">Naredna 24 sata</h2>
              </div>
              <div className="overflow-x-auto pb-3">
                <div className="flex min-w-max gap-2 sm:gap-3">
                  {forecast.hourly.map((hour) => (
                    <div key={`${hour.datetime}-${hour.time}`} className="editorial-panel w-24 shrink-0 p-3 text-center sm:w-28 sm:p-4">
                      <p className="text-xs font-bold text-muted-foreground sm:text-sm">{hour.time}</p>
                      <div className="mx-auto mt-3 flex h-8 w-8 items-center justify-center rounded-lg bg-secondary text-primary sm:mt-4 sm:h-9 sm:w-9">
                        <WeatherIcon name={hour.icon} className="h-5 w-5" />
                      </div>
                      <p className="mt-3 text-xl font-extrabold sm:mt-4 sm:text-2xl">{value(hour.temperature, "°")}</p>
                      <p className="mt-2 text-xs font-bold text-muted-foreground sm:mt-3">{value(hour.rain_probability, "%")}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="grid grid-cols-3 gap-2 sm:gap-3">
              {[
                ["UV indeks", value(forecast.current?.uv_index), ThermometerSun],
                ["Osjećaj", value(forecast.current?.feels_like, "°"), ThermometerSun],
                ["Izvor", forecast.source, CloudSun],
              ].map(([label, itemValue, Icon]) => (
                <div key={label as string} className="editorial-panel p-3 sm:p-4">
                  <Icon className="h-4 w-4 text-primary sm:h-5 sm:w-5" />
                  <p className="mt-2 text-xs font-bold text-muted-foreground sm:mt-3 sm:text-sm">{label as string}</p>
                  <p className="mt-1 text-base font-extrabold sm:text-2xl">{itemValue as string}</p>
                </div>
              ))}
            </section>
          </div>
        ) : null}
      </section>
    </SiteLayout>
  );
};

export default Weather;
