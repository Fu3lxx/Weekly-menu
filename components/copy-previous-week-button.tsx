"use client";

import { useTransition } from "react";
import { Copy } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { copyFromPreviousWeek } from "@/app/actions";

export function CopyPreviousWeekButton({ weekStartIso }: { weekStartIso: string }) {
  const [isPending, startTransition] = useTransition();
  return (
    <Button
      variant="outline"
      size="sm"
      disabled={isPending}
      onClick={() =>
        startTransition(async () => {
          try {
            const n = await copyFromPreviousWeek(weekStartIso);
            if (n > 0) toast.success(`Копирани са ${n} ястия`);
            else toast.info("Няма ястия за копиране");
          } catch {
            toast.error("Грешка при копиране");
          }
        })
      }
    >
      <Copy className="mr-1 h-4 w-4" />
      {isPending ? "Копиране..." : "Копирай от предишна седмица"}
    </Button>
  );
}
