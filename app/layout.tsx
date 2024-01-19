import { UseQueryProvider } from "@/utils/use-query-provider"
import { ThemeProvider } from "@/providers/theme-provider"
import { ModalProvider } from "@/providers/modal-provider"

import "@/app/globals.css"

export const metadata = {
  title: "Moraa",
  description: "Moraa is a platform for learning and teaching online.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="h-full w-full scrollbar-thin scrollbar-thumb-indigo-700 scrollbar-track-white scrollbar-track-rounded-full bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem={false}
          storageKey="elearning"
        >
          <UseQueryProvider>
            {children}
            <ModalProvider />
          </UseQueryProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
