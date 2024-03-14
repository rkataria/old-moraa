import { createContext, useEffect, useRef, useState } from 'react'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useParams } from 'next/navigation'
import { OnDragEndResponder } from 'react-beautiful-dnd'

import { useEvent } from '@/hooks/useEvent'
import { deletePDFFile } from '@/services/pdf.service'
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [activeStateSession, setActiveSession] = useState<any>(null)
  const supabase = createClientComponentClient()
  const metaData = useRef<object>({})
  const [syncing, setSyncing] = useState<boolean>(false)

  useEffect(() => {
    setActiveSession(activeSession)
  }, [activeSession])

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
      (s: ISlide) => s.id === activeSession.data?.currentSlideId
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
          '* , participant:participant_id(*, enrollment:enrollment_id(*, profile:user_id(*)))'
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    const { data: existingParticipant, error: existingParticipantError } =
      await supabase
        .from('participant')
        .select()
        .eq('session_id', session?.id ?? activeSession?.id)
        .eq('enrollment_id', enrollment?.id)
        .single()
    if (existingParticipantError || !existingParticipant) {
      const { data: createdParticipant, error: createdParticipantError } =
        await supabase
          .from('participant')
          .insert([
            {
              session_id: session?.id ?? activeSession.id,
              enrollment_id: enrollment.id,
            },
          ])
          .select()
          .single()

      if (createdParticipantError) {
        console.error('failed to create participant:', error)

        return
      }
      setParticipant(createdParticipant)

      return
    }
    setParticipant(existingParticipant)
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

  useEffect(() => {
    const channels = supabase
      .channel('session-channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'session',
          filter: `id=eq.${activeStateSession?.id}`,
        },
        (payload) => {
          setActiveSession(payload?.new)
        }
      )
      .subscribe()

    return () => {
      channels.unsubscribe()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeStateSession])

  const handRaisedHandler = async (participantId: string) => {
    const prevSessionRaisedHands = activeStateSession?.data?.handsRaised || []
    let updateRaisedHands = prevSessionRaisedHands
    const isParticipantIdExist =
      prevSessionRaisedHands.findIndex((i: string) => i === participantId) !==
      -1
    if (isParticipantIdExist) {
      updateRaisedHands = prevSessionRaisedHands.filter(
        (i: string) => i !== participantId
      )
    } else {
      updateRaisedHands = [...prevSessionRaisedHands, participantId]
    }
    await supabase.from('session').upsert({
      id: activeStateSession.id,
      data: {
        currentSlideId: currentSlide?.id,
        presentationStatus,
        handsRaised: updateRaisedHands,
      },
    })
  }

  const updateSlideIds = async (ids: string[]) => {
    if (!meeting?.id) return

    const { error: updatedSlideError } = await supabase
      .from('meeting')
      .update({ slides: ids })
      .eq('id', meeting?.id)
    if (updatedSlideError) {
      console.error('error while updating slide ids on meeting,error: ', error)
    }
  }

  const moveUpSlide = (id: string) => {
    const index = slides.findIndex((slide) => slide.id === id)
    const slideIds = slides.map((i) => i.id)

    if (index === 0) return

    const newSlides = [...slides]
    const temp = newSlides[index - 1]
    newSlides[index - 1] = newSlides[index]
    newSlides[index] = temp

    setSlides(newSlides)

    // Reorder the slideIds
    const idIndex = slideIds.findIndex((i) => i === id)
    if (idIndex === 0) return
    const newIds = [...slideIds]
    const tempId = newIds[index - 1]
    newIds[index - 1] = newIds[index]
    newIds[index] = tempId
    updateSlideIds(newIds)
  }

  const moveDownSlide = (id: string) => {
    const index = slides.findIndex((slide) => slide.id === id)
    const slideIds = slides.map((i) => i.id)

    if (index === slides.length - 1) return

    const newSlides = [...slides]
    const temp = newSlides[index + 1]
    newSlides[index + 1] = newSlides[index]
    newSlides[index] = temp

    setSlides(newSlides)

    // Reorder the slideIds
    const idIndex = slideIds.findIndex((i) => i === id)
    if (idIndex === 0) return
    const newIds = [...slideIds]
    const tempId = newIds[index + 1]
    newIds[index + 1] = newIds[index]
    newIds[index] = tempId
    updateSlideIds(newIds)
  }

  const updateSlide = async (slide: ISlide) => {
    const _slide = { ...slide }
    _slide.meeting_id = slide.meeting_id ?? meeting?.id
    await supabase.from('slide').upsert({
      id: _slide.id,
      content: _slide.content,
      config: _slide.config,
      name: _slide.name,
    })
    setCurrentSlide(_slide)
    setSlides((s) => {
      if (s.findIndex((i) => i.id === _slide.id) >= 0) {
        return s.map((sl) => (sl.id === _slide.id ? _slide : sl))
      }

      return [...s, _slide]
    })
  }

  const deleteSlide = async (id: string) => {
    const { error: deleteSlideError } = await supabase
      .from('slide')
      .delete()
      .eq('id', id)

    if (deleteSlideError) {
      console.error('failed to delete the slide: ', deleteSlideError)
    }
    const index = slides.findIndex((slide) => slide.id === id)
    // TODO: Implement block pattern
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const slide = slides.find((_slide) => _slide.id === id) as any
    if (slide?.content?.pdfPath) {
      deletePDFFile(slide?.content?.pdfPath)
    }

    const updatedSlides = slides.filter((_slide) => _slide.id !== id)
    setSlides(updatedSlides)
    setSlides((s) => s.filter((_slide) => _slide.id !== id))
    await updateSlideIds(
      slides.filter((slideData) => slideData.id !== id).map((i) => i.id)
    )

    if (currentSlide?.id === id) {
      if (index !== updatedSlides.length) {
        setCurrentSlide(updatedSlides[index])

        return
      }
      if (updatedSlides.length > 0) {
        setCurrentSlide(updatedSlides[index - 1])

        return
      }
      setCurrentSlide(null)
    }
  }

  const reorder = (list: ISlide[], startIndex: number, endIndex: number) => {
    const result = list
    const [removed] = result.splice(startIndex, 1)
    result.splice(endIndex, 0, removed)

    return result
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const reorderSlide = async (result: OnDragEndResponder | any) => {
    if (!result.destination) {
      return
    }
    const items = reorder(slides, result.source.index, result.destination.index)
    setSlides(items)
    setSyncing(true)
    await updateSlideIds(items.map((i) => i.id))
    setSyncing(false)
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
        handRaisedHandler,
        activeStateSession,
        syncing,
        reorderSlide,
        moveUpSlide,
        moveDownSlide,
        deleteSlide,
        updateSlide,
      }}>
      {children}
    </EventSessionContext.Provider>
  )
}
