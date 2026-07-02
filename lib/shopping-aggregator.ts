import type { Ingredient, IngredientCategory, Recipe, Unit } from "./types";

export interface ShoppingItem {
  name: string;
  unit: Unit;
  category: IngredientCategory;
  quantity: number;
  sources: string[]; // recipe names that contributed
}

interface MealWithRecipe {
  servings: number;
  recipe: Pick<Recipe, "id" | "name" | "default_servings">;
  ingredients: Ingredient[];
}

/**
 * Aggregate ingredients across all meals for a week.
 * Each ingredient is scaled by (planned servings / recipe default servings).
 * Items with the same (name, unit) are summed. Output is grouped by category.
 */
export function aggregateShoppingList(
  meals: MealWithRecipe[],
): Record<IngredientCategory, ShoppingItem[]> {
  const map = new Map<string, ShoppingItem>();

  for (const meal of meals) {
    const factor =
      meal.recipe.default_servings > 0
        ? meal.servings / meal.recipe.default_servings
        : 1;
    for (const ing of meal.ingredients) {
      const key = `${ing.name.trim().toLowerCase()}|${ing.unit}`;
      const scaled = ing.quantity * factor;
      const existing = map.get(key);
      if (existing) {
        existing.quantity += scaled;
        if (!existing.sources.includes(meal.recipe.name)) {
          existing.sources.push(meal.recipe.name);
        }
      } else {
        map.set(key, {
          name: ing.name,
          unit: ing.unit,
          category: ing.category,
          quantity: scaled,
          sources: [meal.recipe.name],
        });
      }
    }
  }

  const grouped: Record<string, ShoppingItem[]> = {};
  for (const item of map.values()) {
    item.quantity = Math.round(item.quantity * 100) / 100;
    (grouped[item.category] ??= []).push(item);
  }
  for (const key of Object.keys(grouped)) {
    grouped[key].sort((a, b) => a.name.localeCompare(b.name, "bg"));
  }
  return grouped as Record<IngredientCategory, ShoppingItem[]>;
}

/** Stable key for localStorage check state. */
export function shoppingItemKey(item: Pick<ShoppingItem, "name" | "unit">): string {
  return `${item.name.trim().toLowerCase()}|${item.unit}`;
}
