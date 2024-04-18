/* eslint-disable consistent-return */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'

import { sendNotification } from '@dytesdk/react-ui-kit'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { RealtimeChannel } from '@supabase/supabase-js'
import uniqBy from 'lodash.uniqby'
import { useParams } from 'next/navigation'

import { EventContext } from './EventContext'

import { useEnrollment } from '@/hooks/useEnrollment'
import { useSlideReactions } from '@/hooks/useReactions'
import { SessionService } from '@/services/session.service'
import { EventContextType } from '@/types/event-context.type'
import {
  EventSessionContextType,
  PresentationStatuses,
  VideoMiddlewareConfig,
} from '@/types/event-session.type'
import { ISlide } from '@/types/slide.type'
import { getNextSlide, getPreviousSlide } from '@/utils/event-session.utils'

interface EventSessionProviderProps {
  children: React.ReactNode
}

export type EventSessionMode = 'Preview' | 'Lobby' | 'Presentation'

let realtimeChannel: RealtimeChannel
const supabase = createClientComponentClient()

export const EventSessionContext =
  createContext<EventSessionContextType | null>(null)

export function EventSessionProvider({ children }: EventSessionProviderProps) {
  const { eventId } = useParams()
  const { enrollment } = useEnrollment({
    eventId: eventId as string,
  })
  const { isOwner, meeting, sections, currentSlide, setCurrentSlide } =
    useContext(EventContext) as EventContextType

  const [presentationStatus, setPresentationStatus] =
    useState<PresentationStatuses>(PresentationStatuses.STOPPED)
  const [currentSlideResponses, setCurrentSlideResponses] = useState<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    any[] | null
  >(null)
  const [currentSlideLoading, setCurrentSlideLoading] = useState<boolean>(true)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [participant, setParticipant] = useState<any>(null)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [activeSession, setActiveSession] = useState<any>(null)
  const [videoMiddlewareConfig, setVideoMiddlewareConfig] =
    useState<VideoMiddlewareConfig | null>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [slideReactions, setSlideReactions] = useState<any>([])
  const { data: fetchedSlideReactions } = useSlideReactions(currentSlide?.id)
  const [eventSessionMode, setEventSessionMode] =
    useState<EventSessionMode>('Lobby')

  useEffect(() => {
    if (isOwner) {
      setEventSessionMode('Preview')
    }
  }, [isOwner])

  useEffect(() => {
    if (!meeting?.id) return

    const fetchActiveSession = async () => {
      const getActiveSessionResponse = await SessionService.getActiveSession({
        meetingId: meeting.id,
      })

      if (getActiveSessionResponse?.error || !getActiveSessionResponse?.data) {
        console.error(
          'failed to fetch active session:',
          getActiveSessionResponse
        )

        return
      }

      const _activeSession = getActiveSessionResponse.data as {
        data: {
          presentationStatus?: PresentationStatuses
          currentSlideId?: string
        }
      }

      if (sections?.length > 0) {
        const _currentSlide = sections
          .flatMap((s) => s.slides)
          .find((s) => s.id === _activeSession.data?.currentSlideId)
        setCurrentSlide(_currentSlide || (sections[0].slides || [])[0])
      }

      setPresentationStatus(
        _activeSession.data?.presentationStatus || PresentationStatuses.STOPPED
      )
      setActiveSession(_activeSession)
    }

    fetchActiveSession()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meeting?.id, sections])

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

        const section = sections.find((s) =>
          s.slides.some((slide) => slide.id === slideId)
        )
        if (!section) return

        const slide = section.slides.find((s) => s.id === slideId)
        if (!slide) return

        setCurrentSlide(slide)
      }
    )

    // Listen for presentation status change events
    realtimeChannel.on(
      'broadcast',
      { event: 'presentation-status-change' },
      ({ payload }) => {
        if (payload?.presentationStatus === PresentationStatuses.STARTED) {
          setEventSessionMode('Presentation')
          setPresentationStatus(PresentationStatuses.STARTED)
        } else if (
          payload?.presentationStatus === PresentationStatuses.PAUSED
        ) {
          setEventSessionMode('Presentation')
          setPresentationStatus(PresentationStatuses.PAUSED)
        } else {
          setEventSessionMode(isOwner ? 'Preview' : 'Lobby')
          setPresentationStatus(PresentationStatuses.STOPPED)
        }
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

    // Listen for flying emoji events
    realtimeChannel.on(
      'broadcast',
      { event: 'flying-emoji' },
      ({ payload }) => {
        const { emoji, name } = payload

        if (!emoji) return
        console.log('emoji received', emoji)
        window.dispatchEvent(
          new CustomEvent('reaction_added', { detail: { emoji, name } })
        )
      }
    )

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId, sections, isOwner])

  useEffect(() => {
    if (!fetchedSlideReactions) return
    if (!fetchedSlideReactions.length) return

    if (
      JSON.stringify(fetchedSlideReactions) === JSON.stringify(slideReactions)
    ) {
      return
    }

    setSlideReactions(fetchedSlideReactions)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchedSlideReactions])

  useEffect(() => {
    if (eventSessionMode !== 'Presentation') return
    if (!isOwner) return
    if (!activeSession) return

    updateActiveSession({
      currentSlideId: currentSlide?.id,
      presentationStatus,
    })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSlide, presentationStatus])

  useEffect(() => {
    if (!currentSlide) return

    if (isOwner && eventSessionMode === 'Presentation') {
      realtimeChannel.send({
        type: 'broadcast',
        event: 'currentslide-change',
        payload: { slideId: currentSlide.id },
      })
    }

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
  }, [currentSlide, eventSessionMode])

  const nextSlide = useCallback(() => {
    if (!isOwner) return null
    // eslint-disable-next-line @typescript-eslint/no-shadow
    const nextSlide = getNextSlide({ sections, currentSlide })

    if (!nextSlide) return null

    if (eventSessionMode === 'Preview') {
      setCurrentSlide(nextSlide)

      return null
    }

    realtimeChannel.send({
      type: 'broadcast',
      event: 'currentslide-change',
      payload: { slideId: nextSlide.id },
    })

    return null
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOwner, sections, currentSlide, eventSessionMode])

  const previousSlide = useCallback(() => {
    if (!isOwner) return null
    // eslint-disable-next-line @typescript-eslint/no-shadow
    const previousSlide = getPreviousSlide({ sections, currentSlide })

    if (!previousSlide) return null

    if (eventSessionMode === 'Preview') {
      setCurrentSlide(previousSlide)

      return null
    }

    realtimeChannel.send({
      type: 'broadcast',
      event: 'currentslide-change',
      payload: { slideId: previousSlide.id },
    })

    return null
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSlide, eventSessionMode, isOwner, sections])

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

  const onVote = async (
    slide: ISlide,
    {
      selectedOptions,
      anonymous,
    }: {
      selectedOptions: string[]
      anonymous: boolean
    }
  ) => {
    try {
      const slideResponse = await supabase
        .from('slide_response')
        .upsert({
          response: { selected_options: selectedOptions, anonymous },
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

  const onUpdateVote = async (
    responseId: string,
    {
      anonymous,
      ...rest
    }: {
      anonymous: boolean
    }
  ) => {
    try {
      const slideResponse = await supabase
        .from('slide_response')
        .update({
          response: { anonymous, ...rest },
        })
        .eq('id', responseId)
        .select()

      if (slideResponse.error) {
        console.error(slideResponse.error)
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (_error: any) {
      console.error(_error)
    }
  }

  const addReflection = async ({
    slide,
    reflection,
    username,
    anonymous,
  }: {
    slide: ISlide
    reflection: string
    username: string
    anonymous: boolean
  }) => {
    try {
      const slideResponse = await supabase
        .from('slide_response')
        .upsert({
          response: {
            reflection,
            username,
            anonymous,
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
  const updateReflection = async ({
    id,
    reflection,
    username,
    anonymous,
  }: {
    id: string
    reflection: string
    username: string
    anonymous: boolean
  }) => {
    try {
      const slideResponse = await supabase.from('slide_response').upsert({
        id,
        response: {
          reflection,
          username,
          anonymous,
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

          if (payload.eventType === 'UPDATE') {
            updatedReactions = updatedReactions.map((reaction) => {
              if (reaction.id === payload.old.id) {
                return payload.new
              }

              return reaction
            })
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
    action,
  }: {
    participantId: string
    reaction: string
    slideResponseId?: string
    reactionId?: string
    action: string
  }) => {
    try {
      let reactionQueryResponse

      if (action === 'INSERT') {
        reactionQueryResponse = await supabase.from('reaction').upsert({
          reaction,
          slide_response_id: slideResponseId,
          participant_id: participantId,
        })
      }
      if (action === 'UPDATE') {
        reactionQueryResponse = await supabase
          .from('reaction')
          .update({
            reaction,
          })
          .eq('participant_id', participantId)
          .eq('slide_response_id', slideResponseId)
      }
      if (action === 'DELETE') {
        reactionQueryResponse = await supabase
          .from('reaction')
          .delete()
          .eq('id', reactionId)
      }

      if (reactionQueryResponse?.error) {
        console.error(reactionQueryResponse?.error)
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (_error: any) {
      console.error(_error)
    }
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
        console.error('failed to create participant:', createdParticipantError)

        return
      }
      setParticipant(createdParticipant)

      return
    }
    setParticipant(existingParticipant)
  }

  const joinMeeting = async () => {
    // check if active session exists, else create one
    const getActiveSessionResponse = await SessionService.getActiveSession({
      meetingId: meeting?.id,
    })

    if (getActiveSessionResponse?.error || !getActiveSessionResponse?.data) {
      // create new session in active state
      const createSessionResponse = await SessionService.createSession({
        meetingId: meeting?.id,
      })

      if (createSessionResponse?.error || !createSessionResponse?.data) {
        console.error(
          'failed to create session, error: ',
          createSessionResponse
        )

        return
      }

      await addParticipant(createSessionResponse.data)

      return
    }

    await addParticipant(getActiveSessionResponse.data)
  }

  useEffect(() => {
    if (!activeSession?.id) return

    const channels = supabase
      .channel('session-channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'session',
          filter: `id=eq.${activeSession?.id}`,
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
  }, [activeSession?.id])

  const onToggleHandRaised = async ({
    handRaise,
    participantId,
    participantName,
  }: {
    handRaise: boolean
    participantId: string
    participantName: string
  }) => {
    if (!activeSession) return

    const prevSessionRaisedHands = activeSession?.data?.handsRaised || []
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

    await updateActiveSession({
      handsRaised: updateRaisedHands,
    })
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
    if (!activeSession) return

    const prevSessionUserTypings = activeSession?.data?.typingUsers || []

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

    await updateActiveSession({
      typingUsers: updatedUserTypings,
    })
  }

  const flyEmoji = ({ emoji, name }: { emoji: string; name: string }) => {
    realtimeChannel.send({
      type: 'broadcast',
      event: 'flying-emoji',
      payload: {
        emoji,
        name,
      },
    })
  }

  const updateActiveSession = async (data: object) => {
    if (!activeSession) return

    const updateSessionResponse = await SessionService.updateSession({
      sessionPayload: {
        data: {
          ...activeSession.data,
          ...data,
        },
      },
      sessionId: activeSession.id,
    })

    if (updateSessionResponse?.error) {
      console.error('failed to update session:', updateSessionResponse.error)
    }
  }

  return (
    <EventSessionContext.Provider
      // eslint-disable-next-line react/jsx-no-constructed-context-values
      value={{
        isHost: isOwner,
        currentSlide,
        presentationStatus,
        currentSlideResponses,
        currentSlideLoading,
        participant,
        videoMiddlewareConfig,
        activeSession,
        slideReactions,
        realtimeChannel,
        eventSessionMode,
        setEventSessionMode,
        startPresentation,
        stopPresentation,
        pausePresentation,
        setCurrentSlide,
        nextSlide,
        previousSlide,
        onVote,
        onUpdateVote,
        addReflection,
        updateReflection,
        emoteOnReflection,
        joinMeeting,
        onToggleHandRaised,
        setVideoMiddlewareConfig,
        updateTypingUsers,
        flyEmoji,
        updateActiveSession,
      }}>
      {children}
    </EventSessionContext.Provider>
  )
}
