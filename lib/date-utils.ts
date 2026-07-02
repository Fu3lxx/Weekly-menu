import {
  addDays,
  addWeeks,
  format,
  formatISO,
  getISODay,
  parseISO,
  startOfWeek,
} from "date-fns";
import { bg } from "date-fns/locale";

/** Returns Monday of the week containing the given date (ISO week, Mon-Sun). */
export function getWeekStart(date: Date): Date {
  return startOfWeek(date, { weekStartsOn: 1 });
}

/** Returns array of 7 Date objects, Monday through Sunday. */
export function getWeekDays(weekStart: Date): Date[] {
  return Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
}

/** Format a Date as YYYY-MM-DD (used in URLs and DB). */
export function toIsoDate(date: Date): string {
  return formatISO(date, { representation: "date" });
}

export function fromIsoDate(iso: string): Date {
  return parseISO(iso);
}

export function formatDateBg(date: Date, fmt = "EEEE, d MMMM"): string {
  return format(date, fmt, { locale: bg });
}

export function formatWeekRangeBg(weekStart: Date): string {
  const end = addDays(weekStart, 6);
  const sameMonth = weekStart.getMonth() === end.getMonth();
  const startFmt = sameMonth ? "d" : "d MMM";
  return `${format(weekStart, startFmt, { locale: bg })} – ${format(end, "d MMM yyyy", {
    locale: bg,
  })}`;
}

export function previousWeek(weekStart: Date): Date {
  return addWeeks(weekStart, -1);
}

export function nextWeek(weekStart: Date): Date {
  return addWeeks(weekStart, 1);
}

export function isToday(date: Date): boolean {
  const t = new Date();
  return (
    date.getFullYear() === t.getFullYear() &&
    date.getMonth() === t.getMonth() &&
    date.getDate() === t.getDate()
  );
}

export function bgWeekdayShort(date: Date): string {
  // Bulgarian short names Mon-Sun
  const names = ["пн", "вт", "ср", "чт", "пт", "сб", "нд"];
  return names[getISODay(date) - 1];
}
