import EventActionButtons from "@/components/common/EventActionButtons"
import Participants from "@/components/events/Participants"
import { createClient } from "@/utils/supabase/server"
import { cookies } from "next/headers"
import Link from "next/link"

export default async function EventPage({ params }: any) {
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
    <div className="px-4 sm:px-6 lg:px-8 mt-12">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">
            {event.name}
          </h1>
          <p className="mt-2 text-sm text-gray-700">{event.description}</p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <EventActionButtons />
        </div>
      </div>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <Participants />
          </div>
        </div>
      </div>
    </div>
  )
}
