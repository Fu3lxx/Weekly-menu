"use client";

import { useState, useTransition } from "react";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RecipePickerSheet } from "@/components/recipe-picker-sheet";
import { removeMeal, updateMealServings, addMeal } from "@/app/actions";
import type { MealPlanEntryWithRecipe, MealType, Recipe } from "@/lib/types";

interface Props {
  date: string;
  mealType: MealType;
  meals: MealPlanEntryWithRecipe[];
  recipes: Recipe[];
}

export function MealSlot({ date, mealType, meals, recipes }: Props) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const [editing, setEditing] = useState<MealPlanEntryWithRecipe | null>(null);
  const [servingsDraft, setServingsDraft] = useState(1);
  const [, startTransition] = useTransition();

  const onPick = (recipe: Recipe, servings: number) => {
    startTransition(async () => {
      try {
        await addMeal({ date, meal_type: mealType, recipe_id: recipe.id, servings });
        toast.success(`Добавено: ${recipe.name}`);
      } catch (e) {
        toast.error("Грешка при добавяне");
      }
    });
  };

  const onSaveServings = () => {
    if (!editing) return;
    const e = editing;
    startTransition(async () => {
      try {
        await updateMealServings(e.id, servingsDraft);
        toast.success("Запазено");
        setEditing(null);
      } catch {
        toast.error("Грешка");
      }
    });
  };

  const onRemove = () => {
    if (!editing) return;
    const e = editing;
    startTransition(async () => {
      try {
        await removeMeal(e.id);
        toast.success("Премахнато");
        setEditing(null);
      } catch {
        toast.error("Грешка");
      }
    });
  };

  return (
    <>
      <div className="flex flex-col gap-1">
        {meals.map((m) => (
          <button
            key={m.id}
            onClick={() => {
              setEditing(m);
              setServingsDraft(m.servings);
            }}
            className="flex min-h-[44px] items-center justify-between gap-2 rounded-md bg-secondary px-2 py-1.5 text-left text-sm hover:bg-accent"
          >
            <span className="truncate">{m.recipe.name}</span>
            <span className="shrink-0 text-xs text-muted-foreground">×{m.servings}</span>
          </button>
        ))}
        <button
          onClick={() => setPickerOpen(true)}
          className="flex min-h-[44px] items-center justify-center gap-1 rounded-md border border-dashed text-xs text-muted-foreground hover:border-primary hover:text-primary"
        >
          <Plus className="h-4 w-4" /> Добави
        </button>
      </div>

      <RecipePickerSheet
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        recipes={recipes}
        onPick={onPick}
      />

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>{editing?.recipe.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label htmlFor="srv">Порции</Label>
              <Input
                id="srv"
                type="number"
                step="0.5"
                min="0.5"
                value={servingsDraft}
                onChange={(e) => setServingsDraft(Number(e.target.value))}
              />
            </div>
            <div className="flex justify-between gap-2">
              <Button variant="destructive" onClick={onRemove}>
                <Trash2 className="mr-1 h-4 w-4" /> Премахни
              </Button>
              <Button onClick={onSaveServings}>Запази</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
