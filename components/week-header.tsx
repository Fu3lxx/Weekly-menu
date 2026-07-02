"use client";

import { useRouter } from "next/navigation";
import { addDays, parseISO } from "date-fns";
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { formatWeekRangeBg, getWeekStart, toIsoDate } from "@/lib/date-utils";

export function WeekHeader({ weekStartIso }: { weekStartIso: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const weekStart = parseISO(weekStartIso);

  const go = (date: Date) => router.push(`/week/${toIsoDate(getWeekStart(date))}`);

  return (
    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Седмично Меню</h1>
        <p className="text-sm text-muted-foreground">Седмица {formatWeekRangeBg(weekStart)}</p>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={() => go(addDays(weekStart, -7))}>
          <ChevronLeft className="mr-1 h-4 w-4" /> Предишна
        </Button>
        <Button variant="outline" size="sm" onClick={() => go(new Date())}>
          Днес
        </Button>
        <Button variant="outline" size="sm" onClick={() => go(addDays(weekStart, 7))}>
          Следваща <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="icon" aria-label="Избери дата">
              <CalendarDays className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="w-auto">
            <DialogHeader>
              <DialogTitle>Избери седмица</DialogTitle>
            </DialogHeader>
            <Calendar
              mode="single"
              selected={weekStart}
              onSelect={(d) => {
                if (d) {
                  setOpen(false);
                  go(d);
                }
              }}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
