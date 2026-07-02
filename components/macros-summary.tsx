import type { MealPlanEntryWithRecipe } from "@/lib/types";

interface Props {
  meals: MealPlanEntryWithRecipe[];
  className?: string;
  label?: string;
}

export function MacrosSummary({ meals, className, label }: Props) {
  const totals = meals.reduce(
    (acc, m) => {
      const s = m.servings;
      acc.kcal += (m.recipe.kcal_per_serving ?? 0) * s;
      acc.p += (m.recipe.protein_per_serving ?? 0) * s;
      acc.c += (m.recipe.carbs_per_serving ?? 0) * s;
      acc.f += (m.recipe.fat_per_serving ?? 0) * s;
      return acc;
    },
    { kcal: 0, p: 0, c: 0, f: 0 },
  );
  const r = (n: number) => Math.round(n);
  return (
    <div className={className}>
      {label && <div className="mb-1 text-xs font-medium text-muted-foreground">{label}</div>}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
        <span className="font-semibold text-primary">{r(totals.kcal)} ккал</span>
        <span className="text-muted-foreground">Б: {r(totals.p)}г</span>
        <span className="text-muted-foreground">В: {r(totals.c)}г</span>
        <span className="text-muted-foreground">М: {r(totals.f)}г</span>
      </div>
    </div>
  );
}
