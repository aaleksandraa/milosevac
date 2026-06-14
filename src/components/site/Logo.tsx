import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface LogoProps {
  variant?: "header" | "footer";
  className?: string;
}

export function Logo({ variant = "header", className }: LogoProps) {
  const isFooter = variant === "footer";

  return (
    <Link to="/" className={cn("group flex items-center", className)} aria-label="Miloševac - naslovna">
      <span
        className={cn(
          "font-serif text-2xl font-bold tracking-tight",
          isFooter ? "text-primary-foreground" : "text-black sm:text-3xl",
        )}
      >
        Miloševac
      </span>
    </Link>
  );
}
