import { Link } from "react-router-dom";
import { Category } from "@/data/content";
import { cn } from "@/lib/utils";

interface CategoryPillProps {
  category: Category;
  size?: "sm" | "md";
  asLink?: boolean;
  className?: string;
}

export function CategoryPill({ category, size = "md", asLink = false, className }: CategoryPillProps) {
  const cls = cn(
    "category-pill text-white",
    size === "sm" ? "text-[10px] py-0.5 px-1.5" : "text-xs py-1 px-2",
    className,
  );
  const style = { backgroundColor: `hsl(var(--${category.color}))` };
  if (asLink) {
    return (
      <Link to={`/kategorija/${category.slug}`} className={cls} style={style}>
        {category.name}
      </Link>
    );
  }
  return (
    <span className={cls} style={style}>
      {category.name}
    </span>
  );
}
