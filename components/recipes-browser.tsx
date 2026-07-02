"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { RecipeCard } from "@/components/recipe-card";
import type { Recipe } from "@/lib/types";

export function RecipesBrowser({ recipes }: { recipes: Recipe[] }) {
  const [q, setQ] = useState("");
  const [tag, setTag] = useState<string | null>(null);

  const allTags = useMemo(() => {
    const set = new Set<string>();
    recipes.forEach((r) => r.tags.forEach((t) => set.add(t)));
    return Array.from(set).sort();
  }, [recipes]);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return recipes.filter(
      (r) => (!query || r.name.toLowerCase().includes(query)) && (!tag || r.tags.includes(tag)),
    );
  }, [recipes, q, tag]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Рецепти</h1>
        <Button asChild>
          <Link href="/recipes/new">
            <Plus className="mr-1 h-4 w-4" /> Нова рецепта
          </Link>
        </Button>
      </div>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Търси рецепта..."
          className="pl-9"
          value={q}
          onChange={(e) => setQ(e.target.value)}
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
      {filtered.length === 0 ? (
        <div className="rounded-lg border p-8 text-center text-muted-foreground">
          Няма намерени рецепти.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((r) => (
            <RecipeCard key={r.id} recipe={r} />
          ))}
        </div>
      )}
    </div>
  );
}
