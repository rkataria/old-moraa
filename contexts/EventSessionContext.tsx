import { createContext, useEffect, useState } from "react"
import { createClient } from "@/utils/supabase/client"
import { useParams } from "next/navigation"
import { EventSessionContextType } from "@/types/event-session.type"
import { useDyteClient } from "@dytesdk/react-web-core"

interface EventSessionProviderProps {
  children: React.ReactNode
}

const EventSessionContext = createContext<EventSessionContextType | null>(null)

export const EventSessionProvider = ({
  children,
}: EventSessionProviderProps) => {
  const [event, setEvent] = useState<any>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>("")
  const [meetingToken, setMeetingToken] = useState<string>("")
  const [isHost, setIsHost] = useState<boolean>(false)
  const params = useParams()
  const supabase = createClient()

  useEffect(() => {
    const getEvent = async () => {
      try {
        const { data, error } = await supabase
          .from("event")
          .select("*")
          .eq("id", params.eventId)

        if (error) {
          console.error(error)
          setError(error.message)
          return
        }
        setEvent(data[0])
      } catch (error: any) {
        console.error(error)
        setError(error.message)
      }
    }
    getEvent()
  }, [params.eventId])

  useEffect(() => {
    const getEnrollment = async () => {
      try {
        const currentUser = await supabase.auth.getSession()
        const { data, error } = await supabase
          .from("enrollment")
          .select("*")
          .eq("event_id", params.eventId)
          .eq("user_id", currentUser.data.session?.user.id)

        console.log("data", data, currentUser.data.session?.user.id)
        if (error) {
          console.error(error)
          setError(error.message)
          return
        }
        setMeetingToken(data[0].meeting_token)
        setIsHost(data[0]?.event_role === "Host")
        setLoading(false)
      } catch (error: any) {
        console.error(error)
        setError(error.message)
      }
    }
    getEnrollment()
  }, [event?.meeting_id])

  return (
    <EventSessionContext.Provider
      value={{
        event,
        loading,
        error,
        meetingToken,
        isHost,
      }}
    >
      {children}
    </EventSessionContext.Provider>
  )
}

export default EventSessionContext
