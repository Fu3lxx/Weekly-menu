import { addDays, parseISO } from "date-fns";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { WeekHeader } from "@/components/week-header";
import { WeekGrid } from "@/components/week-grid";
import { MacrosSummary } from "@/components/macros-summary";
import { CopyPreviousWeekButton } from "@/components/copy-previous-week-button";
import { getWeekDays, toIsoDate } from "@/lib/date-utils";
import { listMealsForWeek, listRecipes } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function WeekPage({ params }: { params: { isoDate: string } }) {
  const weekStart = parseISO(params.isoDate);
  const weekEnd = addDays(weekStart, 6);
  const days = getWeekDays(weekStart);
  const [meals, recipes] = await Promise.all([
    listMealsForWeek(toIsoDate(weekStart), toIsoDate(weekEnd)),
    listRecipes(),
  ]);

  return (
    <div className="space-y-4">
      <WeekHeader weekStartIso={params.isoDate} />

      <Card>
        <CardContent className="flex flex-wrap items-center justify-between gap-3 p-4">
          <MacrosSummary meals={meals} label="Седмични общо" />
          <div className="flex flex-wrap gap-2">
            <CopyPreviousWeekButton weekStartIso={params.isoDate} />
            <Button asChild size="sm">
              <Link href={`/shopping/${params.isoDate}`}>
                <ShoppingCart className="mr-1 h-4 w-4" /> Списък за пазаруване
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {recipes.length === 0 ? (
        <Card>
          <CardContent className="space-y-3 p-8 text-center">
            <p className="text-muted-foreground">Все още нямате рецепти.</p>
            <Button asChild>
              <Link href="/recipes/new">Създай първата</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <WeekGrid days={days} meals={meals} recipes={recipes} />
      )}
    </div>
  );
}
