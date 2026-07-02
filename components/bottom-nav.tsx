"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calendar, ChefHat, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";
import { toIsoDate, getWeekStart } from "@/lib/date-utils";

export function BottomNav() {
  const pathname = usePathname();
  const today = toIsoDate(getWeekStart(new Date()));
  const items = [
    { href: "/", label: "Седмица", icon: Calendar, match: (p: string) => p === "/" || p.startsWith("/week") },
    { href: "/recipes", label: "Рецепти", icon: ChefHat, match: (p: string) => p.startsWith("/recipes") },
    {
      href: `/shopping/${today}`,
      label: "Покупки",
      icon: ShoppingCart,
      match: (p: string) => p.startsWith("/shopping"),
    },
  ];
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <ul className="container flex h-16 items-stretch justify-around px-2">
        {items.map((it) => {
          const active = it.match(pathname);
          const Icon = it.icon;
          return (
            <li key={it.label} className="flex-1">
              <Link
                href={it.href}
                className={cn(
                  "flex h-full flex-col items-center justify-center gap-1 rounded-md text-xs transition-colors",
                  active ? "text-primary" : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Icon className="h-6 w-6" />
                <span>{it.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
