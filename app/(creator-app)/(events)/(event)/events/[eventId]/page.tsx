"use client"
import React from "react"
import { createClient } from "@/utils/supabase/client"
import { SlideManagerProvider } from "@/contexts/SlideManagerContext"
import SlideManager from "@/components/slides/SlideManager"

async function EventSlidesPage({ params }: any) {
  const supabase = createClient()
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
    <SlideManagerProvider>
      <SlideManager event={event} />
    </SlideManagerProvider>
  )
}

export default EventSlidesPage
