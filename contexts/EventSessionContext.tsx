import { createContext, useEffect, useRef, useState } from 'react'

import { sendNotification } from '@dytesdk/react-ui-kit'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { RealtimeChannel } from '@supabase/supabase-js'
import uniqBy from 'lodash.uniqby'
import { useParams } from 'next/navigation'
import { OnDragEndResponder } from 'react-beautiful-dnd'

import { useEvent } from '@/hooks/useEvent'
import { useSlideReactions } from '@/hooks/useReactions'
import { deletePDFFile } from '@/services/pdf.service'
import {
  EventSessionContextType,
  PresentationStatuses,
  VideoMiddlewareConfig,
} from '@/types/event-session.type'
import { ISlide } from '@/types/slide.type'

interface EventSessionProviderProps {
  children: React.ReactNode
}

let realtimeChannel: RealtimeChannel
const supabase = createClientComponentClient()

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
  const metaData = useRef<object>({})
  const [syncing, setSyncing] = useState<boolean>(false)
  const [videoMiddlewareConfig, setVideoMiddlewareConfig] =
    useState<VideoMiddlewareConfig | null>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [slideReactions, setSlideReactions] = useState<any>([])
  const { data: fetchedSlideReactions } = useSlideReactions(currentSlide?.id)

  // Create a channel for the event
  useEffect(() => {
    if (!eventId) return

    realtimeChannel = supabase
      .channel(`event:${eventId}`, {
        config: {
          broadcast: { self: true },
        },
      })
      .subscribe()

    // Listen for slide change events
    realtimeChannel.on(
      'broadcast',
      { event: 'currentslide-change' },
      ({ payload }) => {
        const slideId = payload?.slideId

        if (!slideId) return

        setCurrentSlideByID(slideId)
      }
    )

    // Listen for presentation status change events
    realtimeChannel.on(
      'broadcast',
      { event: 'presentation-status-change' },
      ({ payload }) => {
        setPresentationStatus(
          payload?.presentationStatus || PresentationStatuses.STOPPED
        )
      }
    )

    // Listen for hand raised events
    realtimeChannel.on('broadcast', { event: 'hand-raised' }, ({ payload }) => {
      const { participantId, participantName } = payload

      if (!participantId || !participantName) return

      const dyteNotificationObject = {
        id: new Date().getTime().toString(),
        message: `${participantName} has raised a hand`,
        duration: 5000,
      }

      sendNotification(dyteNotificationObject, 'message')
    })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId, slides])

  useEffect(() => {
    setActiveSession(activeSession)
  }, [activeSession])

  useEffect(() => {
    setSlideReactions(fetchedSlideReactions)
  }, [fetchedSlideReactions])

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const user = await supabase.auth.getSession()

      setCurrentUser(user.data.session?.user)
    }

    fetchCurrentUser()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!activeSession) return
    setCurrentSlideByID(activeSession.data?.currentSlideId)
    setPresentationStatus(
      activeSession.data?.presentationStatus || PresentationStatuses.STOPPED
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSession])

  useEffect(() => {
    if (!isHost) return
    if (!activeSession) return

    const updateSession = async () => {
      await supabase.from('session').upsert({
        id: activeSession.id,
        data: {
          currentSlideId: currentSlide?.id,
          presentationStatus,
          handsRaised: activeStateSession.data?.handsRaised || [],
        },
      })
    }

    updateSession()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSlide, presentationStatus])

  useEffect(() => {
    if (!meeting?.id) return

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
        .eq('meeting_id', meeting.id)
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

  useEffect(
    () => {
      if (!meetingSlides) return

      const meetingSlidesWithContent: ISlide[] = meeting?.slides?.map(
        (slide: ISlide) => meetingSlides?.slides?.find((s) => s.id === slide)
      )

      if (!meetingSlidesWithContent || meetingSlidesWithContent.length === 0) {
        return
      }

      setSlides(meetingSlidesWithContent)
      setCurrentSlide(meetingSlidesWithContent[0])
      setLoading(false)
    },

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [meetingSlides]
  )

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

  const nextSlide = () => {
    if (!isHost) return

    const currentIndex = slides.findIndex(
      (slide) => slide.id === currentSlide?.id
    )
    if (currentIndex === slides.length - 1) return

    realtimeChannel.send({
      type: 'broadcast',
      event: 'currentslide-change',
      payload: { slideId: slides[currentIndex + 1].id },
    })
  }

  const previousSlide = () => {
    if (!isHost) return

    const currentIndex = slides.findIndex(
      (slide) => slide.id === currentSlide?.id
    )
    if (currentIndex === 0) return

    realtimeChannel.send({
      type: 'broadcast',
      event: 'currentslide-change',
      payload: { slideId: slides[currentIndex - 1].id },
    })
  }

  const setCurrentSlideByID = (id: string) => {
    const newSlide = slides.find((slide) => slide.id === id)
    if (!newSlide) return
    setCurrentSlide(newSlide)
  }

  const startPresentation = () => {
    realtimeChannel.send({
      type: 'broadcast',
      event: 'presentation-status-change',
      payload: { presentationStatus: PresentationStatuses.STARTED },
    })
  }

  const stopPresentation = () => {
    realtimeChannel.send({
      type: 'broadcast',
      event: 'presentation-status-change',
      payload: { presentationStatus: PresentationStatuses.STOPPED },
    })
  }

  const pausePresentation = () => {
    realtimeChannel.send({
      type: 'broadcast',
      event: 'presentation-status-change',
      payload: { presentationStatus: PresentationStatuses.PAUSED },
    })
  }

  const onVote = async (slide: ISlide, options: string[]) => {
    try {
      const slideResponse = await supabase
        .from('slide_response')
        .upsert({
          response: { selected_options: options },
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

  useEffect(() => {
    if (!currentSlideResponses) return

    const channels = supabase
      .channel('reaction-channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'reaction',

          filter: `slide_response_id=in.(${currentSlideResponses.map((s) => s.id).join(',')})`,
        },
        (payload) => {
          console.log('Change reactions received!', payload)
          let updatedReactions = [...slideReactions]
          if (payload.eventType === 'DELETE') {
            updatedReactions = updatedReactions.filter(
              (r) => r.id !== payload.old.id
            )
          }
          if (payload.eventType === 'INSERT') {
            updatedReactions.push(payload.new)
          }
          setSlideReactions(updatedReactions)
        }
      )
      .subscribe()

    // eslint-disable-next-line consistent-return
    return () => {
      channels.unsubscribe()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSlideResponses, slideReactions])

  const emoteOnReflection = async ({
    participantId,
    reaction,
    slideResponseId,
    reactionId,
  }: {
    participantId: string
    reaction: string
    slideResponseId?: string
    reactionId?: string
  }) => {
    try {
      let reactionQueryResponse
      if (!reactionId) {
        reactionQueryResponse = await supabase.from('reaction').upsert({
          reaction,
          slide_response_id: slideResponseId,
          participant_id: participantId,
        })
      } else {
        reactionQueryResponse = await supabase
          .from('reaction')
          .delete()
          .eq('id', reactionId)
      }

      if (reactionQueryResponse.error) {
        console.error(reactionQueryResponse.error)
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
  }, [activeStateSession?.id])

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

  const changeCurrentSlide = (slide: ISlide) => {
    if (!isHost) return

    realtimeChannel.send({
      type: 'broadcast',
      event: 'currentslide-change',
      payload: { slideId: slide.id },
    })
  }

  const onToggleHandRaised = async ({
    handRaise,
    participantId,
    participantName,
  }: {
    handRaise: boolean
    participantId: string
    participantName: string
  }) => {
    if (!activeStateSession) return

    const prevSessionRaisedHands = activeStateSession?.data?.handsRaised || []
    let updateRaisedHands = prevSessionRaisedHands
    if (handRaise) {
      updateRaisedHands = [
        ...new Set([...prevSessionRaisedHands, participantId]),
      ]

      realtimeChannel.send({
        type: 'broadcast',
        event: 'hand-raised',
        payload: {
          participantId,
          participantName,
        },
      })
    } else {
      updateRaisedHands = prevSessionRaisedHands.filter(
        (i: string) => i !== participantId
      )
    }

    const updateHandRaisedResponse = await supabase.from('session').upsert({
      id: activeStateSession.id,
      data: {
        currentSlideId: currentSlide?.id,
        presentationStatus,
        handsRaised: updateRaisedHands,
      },
    })

    if (updateHandRaisedResponse.error) {
      console.error('failed to update hands raised:', error)
    }
  }
  const updateTypingUsers = async ({
    isTyping,
    participantId,
    participantName,
  }: {
    isTyping: boolean
    participantId: string
    participantName?: string
  }) => {
    if (!activeStateSession) return

    const prevSessionUserTypings = activeStateSession?.data?.typingUsers || []

    let updatedUserTypings = prevSessionUserTypings

    if (isTyping) {
      updatedUserTypings = uniqBy(
        [...updatedUserTypings, { participantId, participantName }],
        (user: { participantId: string; participantName?: string }) =>
          user.participantId
      )
    } else {
      updatedUserTypings = prevSessionUserTypings.filter(
        (user: { participantId: string; participantName?: string }) =>
          user.participantId !== participantId
      )
    }

    const userTypingsResponse = await supabase.from('session').upsert({
      id: activeStateSession.id,
      data: {
        ...activeSession.data,
        typingUsers: updatedUserTypings,
      },
    })

    if (userTypingsResponse.error) {
      console.error('failed to update user typings:', error)
    }
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
        videoMiddlewareConfig,
        activeStateSession,
        syncing,
        slideReactions,
        syncSlides,
        startPresentation,
        stopPresentation,
        pausePresentation,
        setCurrentSlide,
        nextSlide,
        previousSlide,
        setCurrentSlideByID,
        onVote,
        addReflection,
        updateReflection,
        emoteOnReflection,
        joinMeeting,
        reorderSlide,
        moveUpSlide,
        moveDownSlide,
        deleteSlide,
        updateSlide,
        changeCurrentSlide,
        onToggleHandRaised,
        setVideoMiddlewareConfig,
        updateTypingUsers,
      }}>
      {children}
    </EventSessionContext.Provider>
  )
}
