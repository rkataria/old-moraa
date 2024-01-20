"use client"
import React from "react"
import { SlideManagerProvider } from "@/contexts/SlideManagerContext"
import SlideManager from "@/components/event-content/SlideManager"

function EventSlidesPage({ params }: any) {
  return (
    <SlideManagerProvider>
      <SlideManager />
    </SlideManagerProvider>
  )
}

export default EventSlidesPage
