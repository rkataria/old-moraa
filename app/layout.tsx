import "./globals.css"

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
    <html lang="en" className="h-full bg-white">
      <body className="h-full scrollbar-thin scrollbar-thumb-indigo-700 scrollbar-track-white scrollbar-track-rounded-full">
        <main>{children}</main>
      </body>
    </html>
  )
}
