import { cookies } from "next/headers"
import { createClient } from "@/utils/supabase/server"
import Header from "@/components/event-session/Header"

export default async function MeetingLayout({ children, params }: any) {
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
    <div className="bg-gray-100 h-screen pt-16">
      <Header event={event} />
      {children}
    </div>
  )
}
