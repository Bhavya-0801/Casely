import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";
import TopNav from "@/components/layout/TopNav";

export const metadata: Metadata = {
  title: "Casely — AI Crime Network Intelligence Platform",
  description: "Every Case Has a Network. Evidence-grounded criminal investigation intelligence platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-[#000000] text-[#F4F7F2] min-h-screen antialiased flex flex-col">
        <Suspense fallback={<div className="w-64 bg-[#050705] fixed h-screen" />}>
          <Sidebar />
        </Suspense>
        <div className="flex-1 flex flex-col">
          <Suspense fallback={<div className="h-14 bg-[#050705] ml-64" />}>
            <TopNav />
          </Suspense>
          <main className="ml-64 p-6 flex-1 bg-transparent">
            <Suspense fallback={<div className="p-8 text-[#9BB095]">Loading...</div>}>
              {children}
            </Suspense>
          </main>
        </div>
      </body>
    </html>
  );
}
