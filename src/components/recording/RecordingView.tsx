/* eslint-disable react/button-has-type */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

import { useEffect } from 'react'

import {
  DyteDialogManager,
  DyteNotifications,
  DyteParticipantsAudio,
} from '@dytesdk/react-ui-kit'
import { useDyteMeeting, useDyteSelector } from '@dytesdk/react-web-core'
import { DyteParticipant, leaveRoomState } from '@dytesdk/web-core'
import { Button } from '@nextui-org/button'
import { useParams, useRouter } from '@tanstack/react-router'
import toast from 'react-hot-toast'

import { FlyingEmojisOverlay } from '../event-session/FlyingEmojisOverlay'
import { Content } from '../event-session/MeetingScreen/Content'
import { Footer } from '../event-session/MeetingScreen/Footer'
import { Header } from '../event-session/MeetingScreen/Header'
import { LeftSidebar } from '../event-session/MeetingScreen/LeftSidebar'
import { RightSidebar } from '../event-session/MeetingScreen/RightSidebar'

import { Notify } from '@/components/common/breakout/Notify'
import { LiveLayout } from '@/components/common/LiveLayout'
import { RenderIf } from '@/components/common/RenderIf/RenderIf'
import { useEventContext } from '@/contexts/EventContext'
import { useEventSession } from '@/contexts/EventSessionContext'
import { useStoreDispatch, useStoreSelector } from '@/hooks/useRedux'
import { useCurrentFrame } from '@/stores/hooks/useCurrentFrame'
import { updateEventSessionModeAction } from '@/stores/slices/event/current-event/live-session.slice'
import { setUpdateTimerOnParticipantJoinAction } from '@/stores/slices/event/current-event/timers.slice'
import { setRightSidebarAction } from '@/stores/slices/layout/live.slice'
import {
  EventSessionMode,
  PresentationStatuses,
} from '@/types/event-session.type'
import { getFrameCount } from '@/utils/utils'

export type RightSiderbar =
  | 'participants'
  | 'chat'
  | 'plugins'
  | 'ai-chat'
  | 'notes'
  | 'breakout'

export type DyteStates = {
  [key: string]: string | boolean
}

export function RecordingView() {
  const { eventId } = useParams({ strict: false })
  const router = useRouter()
  const { meeting } = useDyteMeeting()
  const { preview, sections, setCurrentFrame } = useEventContext()
  const dispatch = useStoreDispatch()
  const currentFrame = useCurrentFrame()
  const isBreakoutStartNotifyOpen = useStoreSelector(
    (state) => state.event.currentEvent.liveSessionState.breakout.breakoutNotify
  )
  const { isHost, presentationStatus, dyteStates, setDyteStates } =
    useEventSession()
  const activePlugin = useDyteSelector((m) => m.plugins.active.toArray()?.[0])
  const selfScreenShared = useDyteSelector((m) => m.self.screenShareEnabled)
  const screensharingParticipant = useDyteSelector((m) =>
    m.participants.joined.toArray().find((p) => p.screenShareEnabled)
  )

  // Purpose of this useEffect is to set the current frame to the first frame of the first section when the meeting starts and there is no current frame.
  useEffect(() => {
    if (currentFrame) return
    if (!getFrameCount(sections)) {
      return
    }

    // TODO: Write a util to get the first frame
    setCurrentFrame(sections[0].frames[0])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const isScreensharing = !!screensharingParticipant || selfScreenShared

  useEffect(() => {
    if (
      activePlugin ||
      isScreensharing ||
      presentationStatus === PresentationStatuses.STARTED
    ) {
      dispatch(updateEventSessionModeAction(EventSessionMode.PRESENTATION))
    }

    // TODO: Move this code to right place.
    // dispatch(updateEventSessionModeAction(EventSessionMode.LOBBY))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isScreensharing, activePlugin, presentationStatus, preview, isHost])

  useEffect(() => {
    if (!meeting || !isHost) return
    const handleParticipantJoined = () => {
      if (isHost) {
        dispatch(setUpdateTimerOnParticipantJoinAction(true))
      }
    }

    meeting.participants.joined.on('participantJoined', handleParticipantJoined)

    function onUnmount() {
      meeting.participants.joined.off(
        'participantJoined',
        handleParticipantJoined
      )
    }

    // eslint-disable-next-line consistent-return
    return onUnmount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meeting, isHost])

  useEffect(() => {
    if (!meeting) return

    const handleParticipantLeft = (
      payload: { state: leaveRoomState } | DyteParticipant
    ) => {
      const { state } = payload as { state: leaveRoomState }

      if (state === 'ended' || state === 'left') {
        router.navigate({
          to: `/events/${eventId}`,
          search: { action: 'edit', tab: 'landing-page' },
        })
      }
    }

    meeting.self.on('roomLeft', handleParticipantLeft)

    function onUnmount() {
      meeting.participants.joined.off(
        'participantJoined',
        handleParticipantLeft
      )
    }

    // eslint-disable-next-line consistent-return
    return onUnmount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meeting])

  useEffect(() => {
    const promptHostForPendingParticipants = () => {
      toast(
        ({ id }) => (
          <div>
            Someone is waiting to join.
            <Button
              size="sm"
              variant="light"
              onClick={() => {
                setDyteStates({
                  activeSidebar: true,
                  sidebar: 'participants',
                })
                dispatch(setRightSidebarAction('participants'))
                toast.remove(id)
              }}>
              View
            </Button>
          </div>
        ),
        {
          duration: Infinity,
        }
      )
    }

    if (meeting.participants.waitlisted.size) promptHostForPendingParticipants()
    meeting.participants.waitlisted.addListener(
      'participantJoined',
      promptHostForPendingParticipants
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <LiveLayout
      header={<Header />}
      leftSidebar={<LeftSidebar />}
      rightSidebar={
        <RightSidebar dyteStates={dyteStates} setDyteStates={setDyteStates} />
      }
      footer={<Footer />}>
      <div className="flex flex-col gap-2 h-full">
        <Content />
      </div>
      {/* Emoji Overlay */}
      <FlyingEmojisOverlay />

      {/* Required Dyte Components */}
      <DyteParticipantsAudio meeting={meeting} />
      <DyteNotifications
        meeting={meeting}
        config={{
          config: {
            notifications: {
              participant_joined_waitlist: false,
            },
          },
        }}
      />
      <DyteDialogManager
        meeting={meeting}
        states={dyteStates}
        onDyteStateUpdate={(e) => {
          setDyteStates((prevDyteStates) => ({
            ...prevDyteStates,
            ...e.detail,
          }))
        }}
      />
      <RenderIf isTrue={isBreakoutStartNotifyOpen}>
        <Notify />
      </RenderIf>
    </LiveLayout>
  )
}
