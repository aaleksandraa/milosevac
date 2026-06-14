import { cn } from "@/lib/utils";

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  accent?: "primary" | "accent" | "urgent";
  className?: string;
  as?: "h2" | "h3";
}

export function SectionTitle({
  title,
  subtitle,
  action,
  accent = "primary",
  className,
  as: As = "h2",
}: SectionTitleProps) {
  const accentColor = {
    primary: "bg-primary",
    accent: "bg-accent",
    urgent: "bg-urgent",
  }[accent];

  return (
    <div className={cn("mb-5 flex items-end justify-between gap-3 border-b border-border/70 pb-3", className)}>
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <span className={cn("h-7 w-1 rounded-sm", accentColor)} aria-hidden />
          <As className="text-xl font-extrabold tracking-tight sm:text-2xl">{title}</As>
        </div>
        {subtitle && <p className="text-sm text-muted-foreground mt-1 ml-3.5">{subtitle}</p>}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}
