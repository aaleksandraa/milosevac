import { Link } from "react-router-dom";
import { AlertTriangle, Info, Bell, MapPin, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface AlertCardProps {
  type: string;
  title: string;
  location?: string;
  severity: "high" | "medium" | "info";
  href: string;
  className?: string;
}

const severityMap = {
  high: {
    bg: "bg-urgent/10 border-urgent/30",
    badge: "bg-urgent text-urgent-foreground",
    icon: AlertTriangle,
    title: "text-urgent",
  },
  medium: {
    bg: "bg-accent/10 border-accent/30",
    badge: "bg-accent text-accent-foreground",
    icon: Bell,
    title: "text-foreground",
  },
  info: {
    bg: "bg-secondary border-border",
    badge: "bg-primary text-primary-foreground",
    icon: Info,
    title: "text-foreground",
  },
};

export function AlertCard({ type, title, location, severity, href, className }: AlertCardProps) {
  const s = severityMap[severity];
  const Icon = s.icon;
  return (
    <Link
      to={href}
      className={cn(
        "group flex min-h-[150px] flex-col gap-2 rounded-lg border p-4 transition-all hover:-translate-y-0.5 hover:shadow-card-hover",
        s.bg,
        className,
      )}
    >
      <div className="flex items-center gap-2">
        <span className={cn("category-pill flex items-center gap-1", s.badge)}>
          <Icon className="h-3 w-3" /> {type}
        </span>
      </div>
      <h3 className={cn("text-base font-extrabold leading-snug", s.title)}>{title}</h3>
      <div className="mt-auto flex items-center justify-between gap-3 text-sm text-muted-foreground">
        {location && (
          <span className="flex min-w-0 items-center gap-1">
            <MapPin className="h-3.5 w-3.5" /> {location}
          </span>
        )}
        <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
      </div>
    </Link>
  );
}
