import { cookies } from "next/headers"
// TODO: Move Header and other components to a shared folder
import Header from "../../(slides)/_components/Header"
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
