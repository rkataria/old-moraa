import { createContext, useEffect, useState } from "react"
import { createClient } from "@/utils/supabase/client"
import { useParams } from "next/navigation"
import {
  EventSessionContextType,
  PresentationStatuses,
} from "@/types/event-session.type"
import { ISlide } from "@/types/slide.type"
import { v4 as uuidv4 } from "uuid"
import { getDefaultCoverSlide } from "@/utils/content.util"

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
  const [slides, setSlides] = useState<ISlide[]>([])
  const [currentSlide, setCurrentSlide] = useState<ISlide | null>(null)
  const [presentationStatus, setPresentationStatus] =
    useState<PresentationStatuses>(PresentationStatuses.STOPPED)
  const params = useParams()
  const supabase = createClient()

  useEffect(() => {
    const getEventSessionData = async () => {
      try {
        const { data, error } = await supabase
          .from("event_session")
          .select("*")
          .eq("event_id", params.eventId)

        if (error) {
          console.error(error)
          setError(error.message)
          return
        }

        const sessionData = data[0]?.data

        if (!sessionData) return

        setCurrentSlide(sessionData.currentSlide)
        setPresentationStatus(
          sessionData.presentationStatus || PresentationStatuses.STOPPED
        )
      } catch (error: any) {
        console.error(error)
        setError(error.message)
      }
    }
    getEventSessionData()
  }, [params.eventId])

  useEffect(() => {
    const pushEventSessionToRemote = async () => {
      try {
        const { error } = await supabase
          .from("event_session")
          .update({
            data: {
              currentSlide,
              presentationStatus,
            },
            updated_at: new Date(),
          })
          .eq("event_id", params.eventId)

        if (error) {
          console.error(error)
          return
        }
      } catch (error: any) {
        console.error(error)
      }
    }

    pushEventSessionToRemote()
  }, [currentSlide, presentationStatus, params.eventId])

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

  useEffect(() => {
    if (!event?.id) return

    const fetchSlides = async () => {
      try {
        const { data, error } = await supabase
          .from("event_content")
          .select("*")
          .eq("event_id", event.id)

        if (error) {
          console.error(error)
          setError(error.message)
          return
        }

        setSlides(data[0]?.slides ?? [])
        setCurrentSlide(data[0]?.slides[0] ?? null)
      } catch (error: any) {
        console.error(error)
        setError(error.message)
      }
    }

    fetchSlides()
  }, [event?.id])

  const nextSlide = () => {
    const currentIndex = slides.findIndex(
      (slide) => slide.id === currentSlide?.id
    )
    if (currentIndex === slides.length - 1) return
    setCurrentSlide(slides[currentIndex + 1])
  }

  const previousSlide = () => {
    const currentIndex = slides.findIndex(
      (slide) => slide.id === currentSlide?.id
    )
    if (currentIndex === 0) return
    setCurrentSlide(slides[currentIndex - 1])
  }

  const startPresentation = () => {
    setPresentationStatus(PresentationStatuses.STARTED)
  }

  const stopPresentation = () => {
    setPresentationStatus(PresentationStatuses.STOPPED)
  }

  const pausePresentation = () => {
    setPresentationStatus(PresentationStatuses.PAUSED)
  }

  return (
    <EventSessionContext.Provider
      value={{
        event,
        loading,
        error,
        meetingToken,
        isHost,
        slides,
        currentSlide,
        presentationStatus,
        startPresentation,
        stopPresentation,
        pausePresentation,
        setCurrentSlide,
        nextSlide,
        previousSlide,
      }}
    >
      {children}
    </EventSessionContext.Provider>
  )
}

export default EventSessionContext
