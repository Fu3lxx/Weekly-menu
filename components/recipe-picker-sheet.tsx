"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Recipe } from "@/lib/types";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recipes: Recipe[];
  onPick: (recipe: Recipe, servings: number) => void;
}

export function RecipePickerSheet({ open, onOpenChange, recipes, onPick }: Props) {
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState<string | null>(null);

  const allTags = useMemo(() => {
    const set = new Set<string>();
    recipes.forEach((r) => r.tags.forEach((t) => set.add(t)));
    return Array.from(set).sort();
  }, [recipes]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return recipes.filter(
      (r) =>
        (!q || r.name.toLowerCase().includes(q)) && (!tag || r.tags.includes(tag)),
    );
  }, [recipes, query, tag]);

  const handlePick = (r: Recipe) => {
    onPick(r, r.default_servings);
    onOpenChange(false);
    setQuery("");
    setTag(null);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[85vh]">
        <SheetHeader>
          <SheetTitle>Избери рецепта</SheetTitle>
        </SheetHeader>
        <div className="mt-4 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Търси..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-9"
              autoFocus={false}
            />
          </div>
          {allTags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              <Badge
                variant={tag === null ? "default" : "outline"}
                onClick={() => setTag(null)}
                className="cursor-pointer"
              >
                Всички
              </Badge>
              {allTags.map((t) => (
                <Badge
                  key={t}
                  variant={tag === t ? "default" : "outline"}
                  onClick={() => setTag(t === tag ? null : t)}
                  className="cursor-pointer"
                >
                  {t}
                </Badge>
              ))}
            </div>
          )}
          <div className="max-h-[55vh] space-y-2 overflow-y-auto pb-4">
            {filtered.length === 0 && (
              <p className="py-8 text-center text-sm text-muted-foreground">Няма резултати</p>
            )}
            {filtered.map((r) => (
              <Button
                key={r.id}
                variant="outline"
                className="h-auto w-full justify-between py-3 text-left"
                onClick={() => handlePick(r)}
              >
                <div className="flex flex-col items-start">
                  <span className="font-medium">{r.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {r.prep_time_minutes ? `${r.prep_time_minutes} мин · ` : ""}
                    {r.default_servings} порции
                    {r.kcal_per_serving ? ` · ${Math.round(r.kcal_per_serving)} ккал` : ""}
                  </span>
                </div>
              </Button>
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
