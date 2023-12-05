import NewEventButtonWithModal from "@/components/common/NewEventButtonWithModal"
import EventList from "@/components/events/EventList"
import { createClient } from "@/utils/supabase/server"
import { cookies } from "next/headers"
import Link from "next/link"

const people = [
  {
    name: "Lindsay Walton",
    title: "Front-end Developer",
    email: "lindsay.walton@example.com",
    role: "Member",
  },
]

export default async function EventsPage() {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const { data, error } = await supabase.from("event").select()

  return (
    <div className="px-4 sm:px-6 lg:px-8 mt-12">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto"></div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <NewEventButtonWithModal />
        </div>
      </div>
      <EventList events={data} />
    </div>
  )
}
