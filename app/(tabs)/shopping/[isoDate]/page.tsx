import { addDays, parseISO } from "date-fns";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ShoppingListClient } from "@/components/shopping-list-client";
import { aggregateShoppingList } from "@/lib/shopping-aggregator";
import { formatWeekRangeBg, toIsoDate } from "@/lib/date-utils";
import { listMealsForWeekWithIngredients } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function ShoppingPage({ params }: { params: { isoDate: string } }) {
  const weekStart = parseISO(params.isoDate);
  const weekEnd = addDays(weekStart, 6);
  const meals = await listMealsForWeekWithIngredients(toIsoDate(weekStart), toIsoDate(weekEnd));

  const grouped = aggregateShoppingList(
    meals.map((m) => ({
      servings: m.servings,
      recipe: {
        id: m.recipe.id,
        name: m.recipe.name,
        default_servings: m.recipe.default_servings,
      },
      ingredients: m.ingredients,
    })),
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Списък за пазаруване</h1>
          <p className="text-sm text-muted-foreground">{formatWeekRangeBg(weekStart)}</p>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href={`/week/${params.isoDate}`}>
            <ChevronLeft className="mr-1 h-4 w-4" /> Към седмицата
          </Link>
        </Button>
      </div>
      <ShoppingListClient weekStartIso={params.isoDate} grouped={grouped} />
    </div>
  );
}
