import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MealSlot } from "@/components/meal-slot";
import { MacrosSummary } from "@/components/macros-summary";
import { MEAL_TYPES, MEAL_TYPE_ICON } from "@/lib/constants";
import { bgWeekdayShort, formatDateBg, isToday, toIsoDate } from "@/lib/date-utils";
import type { MealPlanEntryWithRecipe, Recipe } from "@/lib/types";

interface Props {
  days: Date[];
  meals: MealPlanEntryWithRecipe[];
  recipes: Recipe[];
}

export function WeekGrid({ days, meals, recipes }: Props) {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {days.map((day) => {
        const iso = toIsoDate(day);
        const dayMeals = meals.filter((m) => m.date === iso);
        const today = isToday(day);
        return (
          <Card key={iso} className={today ? "border-primary ring-1 ring-primary" : ""}>
            <CardContent className="space-y-3 p-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold capitalize">{formatDateBg(day, "EEEE")}</div>
                  <div className="text-xs text-muted-foreground">{formatDateBg(day, "d MMM")}</div>
                </div>
                {today && <Badge>Днес</Badge>}
                {!today && (
                  <Badge variant="outline" className="uppercase">
                    {bgWeekdayShort(day)}
                  </Badge>
                )}
              </div>
              <div className="space-y-2">
                {MEAL_TYPES.map((mt) => {
                  const slotMeals = dayMeals.filter((m) => m.meal_type === mt);
                  return (
                    <div key={mt}>
                      <div className="mb-1 text-xs font-medium capitalize text-muted-foreground">
                        {MEAL_TYPE_ICON[mt]} {mt}
                      </div>
                      <MealSlot date={iso} mealType={mt} meals={slotMeals} recipes={recipes} />
                    </div>
                  );
                })}
              </div>
              <div className="border-t pt-2">
                <MacrosSummary meals={dayMeals} label="Дневно" />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
