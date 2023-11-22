import { cookies } from "next/headers"
import Header from "@/components/slides/Header"
import { createClient } from "@/utils/supabase/server"

export default async function SlidesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  // TODO: Get event id from url
  const { data, error } = await supabase.from("event").select("*").eq("id", 2)

  if (error) {
    console.error(error)
    return <div>Error</div>
  }

  const event = data[0]

  return (
    <div>
      <Header title={event?.name} />
      {children}
    </div>
  )
}
