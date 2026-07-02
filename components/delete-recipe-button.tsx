"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { deleteRecipe } from "@/app/actions";

export function DeleteRecipeButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();
  return (
    <Button
      variant="destructive"
      size="sm"
      disabled={isPending}
      onClick={() => {
        if (!confirm("Сигурни ли сте, че искате да изтриете рецептата?")) return;
        startTransition(async () => {
          try {
            await deleteRecipe(id);
            toast.success("Рецептата е изтрита");
          } catch {
            toast.error("Грешка при изтриване");
          }
        });
      }}
    >
      <Trash2 className="mr-1 h-4 w-4" /> Изтрий
    </Button>
  );
}
