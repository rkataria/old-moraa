import React from "react"
import SlideManager from "@/components/slides/SlideManager"
import { cookies } from "next/headers"
import { createClient } from "@/utils/supabase/server"

async function EventSlidesPage({ params }: any) {
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
    <div className="w-full">
      <SlideManager event={event} />
    </div>
  )
}

export default EventSlidesPage
