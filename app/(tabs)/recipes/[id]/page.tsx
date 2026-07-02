import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock, Flame, Users, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DeleteRecipeButton } from "@/components/delete-recipe-button";
import { CATEGORY_ICON } from "@/lib/constants";
import { getRecipe } from "@/lib/queries";
import type { IngredientCategory } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function RecipeDetailPage({ params }: { params: { id: string } }) {
  const recipe = await getRecipe(params.id);
  if (!recipe) notFound();

  const grouped = recipe.ingredients.reduce<Record<string, typeof recipe.ingredients>>((acc, i) => {
    (acc[i.category] ??= []).push(i);
    return acc;
  }, {});

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{recipe.name}</h1>
          <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            {recipe.prep_time_minutes != null && (
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" /> {recipe.prep_time_minutes} мин
              </span>
            )}
            <span className="flex items-center gap-1">
              <Users className="h-4 w-4" /> {recipe.default_servings} порции
            </span>
            {recipe.kcal_per_serving != null && (
              <span className="flex items-center gap-1">
                <Flame className="h-4 w-4" /> {Math.round(recipe.kcal_per_serving)} ккал/порция
              </span>
            )}
          </div>
          {recipe.tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {recipe.tags.map((t) => (
                <Badge key={t} variant="secondary">
                  {t}
                </Badge>
              ))}
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <Button asChild size="sm" variant="outline">
            <Link href={`/recipes/${recipe.id}/edit`}>
              <Pencil className="mr-1 h-4 w-4" /> Редактирай
            </Link>
          </Button>
          <DeleteRecipeButton id={recipe.id} />
        </div>
      </div>

      {recipe.image_url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={recipe.image_url}
          alt={recipe.name}
          className="max-h-64 w-full rounded-lg object-cover"
        />
      )}

      <Card>
        <CardContent className="space-y-3 p-4">
          <div className="font-semibold">Съставки</div>
          {(Object.keys(grouped) as IngredientCategory[]).map((cat) => (
            <div key={cat}>
              <div className="text-xs font-medium text-muted-foreground">
                {CATEGORY_ICON[cat]} {cat}
              </div>
              <ul className="ml-4 list-disc text-sm">
                {grouped[cat].map((i) => (
                  <li key={i.id}>
                    {i.name} — {i.quantity} {i.unit}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </CardContent>
      </Card>

      {recipe.instructions && (
        <Card>
          <CardContent className="space-y-2 p-4">
            <div className="font-semibold">Приготвяне</div>
            <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
              {recipe.instructions}
            </pre>
          </CardContent>
        </Card>
      )}

      {(recipe.protein_per_serving != null ||
        recipe.carbs_per_serving != null ||
        recipe.fat_per_serving != null) && (
        <Card>
          <CardContent className="p-4">
            <div className="mb-2 font-semibold">Хранителни стойности на порция</div>
            <div className="flex flex-wrap gap-4 text-sm">
              {recipe.protein_per_serving != null && (
                <div>Белтъци: {recipe.protein_per_serving}г</div>
              )}
              {recipe.carbs_per_serving != null && (
                <div>Въглехидрати: {recipe.carbs_per_serving}г</div>
              )}
              {recipe.fat_per_serving != null && <div>Мазнини: {recipe.fat_per_serving}г</div>}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
