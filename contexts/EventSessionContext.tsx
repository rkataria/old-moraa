import { createContext, useEffect, useState } from "react"
import { useParams } from "next/navigation"
import {
  EventSessionContextType,
  PresentationStatuses,
} from "@/types/event-session.type"
import { ISlide } from "@/types/slide.type"
import { useEventSession } from "@/hooks/useEventSession"
import { useEvent } from "@/hooks/useEvent"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

interface EventSessionProviderProps {
  children: React.ReactNode
}

const EventSessionContext = createContext<EventSessionContextType | null>(null)

export const EventSessionProvider = ({
  children,
}: EventSessionProviderProps) => {
  const { eventId } = useParams()
  const {
    event,
    eventContent,
    refetch: refetchEventContent,
  } = useEvent({
    id: eventId as string,
    fetchEventContent: true,
  })
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
  const [currentSlideLoading, setCurrentSlideLoading] = useState<boolean>(true)
  const [editing, setEditing] = useState<boolean>(false)
  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const user = await supabase.auth.getSession()

      setCurrentUser(user.data.session?.user)
    }

    fetchCurrentUser()
  }, [])

  useEffect(() => {
    if (!eventSession) return

    setCurrentSlide(eventSession.currentSlide || slides[0])
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
    if (!eventContent?.slides) return

    setSlides(eventContent.slides || [])
    setCurrentSlide(eventContent.slides[0] ?? null)
  }, [eventContent])

  useEffect(() => {
    if (!currentSlide) return

    setCurrentSlideLoading(true)

    // Fetch current slide responses
    const fetchCurrentSlideResponses = async () => {
      const { data, error } = await supabase
        .from("slide_response")
        .select("*")
        .eq("slide_id", currentSlide.id)

      if (error) {
        console.error(error)
        setCurrentSlideLoading(false)
        return
      }

      setCurrentSlideResponses(data)
      setCurrentSlideLoading(false)
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
    if (!isHost) return

    const currentIndex = slides.findIndex(
      (slide) => slide.id === currentSlide?.id
    )
    if (currentIndex === slides.length - 1) return
    setCurrentSlide(slides[currentIndex + 1])
  }

  const previousSlide = () => {
    if (!isHost) return

    const currentIndex = slides.findIndex(
      (slide) => slide.id === currentSlide?.id
    )
    if (currentIndex === 0) return
    setCurrentSlide(slides[currentIndex - 1])
  }

  const setCurrentSlideByID = (id: string) => {
    const newSlide = slides.find(slide => slide.id === id)
    if(!newSlide) return;
    setCurrentSlide(newSlide)
  }

  const enableEditing = () => {
    setEditing(true)
  }

  const disableEditing = () => {
    setEditing(false)
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

  const updateSlide = async (slide: ISlide) => {
    try {
      const { data, error } = await supabase
        .from("event_content")
        .upsert({
          id: event.id,
          slides: slides.map((s) => (s.id === slide.id ? slide : s)),
        })
        .eq("id", event.id)
        .select("*")

      if (error) {
        console.error(error)
        return
      }

      setSlides(data[0].slides)
      setCurrentSlide(data[0].slides.find((s: ISlide) => s.id === slide.id))
    } catch (error: any) {
      console.error(error)
    }
  }

  const syncSlides = async () => {
    await refetchEventContent()
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
        currentSlideResponses,
        currentSlideLoading,
        currentUser,
        editing,
        syncSlides,
        updateSlide,
        enableEditing,
        disableEditing,
        startPresentation,
        stopPresentation,
        pausePresentation,
        setCurrentSlide,
        nextSlide,
        previousSlide,
        setCurrentSlideByID,
        votePoll,
      }}
    >
      {children}
    </EventSessionContext.Provider>
  )
}

export default EventSessionContext
