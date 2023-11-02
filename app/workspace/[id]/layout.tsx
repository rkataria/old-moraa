import "@/app/globals.css"
import Sidebar from "@/components/workspace/Sidebar"

export const metadata = {
  title: "Learnsight",
  description: "The fastest way to build apps with Next.js and Supabase",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="bg-white flex flex-row w-full">
      <Sidebar />
      <main className="min-h-screen flex flex-col items-center flex-auto">
        {children}
      </main>
    </div>
  )
}
