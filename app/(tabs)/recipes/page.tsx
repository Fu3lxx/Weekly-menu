import { listRecipes } from "@/lib/queries";
import { RecipesBrowser } from "@/components/recipes-browser";

export const dynamic = "force-dynamic";

export default async function RecipesPage() {
  const recipes = await listRecipes();
  return <RecipesBrowser recipes={recipes} />;
}
