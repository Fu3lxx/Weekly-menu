"use client";

import { useEffect, useMemo, useState } from "react";
import { Share2, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { CATEGORIES, CATEGORY_ICON } from "@/lib/constants";
import type { IngredientCategory } from "@/lib/types";
import {
  type ShoppingItem,
  shoppingItemKey,
} from "@/lib/shopping-aggregator";

interface Props {
  weekStartIso: string;
  grouped: Record<IngredientCategory, ShoppingItem[]>;
}

export function ShoppingListClient({ weekStartIso, grouped }: Props) {
  const storageKey = `shopping-checks:${weekStartIso}`;
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) setChecked(JSON.parse(raw));
    } catch {}
  }, [storageKey]);

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(checked));
    } catch {}
  }, [storageKey, checked]);

  const toggle = (key: string) => setChecked((c) => ({ ...c, [key]: !c[key] }));
  const clear = () => {
    setChecked({});
    toast.success("Отметките са изчистени");
  };

  const flatText = useMemo(() => {
    const lines: string[] = [`Списък за пазаруване (${weekStartIso}):`, ""];
    for (const cat of CATEGORIES) {
      const items = grouped[cat];
      if (!items || items.length === 0) continue;
      lines.push(`${CATEGORY_ICON[cat]} ${cat.toUpperCase()}`);
      for (const it of items) {
        lines.push(`  - ${it.name}: ${formatQty(it.quantity)} ${it.unit}`);
      }
      lines.push("");
    }
    return lines.join("\n");
  }, [grouped, weekStartIso]);

  const share = async () => {
    if (typeof navigator !== "undefined" && (navigator as any).share) {
      try {
        await (navigator as any).share({ title: "Списък за пазаруване", text: flatText });
      } catch {}
    } else {
      try {
        await navigator.clipboard.writeText(flatText);
        toast.success("Копирано в клипборда");
      } catch {
        toast.error("Споделянето не е достъпно");
      }
    }
  };

  const nonEmptyCats = CATEGORIES.filter((c) => grouped[c]?.length);
  const allEmpty = nonEmptyCats.length === 0;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap justify-end gap-2">
        <Button variant="outline" onClick={clear} disabled={allEmpty}>
          <RotateCcw className="mr-1 h-4 w-4" /> Изчисти отметките
        </Button>
        <Button onClick={share} disabled={allEmpty}>
          <Share2 className="mr-1 h-4 w-4" /> Сподели
        </Button>
      </div>

      {allEmpty && (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            Все още няма планирани ястия за тази седмица.
          </CardContent>
        </Card>
      )}

      {nonEmptyCats.map((cat) => {
        const items = grouped[cat];
        const isCollapsed = collapsed[cat];
        const total = items.length;
        const done = items.filter((i) => checked[shoppingItemKey(i)]).length;
        return (
          <Card key={cat}>
            <CardContent className="p-0">
              <button
                onClick={() => setCollapsed((c) => ({ ...c, [cat]: !c[cat] }))}
                className="flex w-full items-center justify-between px-4 py-3 text-left font-semibold"
              >
                <span>
                  {CATEGORY_ICON[cat]} {cat}
                </span>
                <span className="text-xs text-muted-foreground">
                  {done}/{total}
                </span>
              </button>
              {!isCollapsed && (
                <ul className="divide-y border-t">
                  {items.map((it) => {
                    const key = shoppingItemKey(it);
                    const isChecked = !!checked[key];
                    return (
                      <li key={key} className="flex items-center gap-3 px-4 py-3">
                        <Checkbox
                          checked={isChecked}
                          onCheckedChange={() => toggle(key)}
                          id={key}
                        />
                        <label
                          htmlFor={key}
                          className={`flex-1 cursor-pointer text-sm ${
                            isChecked ? "text-muted-foreground line-through" : ""
                          }`}
                        >
                          <div className="font-medium">{it.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {formatQty(it.quantity)} {it.unit} · {it.sources.join(", ")}
                          </div>
                        </label>
                      </li>
                    );
                  })}
                </ul>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

function formatQty(n: number) {
  if (Number.isInteger(n)) return String(n);
  return n.toFixed(2).replace(/\.?0+$/, "");
}
