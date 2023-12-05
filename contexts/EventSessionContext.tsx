import { createContext, useEffect, useState } from "react"
import { createClient } from "@/utils/supabase/client"
import { useParams } from "next/navigation"
import { EventSessionContextType } from "@/types/event-session.type"

interface EventSessionProviderProps {
  children: React.ReactNode
}

export const EventSessionContext =
  createContext<EventSessionContextType | null>(null)

const EventSessionProvider = ({ children }: EventSessionProviderProps) => {
  const params = useParams()
  const supabase = createClient()

  return (
    <EventSessionContext.Provider value={{}}>
      {children}
    </EventSessionContext.Provider>
  )
}

export default EventSessionProvider
