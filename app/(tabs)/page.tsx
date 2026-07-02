import { redirect } from "next/navigation";
import { getWeekStart, toIsoDate } from "@/lib/date-utils";

export default function Home() {
  redirect(`/week/${toIsoDate(getWeekStart(new Date()))}`);
}
