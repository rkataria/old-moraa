import { cookies } from "next/headers"
import Header from "@/components/slides/Header"
import { createClient } from "@/utils/supabase/server"

export default async function SlidesLayout({ children, params }: any) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)
  const { eventId } = params

  const { data, error } = await supabase
    .from("event")
    .select("*")
    .eq("id", eventId)

  if (error) {
    console.error(error)
    return <div>Error</div>
  }

  const event = data[0]

  return (
    <div>
      <Header event={event} />
      {children}
    </div>
  )
}
