import { useUIStore } from "@/stores/ui.store";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

export const Breadcrumbs = () => {
  const { breadcrumbs } = useUIStore();

  if (breadcrumbs.length < 2) return;

  return (
    <nav className="flex items-center gap-2 text-xs w-full">
      {breadcrumbs.map((item, index) => (
        <div key={`${item.label}-${index}`} className="flex items-center gap-2">
          {index !== 0 && (
            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
          )}
          {item.href ? (
            <Link
              href={item.href}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="font-medium text-foreground">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
};
