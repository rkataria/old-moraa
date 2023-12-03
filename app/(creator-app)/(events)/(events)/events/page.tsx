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
        <div className="sm:flex-auto">
          {/* <h1 className="text-base font-semibold leading-6 text-gray-900">
            Events
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            List of all events and their details.
          </p> */}
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          {/* <Link
            href="/events/new"
            className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Create new
          </Link> */}
          <NewEventButtonWithModal />
        </div>
      </div>
      <EventList events={data} />
    </div>
  )
}
