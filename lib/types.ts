export type Unit = "g" | "kg" | "ml" | "l" | "бр" | "с.л." | "ч.л." | "щипка";

export type MealType = "закуска" | "обяд" | "вечеря" | "снакс";

export type IngredientCategory =
  | "млечни"
  | "месо и риба"
  | "плодове и зеленчуци"
  | "подправки"
  | "бакалия"
  | "замразени"
  | "напитки"
  | "други";

export interface Recipe {
  id: string;
  name: string;
  image_url: string | null;
  prep_time_minutes: number | null;
  instructions: string | null;
  default_servings: number;
  kcal_per_serving: number | null;
  protein_per_serving: number | null;
  carbs_per_serving: number | null;
  fat_per_serving: number | null;
  tags: string[];
  created_at: string;
}

export interface Ingredient {
  id: string;
  recipe_id: string;
  name: string;
  quantity: number;
  unit: Unit;
  category: IngredientCategory;
}

export interface MealPlanEntry {
  id: string;
  date: string;
  meal_type: MealType;
  recipe_id: string;
  servings: number;
  position?: number;
}

export interface MealPlanEntryWithRecipe extends MealPlanEntry {
  recipe: Recipe;
}

export interface RecipeWithIngredients extends Recipe {
  ingredients: Ingredient[];
}
