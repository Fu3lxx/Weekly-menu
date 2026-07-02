"use client";

import { useRouter } from "next/navigation";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTransition } from "react";
import { Plus, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CATEGORIES, UNITS } from "@/lib/constants";
import { saveRecipe } from "@/app/actions";
import type { RecipeWithIngredients } from "@/lib/types";

const schema = z.object({
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
  ingredients: z
    .array(
      z.object({
        name: z.string().min(1, "Името е задължително"),
        quantity: z.coerce.number().positive("Количеството трябва да е положително"),
        unit: z.enum(UNITS as [string, ...string[]]),
        category: z.enum(CATEGORIES as [string, ...string[]]),
      }),
    )
    .min(1, "Поне една съставка"),
});

type FormValues = z.infer<typeof schema>;

export function RecipeForm({ initial }: { initial?: RecipeWithIngredients }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: initial
      ? {
          name: initial.name,
          image_url: initial.image_url ?? "",
          prep_time_minutes: initial.prep_time_minutes ?? undefined,
          default_servings: initial.default_servings,
          instructions: initial.instructions ?? "",
          kcal_per_serving: initial.kcal_per_serving ?? undefined,
          protein_per_serving: initial.protein_per_serving ?? undefined,
          carbs_per_serving: initial.carbs_per_serving ?? undefined,
          fat_per_serving: initial.fat_per_serving ?? undefined,
          tags: initial.tags,
          ingredients: initial.ingredients.map((i) => ({
            name: i.name,
            quantity: i.quantity,
            unit: i.unit,
            category: i.category,
          })),
        }
      : {
          name: "",
          image_url: "",
          default_servings: 4,
          tags: [],
          ingredients: [{ name: "", quantity: 1, unit: "g", category: "плодове и зеленчуци" }],
        },
  });

  const { register, control, handleSubmit, watch, setValue, formState } = form;
  const ingredients = useFieldArray({ control, name: "ingredients" });
  const tags = watch("tags");

  const addTag = (raw: string) => {
    const v = raw.trim();
    if (!v) return;
    if (!tags.includes(v)) setValue("tags", [...tags, v], { shouldDirty: true });
  };
  const removeTag = (t: string) => setValue("tags", tags.filter((x) => x !== t), { shouldDirty: true });

  const onSubmit = (values: FormValues) => {
    startTransition(async () => {
      try {
        const id = await saveRecipe(initial?.id ?? null, values);
        toast.success(initial ? "Рецептата е обновена" : "Рецептата е създадена");
        router.push(`/recipes/${id}`);
        router.refresh();
      } catch (e) {
        toast.error("Грешка при запазване");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardContent className="space-y-4 p-4">
          <div>
            <Label htmlFor="name">Име *</Label>
            <Input id="name" {...register("name")} />
            {formState.errors.name && (
              <p className="mt-1 text-xs text-destructive">{formState.errors.name.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="image_url">Снимка (URL)</Label>
            <Input id="image_url" {...register("image_url")} placeholder="https://..." />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="prep">Време (мин)</Label>
              <Input id="prep" type="number" {...register("prep_time_minutes")} />
            </div>
            <div>
              <Label htmlFor="srv">Порции *</Label>
              <Input id="srv" type="number" {...register("default_servings")} />
            </div>
          </div>
          <div>
            <Label htmlFor="instr">Приготвяне</Label>
            <Textarea id="instr" rows={6} {...register("instructions")} />
          </div>
          <div>
            <Label>Тагове</Label>
            <div className="mb-2 flex flex-wrap gap-1">
              {tags.map((t) => (
                <Badge key={t} variant="secondary" className="gap-1">
                  {t}
                  <button type="button" onClick={() => removeTag(t)} aria-label="Премахни">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <Input
              placeholder="Натисни Enter за добавяне"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addTag((e.target as HTMLInputElement).value);
                  (e.target as HTMLInputElement).value = "";
                }
              }}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-4 p-4">
          <div className="font-semibold">Хранителни стойности (на порция)</div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div>
              <Label htmlFor="kcal">Калории</Label>
              <Input id="kcal" type="number" step="0.1" {...register("kcal_per_serving")} />
            </div>
            <div>
              <Label htmlFor="p">Белтъци (г)</Label>
              <Input id="p" type="number" step="0.1" {...register("protein_per_serving")} />
            </div>
            <div>
              <Label htmlFor="c">Въглехидрати (г)</Label>
              <Input id="c" type="number" step="0.1" {...register("carbs_per_serving")} />
            </div>
            <div>
              <Label htmlFor="f">Мазнини (г)</Label>
              <Input id="f" type="number" step="0.1" {...register("fat_per_serving")} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-3 p-4">
          <div className="flex items-center justify-between">
            <div className="font-semibold">Съставки *</div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                ingredients.append({
                  name: "",
                  quantity: 1,
                  unit: "g",
                  category: "плодове и зеленчуци",
                })
              }
            >
              <Plus className="mr-1 h-4 w-4" /> Добави
            </Button>
          </div>
          {ingredients.fields.map((field, idx) => (
            <div key={field.id} className="grid grid-cols-12 gap-2">
              <Input
                className="col-span-12 sm:col-span-4"
                placeholder="Име"
                {...register(`ingredients.${idx}.name`)}
              />
              <Input
                className="col-span-4 sm:col-span-2"
                type="number"
                step="0.01"
                placeholder="Кол."
                {...register(`ingredients.${idx}.quantity`)}
              />
              <div className="col-span-4 sm:col-span-2">
                <Select
                  value={watch(`ingredients.${idx}.unit`)}
                  onValueChange={(v) =>
                    setValue(`ingredients.${idx}.unit`, v as any, { shouldDirty: true })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {UNITS.map((u) => (
                      <SelectItem key={u} value={u}>
                        {u}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-3 sm:col-span-3">
                <Select
                  value={watch(`ingredients.${idx}.category`)}
                  onValueChange={(v) =>
                    setValue(`ingredients.${idx}.category`, v as any, { shouldDirty: true })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="col-span-1"
                onClick={() => ingredients.remove(idx)}
                aria-label="Премахни съставка"
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ))}
          {formState.errors.ingredients && (
            <p className="text-xs text-destructive">
              {formState.errors.ingredients.message ||
                "Моля попълнете коректно всички съставки"}
            </p>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Отказ
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Запазване..." : "Запази"}
        </Button>
      </div>
    </form>
  );
}
