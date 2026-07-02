import { describe, expect, it } from "vitest";
import { aggregateShoppingList } from "./shopping-aggregator";
import type { Ingredient } from "./types";

const ing = (
  name: string,
  quantity: number,
  unit: Ingredient["unit"],
  category: Ingredient["category"] = "плодове и зеленчуци",
): Ingredient => ({
  id: `${name}-${Math.random()}`,
  recipe_id: "r",
  name,
  quantity,
  unit,
  category,
});

describe("aggregateShoppingList", () => {
  it("sums same ingredient + unit across recipes", () => {
    const result = aggregateShoppingList([
      {
        servings: 4,
        recipe: { id: "r1", name: "Шопска", default_servings: 4 },
        ingredients: [ing("лук", 100, "g")],
      },
      {
        servings: 6,
        recipe: { id: "r2", name: "Боб", default_servings: 6 },
        ingredients: [ing("лук", 200, "g")],
      },
    ]);
    expect(result["плодове и зеленчуци"]).toHaveLength(1);
    const item = result["плодове и зеленчуци"][0];
    expect(item.name).toBe("лук");
    expect(item.quantity).toBe(300);
    expect(item.sources).toEqual(["Шопска", "Боб"]);
  });

  it("scales quantities by servings/default_servings", () => {
    const result = aggregateShoppingList([
      {
        servings: 2, // half of default
        recipe: { id: "r1", name: "Мусака", default_servings: 4 },
        ingredients: [ing("картофи", 1000, "g")],
      },
    ]);
    expect(result["плодове и зеленчуци"][0].quantity).toBe(500);
  });

  it("keeps different units separate", () => {
    const result = aggregateShoppingList([
      {
        servings: 4,
        recipe: { id: "r1", name: "A", default_servings: 4 },
        ingredients: [ing("олио", 100, "ml", "бакалия"), ing("олио", 2, "с.л.", "бакалия")],
      },
    ]);
    expect(result["бакалия"]).toHaveLength(2);
  });

  it("groups by category", () => {
    const result = aggregateShoppingList([
      {
        servings: 4,
        recipe: { id: "r", name: "Test", default_servings: 4 },
        ingredients: [
          ing("мляко", 500, "ml", "млечни"),
          ing("домат", 200, "g", "плодове и зеленчуци"),
        ],
      },
    ]);
    expect(Object.keys(result).sort()).toEqual(["млечни", "плодове и зеленчуци"].sort());
  });
});
