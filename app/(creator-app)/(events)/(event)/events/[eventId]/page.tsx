import React from "react"
import { cookies } from "next/headers"
import { createClient } from "@/utils/supabase/server"
import SlideManagerWithProvider from "@/components/slides/SlideManagerWithProvider"

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
      <SlideManagerWithProvider event={event} />
    </div>
  )
}

export default EventSlidesPage
