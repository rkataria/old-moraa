"use client";

import { Montserrat } from "next/font/google";
import { UseQueryProvider } from "@/utils/use-query-provider";
import { HeaderComponent } from "@/components/partials/header";
import { cn } from "@/lib/utils";
import '../../../globals.css'
import { SidebarComponent } from "@/components/partials/sidebar";
import { ModalProvider } from "@/providers/modal-provider";
import { ThemeProvider } from "@/providers/theme-provider";

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
  return (
    <html lang="en" className={cn("h-full bg-white", font.className)}>
      <body>
        <div className="flex">
          <SidebarComponent />
          <div className="flex flex-col w-full">
            <HeaderComponent />
            <div className="p-4">
              <main className="relative">{children}</main>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
