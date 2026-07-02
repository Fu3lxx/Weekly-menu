import { RecipeForm } from "@/components/recipe-form";

export default function NewRecipePage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold tracking-tight">Нова рецепта</h1>
      <RecipeForm />
    </div>
  );
}
