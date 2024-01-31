import { Providers } from "./providers"

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
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
