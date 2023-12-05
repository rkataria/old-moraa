"use client"

import React from "react"
import EventSessionContextProvider from "@/contexts/EventSessionContext"

interface SlideManagerWithProviderProps {
  event: any
  children?: React.ReactNode
}

function SlideManagerWithProvider({
  event,
  children,
}: SlideManagerWithProviderProps) {
  return (
    <EventSessionContextProvider>
      <div></div>
    </EventSessionContextProvider>
  )
}

export default SlideManagerWithProvider
