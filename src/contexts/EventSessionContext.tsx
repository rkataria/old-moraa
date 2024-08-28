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
import uniqBy from 'lodash.uniqby'

import { EventContext } from './EventContext'

import type {
  IPollResponse,
  IReflectionResponse,
  IFrame,
  ISection,
} from '@/types/frame.type'

import { useBreakoutRooms } from '@/hooks/useBreakoutRooms'
import { useEnrollment } from '@/hooks/useEnrollment'
import { useEventPermissions } from '@/hooks/useEventPermissions'
import { useFrameReactions } from '@/hooks/useReactions'
import { useRealtimeChannel } from '@/hooks/useRealtimeChannel'
import { useStoreDispatch, useStoreSelector } from '@/hooks/useRedux'
import { useEventSelector } from '@/stores/hooks/useEventSections'
import { updateMeetingSessionDataAction } from '@/stores/slices/event/current-event/live-session.slice'
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

export const EventSessionContext =
  createContext<EventSessionContextType | null>(null)

export function EventSessionProvider({ children }: EventSessionProviderProps) {
  const dispatch = useStoreDispatch()
  const { eventId } = useParams({ strict: false })
  const { meeting: dyteMeeting } = useDyteMeeting()
  const [dyteStates, setDyteStates] = useState<DyteStates>({})
  const { isBreakoutActive } = useBreakoutRooms()
  const { enrollment } = useEnrollment({
    eventId: eventId as string,
  })
  const sections = useEventSelector()
  const currentFrame = useStoreSelector(
    (store) =>
      store.event.currentEvent.frameState.frame.data?.find(
        (frame) =>
          frame.id ===
          store.event.currentEvent.liveSessionState.activeSession.data?.data
            ?.currentFrameId
      ) || null
  )
  const {
    eventMode,
    setCurrentFrame,
    currentFrame: eventContextCurrentFrame,
  } = useContext(EventContext) as EventContextType

  const { permissions } = useEventPermissions()

  const isHost = permissions.canAcessAllSessionControls

  const session = useStoreSelector(
    (state) => state.event.currentEvent.liveSessionState.activeSession.data
  )
  const presentationStatus = useStoreSelector(
    (state) =>
      state.event.currentEvent.liveSessionState.activeSession.data?.data
        ?.presentationStatus
  )
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
  const activeSession = session?.data
  const [videoMiddlewareConfig, setVideoMiddlewareConfig] =
    useState<VideoMiddlewareConfig | null>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [frameReactions, setFrameReactions] = useState<any>([])
  const { data: fetchedFrameReactions } = useFrameReactions(currentFrame?.id)
  const eventSessionMode = useStoreSelector(
    (state) => state.event.currentEvent.liveSessionState.eventSessionMode
  )

  useEffect(() => {
    if (eventContextCurrentFrame?.id) {
      dispatch(
        updateMeetingSessionDataAction({
          currentFrameId: eventContextCurrentFrame?.id,
        })
      )
    }
  }, [dispatch, eventContextCurrentFrame?.id])

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
    if (!eventId || !realtimeChannel) return
    // Listen for hand raised events
    realtimeChannel.on('broadcast', { event: 'hand-raised' }, ({ payload }) => {
      const { participantId, participantName } = payload

      if (!participantId) return

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
    if (!currentFrame || !realtimeChannel) return

    if (!frameHasFrameResponses(currentFrame as IFrame)) {
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

    if (!frameHasFrameResponses(currentFrame as IFrame)) return

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
      sections: sections as ISection[],
      currentFrame: currentFrame as IFrame,
      onlyPublished: !isHost && eventMode !== 'present',
    })

    if (!nextFrame) return null

    dispatch(
      updateMeetingSessionDataAction({
        currentFrameId: nextFrame.id,
      })
    )

    return null
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [realtimeChannel, isHost, sections, currentFrame, eventMode])

  const previousFrame = useCallback(() => {
    if (!isHost) return null
    // eslint-disable-next-line @typescript-eslint/no-shadow
    const previousFrame = getPreviousFrame({
      sections: sections as ISection[],
      currentFrame: currentFrame as IFrame,
      onlyPublished: !isHost && eventMode !== 'present',
    })

    if (!previousFrame) return null

    dispatch(
      updateMeetingSessionDataAction({
        currentFrameId: previousFrame.id,
      })
    )

    return null
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentFrame, eventSessionMode, isHost, sections, eventMode])

  const startPresentation = () => {
    const presentedFrame = currentFrame || sections[0].frames[0]

    dispatch(
      updateMeetingSessionDataAction({
        presentationStatus: PresentationStatuses.STARTED,
        currentFrameId: presentedFrame.id,
      })
    )
  }

  const stopPresentation = () => {
    dispatch(
      updateMeetingSessionDataAction({
        presentationStatus: PresentationStatuses.STOPPED,
      })
    )
  }

  const pausePresentation = () => {
    dispatch(
      updateMeetingSessionDataAction({
        presentationStatus: PresentationStatuses.PAUSED,
      })
    )
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
  const addParticipant = async () => {
    const { data: existingParticipant, error: existingParticipantError } =
      await supabase
        .from('participant')
        .select()
        .eq('session_id', session?.id ?? session?.id)
        .eq('enrollment_id', enrollment?.id)
        .single()

    if (existingParticipantError || !existingParticipant) {
      const { data: createdParticipant, error: createdParticipantError } =
        await supabase
          .from('participant')
          .insert([
            {
              session_id: session?.id ?? session?.id,
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

    const prevSessionRaisedHands = activeSession?.handsRaised || []
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

    dispatch(
      updateMeetingSessionDataAction({
        handsRaised: updateRaisedHands,
      })
    )
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

    const prevSessionUserTypings = activeSession?.typingUsers || []

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

    dispatch(
      updateMeetingSessionDataAction({
        typingUsers: updatedUserTypings,
      })
    )
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
    dispatch(updateMeetingSessionDataAction(data))
  }

  return (
    <EventSessionContext.Provider
      // eslint-disable-next-line react/jsx-no-constructed-context-values
      value={{
        isHost,
        currentFrame: currentFrame as IFrame,
        presentationStatus: presentationStatus as PresentationStatuses,
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
        addParticipant,
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
