/* eslint-disable consistent-return */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'

import { sendNotification } from '@dytesdk/react-ui-kit'
import { useDyteMeeting } from '@dytesdk/react-web-core'
import { DyteParticipant } from '@dytesdk/web-core'
import { useParams } from '@tanstack/react-router'
import isEqual from 'lodash.isequal'
import uniqBy from 'lodash.uniqby'

import { EventContext } from './EventContext'

import type {
  IPollResponse,
  IReflectionResponse,
  IFrame,
} from '@/types/frame.type'

import { useBreakoutRooms } from '@/hooks/useBreakoutRooms'
import { useEnrollment } from '@/hooks/useEnrollment'
import { useEventPermissions } from '@/hooks/useEventPermissions'
import { useFrameReactions } from '@/hooks/useReactions'
import { useRealtimeChannel } from '@/hooks/useRealtimeChannel'
import { SessionService } from '@/services/session.service'
import { EventContextType } from '@/types/event-context.type'
import {
  type EventSessionContextType,
  type VideoMiddlewareConfig,
  PresentationStatuses,
  DyteStates,
} from '@/types/event-session.type'
import { frameHasFrameResponses } from '@/utils/content.util'
import { getNextFrame, getPreviousFrame } from '@/utils/event-session.utils'
import { supabaseClient } from '@/utils/supabase/client'

const supabase = supabaseClient
interface EventSessionProviderProps {
  children: React.ReactNode
}

export type EventSessionMode = 'Preview' | 'Lobby' | 'Presentation'

export const EventSessionContext =
  createContext<EventSessionContextType | null>(null)

export function EventSessionProvider({ children }: EventSessionProviderProps) {
  const { eventId } = useParams({ strict: false })
  const { meeting: dyteMeeting } = useDyteMeeting()
  const [dyteStates, setDyteStates] = useState<DyteStates>({})
  const { isBreakoutActive } = useBreakoutRooms()
  const { enrollment } = useEnrollment({
    eventId: eventId as string,
  })
  const {
    meeting,
    sections,
    currentFrame,
    eventMode,
    setCurrentFrame,
    getFrameById,
  } = useContext(EventContext) as EventContextType

  const { permissions } = useEventPermissions()

  const isHost = permissions.canAcessAllSessionControls

  const [presentationStatus, setPresentationStatus] =
    useState<PresentationStatuses>(PresentationStatuses.STOPPED)
  const [currentFrameResponses, setCurrentFrameResponses] = useState<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    IReflectionResponse[] | IPollResponse[] | null
  >(null)
  const [currentFrameLoading, setCurrentFrameLoading] = useState<boolean>(true)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [participant, setParticipant] = useState<any>(null)
  const { realtimeChannel } = useRealtimeChannel()
  const [isBreakoutSlide, setIsBreakoutSlide] = useState<boolean>(false)
  const [isCreateBreakoutOpen, setIsCreateBreakoutOpen] =
    useState<boolean>(false)
  const [breakoutSlideId, setBreakoutSlideId] = useState<string | null>(null)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [activeSession, setActiveSession] = useState<any>(null)
  const [videoMiddlewareConfig, setVideoMiddlewareConfig] =
    useState<VideoMiddlewareConfig | null>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [frameReactions, setFrameReactions] = useState<any>([])
  const { data: fetchedFrameReactions } = useFrameReactions(currentFrame?.id)
  const [eventSessionMode, setEventSessionMode] =
    useState<EventSessionMode>('Lobby')

  useEffect(() => {
    if (!currentFrame) return
    if (eventSessionMode === 'Lobby' && isHost) {
      setEventSessionMode('Preview')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentFrame])

  useEffect(() => {
    const handleParticipantJoined = (newParticipant: DyteParticipant) => {
      if (dyteMeeting.participants.count > 3) {
        // joinedParticipant is the newly joined participant in the meet.
        const newJoinedParticipant = dyteMeeting.participants.joined.get(
          newParticipant.id
        )
        newJoinedParticipant?.disableAudio()
      }
    }
    dyteMeeting.participants.joined.on(
      'participantJoined',
      handleParticipantJoined
    )

    return () => {
      dyteMeeting.participants.joined.off(
        'participantJoined',
        handleParticipantJoined
      )
    }
  }, [dyteMeeting])

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
          currentFrameId?: string
        }
      }

      const newPresentationStatus =
        _activeSession.data?.presentationStatus || PresentationStatuses.STOPPED

      setPresentationStatus(newPresentationStatus)
      setActiveSession(_activeSession)

      if (newPresentationStatus === PresentationStatuses.STOPPED) {
        setEventSessionMode('Lobby')
      } else if (sections?.length > 0) {
        const _currentFrame = sections
          .flatMap((s) => s.frames)
          .find((s) => s.id === _activeSession.data?.currentFrameId)
        setCurrentFrame(_currentFrame || (sections[0].frames || [])[0])
      }
    }

    fetchActiveSession()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meeting?.id, sections])

  // Create a channel for the event
  useEffect(() => {
    if (!eventId || !realtimeChannel) return

    // Listen for frame change events
    realtimeChannel.on(
      'broadcast',
      { event: 'currentframe-change' },
      ({ payload }) => {
        const frameId = payload?.frameId

        if (!frameId) return

        const section = sections.find((s) =>
          s.frames.some((frame) => frame.id === frameId)
        )
        if (!section) return

        const frame = section.frames.find((s) => s.id === frameId)
        if (!frame) return

        if (frame.id === currentFrame?.id) return

        setCurrentFrame(frame)
      }
    )

    // Listen for presentation status change events
    realtimeChannel.on(
      'broadcast',
      { event: 'presentation-status-change' },
      ({ payload }) => {
        const { newPresentationStatus, currentFrameId } = payload ?? {}
        if (!newPresentationStatus) return

        const getNewEventSessionMode = () => {
          if (newPresentationStatus !== PresentationStatuses.STOPPED) {
            return 'Presentation'
          }
          if (isHost) return 'Preview'

          return 'Lobby'
        }

        // Get the presented frame by id
        const presentationFrame = getFrameById(currentFrameId)
        // Return if presentation is started but frame is not found
        if (
          newPresentationStatus === PresentationStatuses.STARTED &&
          !presentationFrame
        ) {
          return
        }

        const newEventSessionMode = getNewEventSessionMode()

        setEventSessionMode(newEventSessionMode)
        setPresentationStatus(newPresentationStatus)
        setCurrentFrame(presentationFrame)

        if (newPresentationStatus === PresentationStatuses.STOPPED) {
          setEventSessionMode('Lobby')
        }
      }
    )

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [realtimeChannel, eventId, sections])

  useEffect(() => {
    if (!eventId || !realtimeChannel) return
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
        window.dispatchEvent(
          new CustomEvent('reaction_added', { detail: { emoji, name } })
        )
      }
    )
  }, [realtimeChannel, eventId])

  useEffect(() => {
    if (!fetchedFrameReactions) return
    if (!fetchedFrameReactions.length) return

    if (
      JSON.stringify(fetchedFrameReactions) === JSON.stringify(frameReactions)
    ) {
      return
    }

    setFrameReactions(fetchedFrameReactions)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchedFrameReactions])

  useEffect(() => {
    if (!isHost) return
    if (!activeSession) return

    if (
      activeSession?.data?.currentFrameId === currentFrame?.id &&
      activeSession?.data?.presentationStatus === presentationStatus
    ) {
      return
    }
    if (eventSessionMode !== 'Preview') {
      updateActiveSession({
        currentFrameId: currentFrame?.id,
        presentationStatus,
      })
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    currentFrame,
    presentationStatus,
    eventSessionMode,
    activeSession?.data?.currentFrameId,
    activeSession?.data?.presentationStatus,
  ])

  useEffect(() => {
    if (!currentFrame || !realtimeChannel) return

    if (
      !isBreakoutActive &&
      isHost &&
      eventSessionMode === 'Presentation' &&
      !currentFrame.content?.breakoutFrameId
    ) {
      realtimeChannel?.send({
        type: 'broadcast',
        event: 'currentframe-change',
        payload: { frameId: currentFrame.id },
      })
    }

    if (!frameHasFrameResponses(currentFrame)) {
      setCurrentFrameLoading(false)

      return
    }

    setCurrentFrameLoading(true)

    // Fetch current frame responses
    const fetchCurrentFrameResponses = async () => {
      const { data, error: _error } = await supabase
        .from('frame_response')
        .select(
          '* , participant:participant_id(*, enrollment:enrollment_id(*, profile:user_id(*)))'
        )
        .eq('frame_id', currentFrame.id)
      // .eq('dyte_meeting_id', dyteMeeting.meta.meetingId)

      if (_error) {
        console.error(_error)
        setCurrentFrameLoading(false)

        return
      }

      setCurrentFrameResponses(data)
      setCurrentFrameLoading(false)
    }

    fetchCurrentFrameResponses()

    if (!frameHasFrameResponses(currentFrame)) return

    const channels = supabase
      .channel('frame-response-channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'frame_response',
          filter: `dyte_meeting_id=eq.${dyteMeeting.meta.meetingId}`,
        },
        (payload) => {
          if (['INSERT', 'UPDATE'].includes(payload.eventType)) {
            fetchCurrentFrameResponses()
          }
        }
      )
      .subscribe()

    // eslint-disable-next-line consistent-return
    return () => {
      channels.unsubscribe()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [realtimeChannel, currentFrame, eventSessionMode])

  useEffect(() => {
    if (!isBreakoutActive && breakoutSlideId) {
      setBreakoutSlideId(null)
    } else if (isBreakoutActive && !breakoutSlideId) {
      setBreakoutSlideId(currentFrame?.id || null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isBreakoutActive, currentFrame])

  const nextFrame = useCallback(() => {
    if (!isHost || !realtimeChannel) return null
    // eslint-disable-next-line @typescript-eslint/no-shadow
    const nextFrame = getNextFrame({
      sections,
      currentFrame,
      onlyPublished: !isHost && eventMode !== 'present',
    })

    if (!nextFrame) return null

    if (eventSessionMode === 'Preview') {
      setCurrentFrame(nextFrame)

      return null
    }

    realtimeChannel?.send({
      type: 'broadcast',
      event: 'currentframe-change',
      payload: { frameId: nextFrame.id },
    })

    return null
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    realtimeChannel,
    isHost,
    sections,
    currentFrame,
    eventSessionMode,
    eventMode,
  ])

  const previousFrame = useCallback(() => {
    if (!isHost) return null
    // eslint-disable-next-line @typescript-eslint/no-shadow
    const previousFrame = getPreviousFrame({
      sections,
      currentFrame,
      onlyPublished: !isHost && eventMode !== 'present',
    })

    if (!previousFrame) return null

    if (eventSessionMode === 'Preview') {
      setCurrentFrame(previousFrame)

      return null
    }

    realtimeChannel?.send({
      type: 'broadcast',
      event: 'currentframe-change',
      payload: { frameId: previousFrame.id },
    })

    return null
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentFrame, eventSessionMode, isHost, sections, eventMode])

  const startPresentation = () => {
    const presentedFrame = currentFrame || sections[0].frames[0]

    realtimeChannel?.send({
      type: 'broadcast',
      event: 'presentation-status-change',
      payload: {
        newPresentationStatus: PresentationStatuses.STARTED,
        currentFrameId: presentedFrame.id,
      },
    })
  }

  const stopPresentation = () => {
    realtimeChannel?.send({
      type: 'broadcast',
      event: 'presentation-status-change',
      payload: { newPresentationStatus: PresentationStatuses.STOPPED },
    })
  }

  const pausePresentation = () => {
    realtimeChannel?.send({
      type: 'broadcast',
      event: 'presentation-status-change',
      payload: { newPresentationStatus: PresentationStatuses.PAUSED },
    })
  }

  const onVote = async (
    frame: IFrame,
    {
      selectedOptions,
      anonymous,
    }: {
      selectedOptions: string[]
      anonymous: boolean
    }
  ) => {
    try {
      const frameResponse = await supabase
        .from('frame_response')
        .upsert({
          response: { selected_options: selectedOptions, anonymous },
          frame_id: frame.id,
          participant_id: participant.id,
          dyte_meeting_id: dyteMeeting.meta.meetingId,
        })
        .eq('frame_id', frame.id)
        .eq('participant_id', participant.id)
        .select()

      if (frameResponse.error) {
        console.error(frameResponse.error)
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
      const frameResponse = await supabase
        .from('frame_response')
        .update({
          response: { anonymous, ...rest },
        })
        .eq('id', responseId)
        .select()

      if (frameResponse.error) {
        console.error(frameResponse.error)
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (_error: any) {
      console.error(_error)
    }
  }

  const addReflection = async ({
    frame,
    reflection,
    username,
    anonymous,
  }: {
    frame: IFrame
    reflection: string
    username: string
    anonymous: boolean
  }) => {
    try {
      const frameResponse = await supabase
        .from('frame_response')
        .upsert({
          response: {
            reflection,
            username,
            anonymous,
          },
          frame_id: frame.id,
          participant_id: participant.id,
          dyte_meeting_id: dyteMeeting.meta.meetingId,
        })
        .eq('frame_id', frame.id)
        .eq('participant_id', participant.id)
        .select()

      if (frameResponse.error) {
        console.error(frameResponse.error)
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
      const frameResponse = await supabase.from('frame_response').upsert({
        id,
        response: {
          reflection,
          username,
          anonymous,
        },
      })

      if (frameResponse.error) {
        console.error(frameResponse.error)
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (_error: any) {
      console.error(_error)
    }
  }

  useEffect(() => {
    if (!currentFrameResponses) return

    const channels = supabase
      .channel('reaction-channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'reaction',

          filter: `frame_response_id=in.(${currentFrameResponses.map((s) => s.id).join(',')})`,
        },
        (payload) => {
          console.log('Change reactions received!', payload)
          let updatedReactions = [...frameReactions]
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
          setFrameReactions(updatedReactions)
        }
      )
      .subscribe()

    // eslint-disable-next-line consistent-return
    return () => {
      channels.unsubscribe()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentFrameResponses, frameReactions])

  const emoteOnReflection = async ({
    participantId,
    reaction,
    frameResponseId,
    reactionId,
    action,
  }: {
    participantId: string
    reaction: string
    frameResponseId?: string
    reactionId?: string
    action: string
  }) => {
    try {
      let reactionQueryResponse

      if (action === 'INSERT') {
        reactionQueryResponse = await supabase.from('reaction').upsert({
          reaction,
          frame_response_id: frameResponseId,
          participant_id: participantId,
          dyte_meeting_id: dyteMeeting.meta.meetingId,
        })
      }
      if (action === 'UPDATE') {
        reactionQueryResponse = await supabase
          .from('reaction')
          .update({
            reaction,
          })
          .eq('participant_id', participantId)
          .eq('frame_response_id', frameResponseId)
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
      setActiveSession(createSessionResponse?.data)
      await addParticipant(createSessionResponse.data)

      return
    }

    setActiveSession(getActiveSessionResponse.data)
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
          filter: `id=eq.${activeSession?.id}&status=ACTIVE`,
        },
        (payload) => {
          if (!payload?.new) return

          if (isEqual(payload?.new, activeSession)) return

          setActiveSession(payload?.new)
        }
      )
      .subscribe()

    return () => {
      channels.unsubscribe()
    }
  }, [activeSession])

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

      realtimeChannel?.send({
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
    realtimeChannel?.send({
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
        isHost,
        currentFrame,
        presentationStatus,
        currentFrameResponses,
        currentFrameLoading,
        participant,
        videoMiddlewareConfig,
        activeSession,
        frameReactions,
        realtimeChannel,
        eventSessionMode,
        dyteStates,
        setDyteStates,
        isCreateBreakoutOpen,
        setIsCreateBreakoutOpen,
        isBreakoutSlide,
        setIsBreakoutSlide,
        breakoutSlideId,
        setBreakoutSlideId,
        setEventSessionMode,
        startPresentation,
        stopPresentation,
        pausePresentation,
        setCurrentFrame,
        nextFrame,
        previousFrame,
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

export function useEventSession() {
  const context = useContext(EventSessionContext) as EventSessionContextType

  // if (!context) {
  //   throw new Error('useEventSession must be used within EventSessionProvider')
  // }

  return context
}
