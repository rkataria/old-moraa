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

import { Content } from './Content'
import { Footer } from './Footer'
import { Header } from './Header'
import { LeftSidebar } from './LeftSidebar'
import { RightSidebar } from './RightSidebar'
import { FlyingEmojisOverlay } from '../FlyingEmojisOverlay'
import { IdleModeConfirmation } from '../IdleModeConfirmation'

import { CreateUnplannedBreakoutModal } from '@/components/common/breakout/CreateBreakoutModal'
import { Notify } from '@/components/common/breakout/Notify'
import { LiveLayout } from '@/components/common/LiveLayout'
import { RenderIf } from '@/components/common/RenderIf/RenderIf'
import { useEventContext } from '@/contexts/EventContext'
import { useEventSession } from '@/contexts/EventSessionContext'
import { useStoreDispatch, useStoreSelector } from '@/hooks/useRedux'
import { useCurrentFrame } from '@/stores/hooks/useCurrentFrame'
import {
  setIsCreateBreakoutOpenAction,
  updateEventSessionModeAction,
} from '@/stores/slices/event/current-event/live-session.slice'
import { setUpdateTimerOnParticipantJoinAction } from '@/stores/slices/event/current-event/timers.slice'
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

export function MeetingScreen() {
  const { meeting } = useDyteMeeting()
  const { preview, sections, setCurrentFrame } = useEventContext()
  const dispatch = useStoreDispatch()
  const isCreateBreakoutOpen = useStoreSelector(
    (state) =>
      state.event.currentEvent.liveSessionState.breakout.isCreateBreakoutOpen
  )
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
      <DyteNotifications meeting={meeting} />
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
      <CreateUnplannedBreakoutModal
        open={isCreateBreakoutOpen}
        setOpen={() => dispatch(setIsCreateBreakoutOpenAction(false))}
      />
      <IdleModeConfirmation />
      <RenderIf isTrue={isBreakoutStartNotifyOpen}>
        <Notify />
      </RenderIf>
    </LiveLayout>
  )
}
