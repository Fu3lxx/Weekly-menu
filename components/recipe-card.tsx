import Link from "next/link";
import { Clock, Flame } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Recipe } from "@/lib/types";

export function RecipeCard({ recipe }: { recipe: Recipe }) {
  return (
    <Link href={`/recipes/${recipe.id}`} className="block">
      <Card className="h-full transition-shadow hover:shadow-md">
        {recipe.image_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={recipe.image_url}
            alt={recipe.name}
            className="h-40 w-full rounded-t-lg object-cover"
          />
        )}
        <CardContent className="space-y-2 p-3">
          <div className="font-semibold">{recipe.name}</div>
          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            {recipe.prep_time_minutes != null && (
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {recipe.prep_time_minutes} мин
              </span>
            )}
            {recipe.kcal_per_serving != null && (
              <span className="flex items-center gap-1">
                <Flame className="h-3 w-3" />
                {Math.round(recipe.kcal_per_serving)} ккал/порция
              </span>
            )}
          </div>
          {recipe.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {recipe.tags.slice(0, 3).map((t) => (
                <Badge key={t} variant="secondary" className="text-[10px]">
                  {t}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
