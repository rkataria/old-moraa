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
import { useEventSession } from "@/hooks/useEventSession"
import { useEvent } from "@/hooks/useEvent"

interface EventSessionProviderProps {
  children: React.ReactNode
}

const EventSessionContext = createContext<EventSessionContextType | null>(null)

export const EventSessionProvider = ({
  children,
}: EventSessionProviderProps) => {
  const { eventId } = useParams()
  const { event } = useEvent({ id: eventId as string })
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>("")
  const [meetingToken, setMeetingToken] = useState<string>("")
  const [isHost, setIsHost] = useState<boolean>(false)
  const [slides, setSlides] = useState<ISlide[]>([])
  const [currentSlide, setCurrentSlide] = useState<ISlide | null>(null)
  const [presentationStatus, setPresentationStatus] =
    useState<PresentationStatuses>(PresentationStatuses.STOPPED)
  const [currentSlideResponses, setCurrentSlideResponses] = useState<
    any[] | null
  >(null)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const { eventSession, upsertEventSession } = useEventSession({
    eventId: eventId as string,
  })
  const supabase = createClient()

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const user = await supabase.auth.getSession()

      setCurrentUser(user.data.session?.user)
    }

    fetchCurrentUser()
  }, [])

  useEffect(() => {
    if (!eventSession) return

    setCurrentSlide(eventSession.currentSlide)
    setPresentationStatus(
      eventSession.presentationStatus || PresentationStatuses.STOPPED
    )
  }, [eventSession])

  useEffect(() => {
    if (!eventId) return

    upsertEventSession({
      eventId: eventId as string,
      payload: {
        data: {
          currentSlide,
          presentationStatus,
        },
      },
    })
  }, [currentSlide, presentationStatus, eventId])

  useEffect(() => {
    const getEnrollment = async () => {
      try {
        const currentUser = await supabase.auth.getSession()
        const { data, error } = await supabase
          .from("enrollment")
          .select("*")
          .eq("event_id", eventId)
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

  useEffect(() => {
    if (!currentSlide) return

    // Fetch current slide responses
    const fetchCurrentSlideResponses = async () => {
      const { data, error } = await supabase
        .from("slide_response")
        .select("*")
        .eq("slide_id", currentSlide.id)

      if (error) {
        console.error(error)
        return
      }

      setCurrentSlideResponses(data)
    }

    fetchCurrentSlideResponses()

    const channels = supabase
      .channel("slide-response-channel")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "slide_response",
          filter: `slide_id=eq.${currentSlide.id}`,
        },
        (payload) => {
          console.log("Change received!", payload)
          if (payload.eventType === "INSERT") {
            setCurrentSlideResponses((res: any) => [
              ...(res ?? []),
              payload.new,
            ])
          }
        }
      )
      .subscribe()

    return () => {
      channels.unsubscribe()
    }
  }, [currentSlide])

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

  const votePoll = async (slide: ISlide, option: string) => {
    try {
      const currentUser = await supabase.auth.getSession()

      const { data, error } = await supabase
        .from("slide_response")
        .upsert({
          slide,
          response: { selected_option: option },
          slide_id: slide.id,
          event_id: event.id,
          profile_id: currentUser.data.session?.user.id,
        })
        .eq("slide_id", slide.id)
        .eq("event_id", event.id)
        .eq("profile_id", currentUser.data.session?.user.id)
        .select()

      console.log("data", data, currentUser.data.session?.user.id)

      if (error) {
        console.error(error)
        return
      }
    } catch (error: any) {
      console.error(error)
    }
  }

  console.log("currentSlideResponses", currentSlideResponses)

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
        currentSlideResponses,
        currentUser,
        startPresentation,
        stopPresentation,
        pausePresentation,
        setCurrentSlide,
        nextSlide,
        previousSlide,
        votePoll,
      }}
    >
      {children}
    </EventSessionContext.Provider>
  )
}

export default EventSessionContext
