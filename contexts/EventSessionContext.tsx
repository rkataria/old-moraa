import { createContext, useEffect, useRef, useState } from 'react'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useParams } from 'next/navigation'

import { useEvent } from '@/hooks/useEvent'
import {
  EventSessionContextType,
  PresentationStatuses,
} from '@/types/event-session.type'
import { ISlide } from '@/types/slide.type'

interface EventSessionProviderProps {
  children: React.ReactNode
}

export const EventSessionContext =
  createContext<EventSessionContextType | null>(null)

export function EventSessionProvider({ children }: EventSessionProviderProps) {
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
  const [error, setError] = useState<string>('')
  const [meetingToken, setMeetingToken] = useState<string>('')
  const [isHost, setIsHost] = useState<boolean>(false)
  const [slides, setSlides] = useState<ISlide[]>([])
  const [currentSlide, setCurrentSlide] = useState<ISlide | null>(null)
  const [presentationStatus, setPresentationStatus] =
    useState<PresentationStatuses>(PresentationStatuses.STOPPED)
  const [currentSlideResponses, setCurrentSlideResponses] = useState<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    any[] | null
  >(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [currentUser, setCurrentUser] = useState<any>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [enrollment, setEnrollment] = useState<any>(null)
  const [currentSlideLoading, setCurrentSlideLoading] = useState<boolean>(true)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [participant, setParticipant] = useState<any>(null)
  const supabase = createClientComponentClient()
  const metaData = useRef<object>({})

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const user = await supabase.auth.getSession()

      setCurrentUser(user.data.session?.user)
    }

    fetchCurrentUser()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!activeSession || !meetingSlides?.slides) return

    const slide = meetingSlides?.slides?.find(
      (s) => s.id === activeSession.data?.currentSlideId
    )
    setCurrentSlide(slide || slides[0])
    setPresentationStatus(
      activeSession.data?.presentationStatus || PresentationStatuses.STOPPED
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSession])

  useEffect(() => {
    if (!eventId) return
    const updateSession = async () => {
      await supabase.from('session').upsert({
        id: activeSession.id,
        data: { currentSlideId: currentSlide?.id, presentationStatus },
      })
    }
    if (activeSession && activeSession.id) {
      updateSession()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSlide, presentationStatus, eventId])

  useEffect(() => {
    const getEnrollment = async () => {
      try {
        const _currentUser = await supabase.auth.getSession()
        const { data, error: _error } = await supabase
          .from('enrollment')
          .select('*')
          .eq('event_id', eventId)
          .eq('user_id', _currentUser.data.session?.user.id)
          .single()

        if (_error) {
          console.error(_error)
          setError(_error.message)

          return
        }
        setMeetingToken(data.meeting_token)
        setIsHost(data?.event_role === 'Host')
        setEnrollment(data)
        setLoading(false)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (_error: any) {
        console.error(_error)
        setError(_error.message)
      }
    }
    const getActiveSession = async () => {
      const { error: _error } = await supabase
        .from('session')
        .select('*')
        .eq('meeting_id', meeting?.id)
        .eq('status', 'ACTIVE')
        .single()
      if (_error) {
        console.error(_error)
        setError(_error.message)
      }
    }
    getEnrollment()
    getActiveSession()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meeting?.id])

  useEffect(() => {
    if (!meetingSlides?.slides) return

    const _slides = getSortedSlides() ?? []
    setSlides(_slides || [])
    setCurrentSlide(_slides[0] ?? null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meetingSlides])

  useEffect(() => {
    if (!currentSlide) return

    setCurrentSlideLoading(true)

    // Fetch current slide responses
    const fetchCurrentSlideResponses = async () => {
      const { data, error: _error } = await supabase
        .from('slide_response')
        .select(
          '* , participant:participant_id(*, enrollment:enrollment_id(*))'
        )
        .eq('slide_id', currentSlide.id)

      if (_error) {
        console.error(_error)
        setCurrentSlideLoading(false)

        return
      }

      setCurrentSlideResponses(data)
      setCurrentSlideLoading(false)
    }

    fetchCurrentSlideResponses()

    const channels = supabase
      .channel('slide-response-channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'slide_response',
          filter: `slide_id=eq.${currentSlide.id}`,
        },
        (payload) => {
          if (['INSERT', 'UPDATE'].includes(payload.eventType)) {
            fetchCurrentSlideResponses()
          }
        }
      )
      .subscribe()

    // eslint-disable-next-line consistent-return
    return () => {
      channels.unsubscribe()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSlide])

  const getSortedSlides = () => {
    const idIndexMap: { [id: string]: number } = {}
    meeting?.slides?.forEach((id: string, index: number) => {
      idIndexMap[id] = index
    })

    // Custom sorting function
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const customSort = (a: any, b: any) => idIndexMap[a.id] - idIndexMap[b.id]

    return meetingSlides?.slides?.slice().sort(customSort)
  }

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
      const slideResponse = await supabase
        .from('slide_response')
        .upsert({
          response: { selected_option: option },
          slide_id: slide.id,
          participant_id: participant.id,
        })
        .eq('slide_id', slide.id)
        .eq('participant_id', participant.id)
        .select()

      if (slideResponse.error) {
        console.error(slideResponse.error)
      }
      // eslint-disable-next-line @typescript-eslint/no-shadow, @typescript-eslint/no-explicit-any
    } catch (_error: any) {
      console.error(_error)
    }
  }
  const addReflection = async (
    slide: ISlide,
    reflection: string,
    username: string
  ) => {
    try {
      const slideResponse = await supabase
        .from('slide_response')
        .upsert({
          response: {
            reflection,
            username,
          },
          slide_id: slide.id,
          participant_id: participant.id,
        })
        .eq('slide_id', slide.id)
        .eq('participant_id', participant.id)
        .select()

      if (slideResponse.error) {
        console.error(slideResponse.error)
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (_error: any) {
      console.error(_error)
    }
  }
  const updateReflection = async (
    id: string,
    reflection: string,
    username: string
  ) => {
    try {
      const slideResponse = await supabase.from('slide_response').upsert({
        id,
        response: {
          reflection,
          username,
        },
      })

      if (slideResponse.error) {
        console.error(slideResponse.error)
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (_error: any) {
      console.error(_error)
    }
  }

  const syncSlides = async () => {
    await refetchMeetingSlides()
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const addParticipant = async (session?: any) => {
    const { data: participant, error: _err } = await supabase
      .from('participant')
      .select()
      .eq('session_id', session?.id ?? activeSession?.id)
      .eq('enrollment_id', enrollment?.id)
      .single()
    if (_err || !participant) {
      const { data: _participant, error } = await supabase
        .from('participant')
        .insert([
          {
            session_id: session?.id ?? activeSession.id,
            enrollment_id: enrollment.id,
          },
        ])
        .select()
        .single()

      if (error) {
        console.error('failed to create participant:', error)
        return
      }
      setParticipant(_participant)
      return
    }
    setParticipant(participant)
  }

  const joinMeeting = async () => {
    // check if active session exists, else create one
    const { data: session, error: _error } = await supabase
      .from('session')
      .select()
      .eq('meeting_id', meeting?.id)
      .eq('status', 'ACTIVE')
      .single()

    if (_error || !session) {
      // create new session in active state
      const { data: _session, error: createSessionError } = await supabase
        .from('session')
        .insert([{ meeting_id: meeting?.id, status: 'ACTIVE' }])
        .select()
        .single()
      if (createSessionError) {
        console.error('failed to create session, error: ', createSessionError)
        return
      }
      await addParticipant(_session)
      return
    }
    await addParticipant(session)
  }

  return (
    <EventSessionContext.Provider
      // eslint-disable-next-line react/jsx-no-constructed-context-values
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
        participant,
        syncSlides,
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
      }}>
      {children}
    </EventSessionContext.Provider>
  )
}
