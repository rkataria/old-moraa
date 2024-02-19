import { createContext, useEffect, useRef, useState } from "react"
import { useParams } from "next/navigation"
import {
  EventSessionContextType,
  PresentationStatuses,
} from "@/types/event-session.type"
import { ISlide } from "@/types/slide.type"
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
    meeting,
    meetingSlides,
    activeSession,
    refetch: refetchMeetingSlides,
  } = useEvent({
    id: eventId as string,
    fetchMeetingSlides: true,
    fetchActiveSession: true,
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
  const [enrollment, setEnrollment] = useState<any>(null)
  const [currentSlideLoading, setCurrentSlideLoading] = useState<boolean>(true)
  const [activeStateSession, setActiveSession] = useState<any>(null)
  const [participant, setParticipant] = useState<any>(null)
  const supabase = createClientComponentClient()
  const metaData = useRef<Object>({})

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const user = await supabase.auth.getSession()

      setCurrentUser(user.data.session?.user)
    }

    fetchCurrentUser()
  }, [])

  useEffect(() => {
    if (!activeSession || !meetingSlides?.slides) return

    const slide = meetingSlides?.slides?.find(
      (s) => s.id === activeSession.data.currentSlideId
    )
    setCurrentSlide(slide || slides[0])
    setPresentationStatus(
      activeSession.data.presentationStatus || PresentationStatuses.STOPPED
    )
  }, [activeSession])

  useEffect(() => {
    if (!eventId) return
    const updateSession = async () => {
      const { data, error } = await supabase.from("session").upsert({
        id: activeSession.id,
        data: { currentSlideId: currentSlide?.id, presentationStatus },
      })
    }
    if (activeSession && activeSession.id) {
      updateSession()
    }
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
          .single()

        if (error) {
          console.error(error)
          setError(error.message)
          return
        }
        setMeetingToken(data.meeting_token)
        setIsHost(data?.event_role === "Host")
        setEnrollment(data)
        setLoading(false)
      } catch (error: any) {
        console.error(error)
        setError(error.message)
      }
    }
    const getActiveSession = async () => {
      const { data, error } = await supabase
        .from("session")
        .select("*")
        .eq("meeting_id", meeting?.id)
        .eq("status", "ACTIVE")
        .single()
      if (error) {
        console.error(error)
        setError(error.message)
        return
      }
      setActiveSession(data)
    }
    getEnrollment()
    getActiveSession()
  }, [meeting?.id])

  useEffect(() => {
    if (!meetingSlides?.slides) return

    setSlides(meetingSlides.slides || [])
    setCurrentSlide(meetingSlides.slides[0] ?? null)
  }, [meetingSlides])

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
          if (payload.eventType === "INSERT") {
            setCurrentSlideResponses((res: any) => [
              ...(res ?? []),
              payload.new,
            ])
          }
          if (payload.eventType === "UPDATE") {
            setCurrentSlideResponses((res: any) => {
              // Update the response in the array if it exists
              const updatedResponses = res.map((existingResponse: any) =>
                existingResponse.id === payload.new.id
                  ? payload.new
                  : existingResponse
              )

              return updatedResponses
            })
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
    const newSlide = slides.find((slide) => slide.id === id)
    if (!newSlide) return
    setCurrentSlide(newSlide)
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
          participant_id: participant.id,
        })
        .eq("slide_id", slide.id)
        .eq("participant_id", participant.id)
        .select()

      if (error) {
        console.error(error)
        return
      }
    } catch (error: any) {
      console.error(error)
    }
  }
  const addReflection = async (
    slide: ISlide,
    reflection: string,
    username: string
  ) => {
    try {
      const currentUser = await supabase.auth.getSession()

      const { data, error } = await supabase
        .from("slide_response")
        .upsert({
          slide,
          response: {
            reflection: reflection,
            username: username,
          },
          slide_id: slide.id,
          event_id: event.id,
          profile_id: currentUser.data.session?.user.id,
        })
        .eq("slide_id", slide.id)
        .eq("event_id", event.id)
        .eq("profile_id", currentUser.data.session?.user.id)
        .select()

      if (error) {
        console.error(error)
        return
      }
    } catch (error: any) {
      console.error(error)
    }
  }
  const updateReflection = async (
    id: string,
    reflection: string,
    username: string
  ) => {
    try {
      const { error } = await supabase.from("slide_response").upsert({
        id: id,
        response: {
          reflection: reflection,
          username: username,
        },
      })

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
    await refetchMeetingSlides()
  }

  const addParticipant = async (session?: any) => {
    const { data: participant, error: createParticipantError } = await supabase
      .from("participant")
      .insert([
        {
          session_id: session?.id ?? activeSession.id,
          enrollment_id: enrollment.id,
        },
      ])
      .select()
      .single()

    if (createParticipantError) {
      console.error("failed to create participant:", createParticipantError)
      return
    }
    setParticipant(participant)
  }

  const joinMeeting = async () => {
    let newSession
    // create a new session if host joins and expire others
    if (isHost) {
      // expire other sessions
      const { data, error } = await supabase
        .from("session")
        .update({ status: "EXPIRED" })
        .eq("meeting_id", meeting?.id)

      if (error) {
        console.error("failed to expire sessions, error: ", error)
      }

      // create new session in active state
      const { data: session, error: createSessionError } = await supabase
        .from("session")
        .insert([{ meeting_id: meeting?.id, status: "ACTIVE" }])
        .select()
        .single()
      if (createSessionError) {
        console.error("failed to create session, error: ", createSessionError)
        return
      }
      newSession = session
      setActiveSession(newSession)
    }
    await addParticipant(newSession)
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
        metaData,
        syncSlides,
        updateSlide,
        startPresentation,
        stopPresentation,
        pausePresentation,
        setCurrentSlide,
        nextSlide,
        previousSlide,
        setCurrentSlideByID,
        votePoll,
        addReflection,
        updateReflection,
        joinMeeting,
      }}
    >
      {children}
    </EventSessionContext.Provider>
  )
}

export default EventSessionContext
