import { cn } from "@/lib/utils";

type Pattern = "waves" | "grid" | "dots" | "diagonal" | "blocks";

interface CoverArtProps {
  hue: number;
  pattern?: Pattern;
  className?: string;
  label?: string;
  src?: string | null;
  srcSet?: string | null;
  sizes?: string;
  priority?: boolean;
}

/**
 * Lightweight, performant SVG cover art used in place of placeholder images.
 * Generates a colored gradient + geometric pattern per article cover.
 */
export function CoverArt({ hue, pattern = "waves", className, label, src, srcSet, sizes = "(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 420px", priority = false }: CoverArtProps) {
  const c1 = `hsl(${hue}, 70%, 38%)`;
  const c2 = `hsl(${(hue + 25) % 360}, 75%, 28%)`;
  const c3 = `hsl(${(hue + 10) % 360}, 80%, 60%)`;

  return (
    <div
      className={cn("relative w-full overflow-hidden", className)}
      style={{ background: `linear-gradient(135deg, ${c2}, ${c1})` }}
      aria-label={label}
      role="img"
    >
      {src ? (
        <img
          src={src}
          srcSet={srcSet || undefined}
          sizes={srcSet ? sizes : undefined}
          alt={label || ""}
          className="absolute inset-0 h-full w-full object-cover"
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          decoding="async"
        />
      ) : null}
      <svg
        className={cn("absolute inset-0 h-full w-full opacity-30", src && "hidden")}
        viewBox="0 0 400 240"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        {pattern === "waves" && (
          <>
            <path d="M0 160 Q100 120 200 160 T400 160 V240 H0 Z" fill={c3} opacity="0.55" />
            <path d="M0 190 Q100 160 200 190 T400 190 V240 H0 Z" fill="white" opacity="0.15" />
          </>
        )}
        {pattern === "grid" && (
          <g stroke="white" strokeOpacity="0.25" strokeWidth="1">
            {Array.from({ length: 12 }).map((_, i) => (
              <line key={`v${i}`} x1={i * 35} y1="0" x2={i * 35} y2="240" />
            ))}
            {Array.from({ length: 8 }).map((_, i) => (
              <line key={`h${i}`} x1="0" y1={i * 35} x2="400" y2={i * 35} />
            ))}
          </g>
        )}
        {pattern === "dots" && (
          <g fill="white" fillOpacity="0.35">
            {Array.from({ length: 60 }).map((_, i) => (
              <circle key={i} cx={(i * 53) % 400} cy={Math.floor((i * 53) / 400) * 28 + 20} r="3" />
            ))}
          </g>
        )}
        {pattern === "diagonal" && (
          <g stroke="white" strokeOpacity="0.3" strokeWidth="2">
            {Array.from({ length: 20 }).map((_, i) => (
              <line key={i} x1={-100 + i * 40} y1="0" x2={100 + i * 40} y2="240" />
            ))}
          </g>
        )}
        {pattern === "blocks" && (
          <g fill="white" fillOpacity="0.2">
            {Array.from({ length: 16 }).map((_, i) => (
              <rect key={i} x={(i % 8) * 50} y={Math.floor(i / 8) * 70 + 30} width="34" height="50" />
            ))}
          </g>
        )}
      </svg>
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
    </div>
  );
}
