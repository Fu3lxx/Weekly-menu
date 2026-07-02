import type { IngredientCategory, MealType, Unit } from "./types";

export const MEAL_TYPES: MealType[] = ["закуска", "обяд", "вечеря", "снакс"];

export const MEAL_TYPE_ICON: Record<MealType, string> = {
  закуска: "🥐",
  обяд: "🍲",
  вечеря: "🍽️",
  снакс: "🍎",
};

export const UNITS: Unit[] = ["g", "kg", "ml", "l", "бр", "с.л.", "ч.л.", "щипка"];

export const CATEGORIES: IngredientCategory[] = [
  "млечни",
  "месо и риба",
  "плодове и зеленчуци",
  "подправки",
  "бакалия",
  "замразени",
  "напитки",
  "други",
];

export const CATEGORY_ICON: Record<IngredientCategory, string> = {
  млечни: "🥛",
  "месо и риба": "🥩",
  "плодове и зеленчуци": "🥬",
  подправки: "🌿",
  бакалия: "🌾",
  замразени: "🧊",
  напитки: "🥤",
  други: "📦",
};
