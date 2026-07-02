import { notFound } from "next/navigation";
import { RecipeForm } from "@/components/recipe-form";
import { getRecipe } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function EditRecipePage({ params }: { params: { id: string } }) {
  const recipe = await getRecipe(params.id);
  if (!recipe) notFound();
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold tracking-tight">Редактирай рецепта</h1>
      <RecipeForm initial={recipe} />
    </div>
  );
}
