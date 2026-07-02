"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { addDays, parseISO } from "date-fns";
import { z } from "zod";
import { getServerSupabase } from "@/lib/supabase";
import { CATEGORIES, MEAL_TYPES, UNITS } from "@/lib/constants";
import { toIsoDate } from "@/lib/date-utils";

const ingredientSchema = z.object({
  name: z.string().min(1, "Името е задължително"),
  quantity: z.coerce.number().positive("Количеството трябва да е положително"),
  unit: z.enum(UNITS as [string, ...string[]]),
  category: z.enum(CATEGORIES as [string, ...string[]]),
});

const recipeSchema = z.object({
  name: z.string().min(1, "Името е задължително"),
  image_url: z.string().url("Невалиден URL").optional().or(z.literal("")),
  prep_time_minutes: z.coerce.number().int().nonnegative().optional().nullable(),
  default_servings: z.coerce.number().int().positive("Поне 1 порция"),
  instructions: z.string().optional(),
  kcal_per_serving: z.coerce.number().nonnegative().optional().nullable(),
  protein_per_serving: z.coerce.number().nonnegative().optional().nullable(),
  carbs_per_serving: z.coerce.number().nonnegative().optional().nullable(),
  fat_per_serving: z.coerce.number().nonnegative().optional().nullable(),
  tags: z.array(z.string()).default([]),
  ingredients: z.array(ingredientSchema).min(1, "Поне една съставка"),
});

export type RecipeFormInput = z.infer<typeof recipeSchema>;

export async function saveRecipe(id: string | null, input: RecipeFormInput) {
  const parsed = recipeSchema.parse(input);
  const supabase = getServerSupabase();

  const recipeRow = {
    name: parsed.name,
    image_url: parsed.image_url || null,
    prep_time_minutes: parsed.prep_time_minutes ?? null,
    default_servings: parsed.default_servings,
    instructions: parsed.instructions || null,
    kcal_per_serving: parsed.kcal_per_serving ?? null,
    protein_per_serving: parsed.protein_per_serving ?? null,
    carbs_per_serving: parsed.carbs_per_serving ?? null,
    fat_per_serving: parsed.fat_per_serving ?? null,
    tags: parsed.tags,
  };

  let recipeId = id;
  if (id) {
    const { error } = await supabase.from("recipes").update(recipeRow).eq("id", id);
    if (error) throw error;
    await supabase.from("ingredients").delete().eq("recipe_id", id);
  } else {
    const { data, error } = await supabase
      .from("recipes")
      .insert(recipeRow)
      .select("id")
      .single();
    if (error) throw error;
    recipeId = data.id as string;
  }

  const ingRows = parsed.ingredients.map((i) => ({ ...i, recipe_id: recipeId! }));
  const { error: ingErr } = await supabase.from("ingredients").insert(ingRows);
  if (ingErr) throw ingErr;

  revalidatePath("/recipes");
  revalidatePath(`/recipes/${recipeId}`);
  return recipeId!;
}

export async function deleteRecipe(id: string) {
  const supabase = getServerSupabase();
  const { error } = await supabase.from("recipes").delete().eq("id", id);
  if (error) throw error;
  revalidatePath("/recipes");
  redirect("/recipes");
}

const addMealSchema = z.object({
  date: z.string(),
  meal_type: z.enum(MEAL_TYPES as [string, ...string[]]),
  recipe_id: z.string().uuid(),
  servings: z.coerce.number().positive().default(1),
});

export async function addMeal(input: z.infer<typeof addMealSchema>) {
  const parsed = addMealSchema.parse(input);
  const supabase = getServerSupabase();

  // determine next position for this date + meal_type
  const { data: lastRows, error: selErr } = await supabase
    .from("meal_plan")
    .select("position")
    .eq("date", parsed.date)
    .eq("meal_type", parsed.meal_type)
    .order("position", { ascending: false })
    .limit(1);
  if (selErr) throw selErr;
  const maxPos = lastRows && lastRows.length > 0 ? Number(lastRows[0].position ?? 0) : 0;
  const row = { ...parsed, position: maxPos + 1 };

  const { error } = await supabase
    .from("meal_plan")
    .upsert(row, { onConflict: "date,meal_type,recipe_id" });
  if (error) throw error;
  revalidatePath("/", "layout");
}

export async function updateMealOrder(ids: string[]) {
  const supabase = getServerSupabase();
  // update positions to match order in ids array
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];
    const { error } = await supabase.from("meal_plan").update({ position: i + 1 }).eq("id", id);
    if (error) throw error;
  }
  revalidatePath("/", "layout");
}

export async function updateMealServings(id: string, servings: number) {
  const supabase = getServerSupabase();
  const { error } = await supabase.from("meal_plan").update({ servings }).eq("id", id);
  if (error) throw error;
  revalidatePath("/", "layout");
}

export async function removeMeal(id: string) {
  const supabase = getServerSupabase();
  const { error } = await supabase.from("meal_plan").delete().eq("id", id);
  if (error) throw error;
  revalidatePath("/", "layout");
}

export async function copyFromPreviousWeek(weekStartIso: string) {
  const supabase = getServerSupabase();
  const target = parseISO(weekStartIso);
  const prevStart = addDays(target, -7);
  const prevEnd = addDays(target, -1);
  const { data, error } = await supabase
    .from("meal_plan")
    .select("date, meal_type, recipe_id, servings, position")
    .gte("date", toIsoDate(prevStart))
    .lte("date", toIsoDate(prevEnd));
  if (error) throw error;
  if (!data || data.length === 0) return 0;

  const rows = data.map((r) => {
    const oldDate = parseISO(r.date);
    const newDate = addDays(oldDate, 7);
    return { ...r, date: toIsoDate(newDate) };
  });
  const { error: insErr } = await supabase
    .from("meal_plan")
    .upsert(rows, { onConflict: "date,meal_type,recipe_id" });
  if (insErr) throw insErr;
  revalidatePath("/", "layout");
  return rows.length;
}
