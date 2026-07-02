import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Седмично Меню",
  description: "Личен седмичен планер за хранене и пазаруване",
  manifest: "/manifest.json",
  applicationName: "Седмично Меню",
  appleWebApp: { capable: true, statusBarStyle: "default", title: "Меню" },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#d96b3a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="bg" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
