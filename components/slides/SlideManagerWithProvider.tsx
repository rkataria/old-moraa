"use client"

import React from "react"
import SlideManager from "./SlideManager"
import SlideManagerProvider from "@/contexts/SlideManagerContext"

interface SlideManagerWithProviderProps {
  event: any
}

function SlideManagerWithProvider({ event }: SlideManagerWithProviderProps) {
  return (
    <SlideManagerProvider>
      <SlideManager event={event} />
    </SlideManagerProvider>
  )
}

export default SlideManagerWithProvider
