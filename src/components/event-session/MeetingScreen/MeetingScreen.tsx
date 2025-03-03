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
import { Button } from '@heroui/button'
import { useParams, useRouter } from '@tanstack/react-router'
import toast from 'react-hot-toast'
import { useHotkeys } from 'react-hotkeys-hook'

import { Content } from './Content'
import { Footer } from './Footer'
import { Header } from './Header'
import { LeftSidebar } from './LeftSidebar'
import { RightSidebar } from './RightSidebar'
import { ChangeLayoutModal } from '../ChangeLayoutModal'
import { FlyingEmojisOverlay } from '../FlyingEmojisOverlay'
import { IdleModeConfirmation } from '../IdleModeConfirmation'
import { RecordingLaunchModal } from '../RecordingLaunchModal'

import { LiveLayout } from '@/components/common/LiveLayout'
import { RenderIf } from '@/components/common/RenderIf/RenderIf'
import { Notify } from '@/components/frames/frame-types/Breakout/Notify'
import { useEventContext } from '@/contexts/EventContext'
import { useEventSession } from '@/contexts/EventSessionContext'
import { useConfirmReloadOrClose } from '@/hooks/useConfirmReloadOrClose'
import { useStoreDispatch, useStoreSelector } from '@/hooks/useRedux'
import { useCurrentFrame } from '@/stores/hooks/useCurrentFrame'
import { updateEventSessionModeAction } from '@/stores/slices/event/current-event/live-session.slice'
import { setUpdateTimerOnParticipantJoinAction } from '@/stores/slices/event/current-event/timers.slice'
import {
  changeContentTilesLayoutConfigAction,
  ContentTilesLayout,
  setRightSidebarAction,
} from '@/stores/slices/layout/live.slice'
import {
  EventSessionMode,
  PresentationStatuses,
} from '@/types/event-session.type'
import { getFirstFrame } from '@/utils/event.util'
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

export function MeetingScreen() {
  useConfirmReloadOrClose()
  const { eventId } = useParams({ strict: false })
  const router = useRouter()
  const { meeting } = useDyteMeeting()
  const { preview, sections, setCurrentFrame } = useEventContext()
  const dispatch = useStoreDispatch()
  const currentFrame = useCurrentFrame()
  const isBreakoutStartNotifyOpen = useStoreSelector(
    (state) => state.event.currentEvent.liveSessionState.breakout.breakoutNotify
  )
  const layout = useStoreSelector(
    (state) => state.layout.live.contentTilesLayoutConfig.layout
  )
  const {
    isHost,
    presentationStatus,
    dyteStates,
    setDyteStates,
    eventSessionMode,
  } = useEventSession()
  const activePlugin = useDyteSelector((m) => m.plugins.active.toArray()?.[0])
  const selfScreenShared = useDyteSelector((m) => m.self.screenShareEnabled)
  const screensharingParticipant = useDyteSelector((m) =>
    m.participants.joined.toArray().find((p) => p.screenShareEnabled)
  )

  useHotkeys('esc', () => {
    if (layout === ContentTilesLayout.Spotlight) {
      dispatch(
        changeContentTilesLayoutConfigAction({
          layout: ContentTilesLayout.Sidebar,
        })
      )

      return
    }
    if (eventSessionMode === EventSessionMode.PEEK) {
      dispatch(updateEventSessionModeAction(EventSessionMode.LOBBY))
    }
  })

  // Purpose of this useEffect is to set the current frame to the first frame of the first section when the meeting starts and there is no current frame.
  useEffect(() => {
    if (currentFrame) return
    if (!getFrameCount(sections)) {
      return
    }

    setCurrentFrame(getFirstFrame(sections))
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
    let isWaitingRoomTostOpen = false

    const onParticipantJoinedWaitlist = () => {
      if (isWaitingRoomTostOpen) return
      isWaitingRoomTostOpen = true
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
                isWaitingRoomTostOpen = false
              }}>
              View
            </Button>
          </div>
        ),
        {
          duration: Infinity,
          id: 'watchlist-update-toast',
        }
      )
    }

    if (meeting.participants.waitlisted.size && !isWaitingRoomTostOpen) {
      onParticipantJoinedWaitlist()
    } else {
      toast.remove('watchlist-update-toast')
    }
    meeting.participants.waitlisted.addListener(
      'participantJoined',
      onParticipantJoinedWaitlist
    )

    return () => {
      meeting.participants.waitlisted.removeListener(
        'participantJoined',
        onParticipantJoinedWaitlist
      )
    }
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
            notification_sounds: {
              participant_joined: false,
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
      <IdleModeConfirmation />
      <RenderIf isTrue={isBreakoutStartNotifyOpen}>
        <Notify />
      </RenderIf>
      <RecordingLaunchModal />
      <ChangeLayoutModal />
    </LiveLayout>
  )
}
