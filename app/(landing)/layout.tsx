import { Montserrat } from "next/font/google"

import "../globals.css"
import clsx from "clsx"
import { UseQueryProvider } from "@/utils/use-query-provider"
import { ThemeProvider } from "@/components/providers/theme-provider"

const font = Montserrat({
  subsets: ["latin"],
  style: "normal",
  weight: ["400", "500", "600", "700"],
})

export const metadata = {
  title: "Next.js and Supabase Starter Kit",
  description: "The fastest way to build apps with Next.js and Supabase",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={clsx("h-full bg-white", font.className)}>
      <body className="h-full scrollbar-thin scrollbar-thumb-indigo-700 scrollbar-track-white scrollbar-track-rounded-full">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem={false}
          storageKey="elearning"
        >
          <UseQueryProvider>
            <main>{children}</main>
          </UseQueryProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
