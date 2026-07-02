import "server-only";
import { getServerSupabase } from "./supabase";
import type {
  Ingredient,
  MealPlanEntryWithRecipe,
  Recipe,
  RecipeWithIngredients,
} from "./types";

export async function listRecipes(): Promise<Recipe[]> {
  const supabase = getServerSupabase();
  const { data, error } = await supabase
    .from("recipes")
    .select("*")
    .order("name", { ascending: true });
  if (error) throw error;
  return (data ?? []) as Recipe[];
}

export async function getRecipe(id: string): Promise<RecipeWithIngredients | null> {
  const supabase = getServerSupabase();
  const { data, error } = await supabase
    .from("recipes")
    .select("*, ingredients(*)")
    .eq("id", id)
    .single();
  if (error) {
    if (error.code === "PGRST116") return null;
    throw error;
  }
  return data as RecipeWithIngredients;
}

export async function listMealsForWeek(
  startIso: string,
  endIso: string,
): Promise<MealPlanEntryWithRecipe[]> {
  const supabase = getServerSupabase();
  const { data, error } = await supabase
    .from("meal_plan")
    .select("*, recipe:recipes(*)")
    .gte("date", startIso)
    .lte("date", endIso)
    .order("date", { ascending: true })
    .order("position", { ascending: true });
  if (error) throw error;
  return (data ?? []) as MealPlanEntryWithRecipe[];
}

export async function listMealsForWeekWithIngredients(
  startIso: string,
  endIso: string,
): Promise<Array<MealPlanEntryWithRecipe & { ingredients: Ingredient[] }>> {
  const supabase = getServerSupabase();
  // order by date then position so meals within the same day are returned in the intended order
  // (position column may be new; if absent the DB will still return results)
  const ordered = await supabase
    .from("meal_plan")
    .select("*, recipe:recipes(*, ingredients(*))")
    .gte("date", startIso)
    .lte("date", endIso)
    .order("date", { ascending: true })
    .order("position", { ascending: true });

  if (ordered.error) throw ordered.error;
  const rows = ordered.data;
  return (rows ?? []).map((row: any) => ({
    ...row,
    ingredients: row.recipe?.ingredients ?? [],
  }));
}
