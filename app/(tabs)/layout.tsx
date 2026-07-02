import { BottomNav } from "@/components/bottom-nav";

export default function TabsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="container flex-1 px-3 pb-24 pt-4 sm:px-6 sm:pb-8">{children}</main>
      <BottomNav />
    </div>
  );
}
