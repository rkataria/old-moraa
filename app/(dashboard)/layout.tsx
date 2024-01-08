"use client";

import { Montserrat } from "next/font/google";
import { HomeIcon } from "@heroicons/react/24/outline";

import { useAuth } from "@/hooks/useAuth";
import { UseQueryProvider } from "@/utils/use-query-provider";
import { HeaderComponent } from "@/components/partials/header";
import { cn } from "@/lib/utils";
import '../globals.css'
import { SidebarComponent } from "@/components/partials/sidebar";

const font = Montserrat({
  subsets: ["latin"],
  style: "normal",
  weight: ["400", "500", "600", "700"],
});

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { logout } = useAuth();

  return (
    <html lang="en" className={cn("h-full bg-white", font.className)}>
      <body className="h-full w-full scrollbar-thin scrollbar-thumb-indigo-700 scrollbar-track-white scrollbar-track-rounded-full">
        <UseQueryProvider>
          <div className="flex">
            <SidebarComponent />
            <div className="flex flex-col w-full">
              <HeaderComponent />
              <div className="p-4">
                <main className="relative">{children}</main>
              </div>
            </div>
          </div>
        </UseQueryProvider>
      </body>
    </html>
  );
}
