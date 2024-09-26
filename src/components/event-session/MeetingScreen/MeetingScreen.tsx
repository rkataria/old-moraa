/* eslint-disable react/button-has-type */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

import { useContext, useEffect } from 'react'

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
import { LiveLayout } from '@/components/common/LiveLayout'
import { EventContext } from '@/contexts/EventContext'
import { useEventSession } from '@/contexts/EventSessionContext'
import { useStoreDispatch, useStoreSelector } from '@/hooks/useRedux'
import {
  setIsCreateBreakoutOpenAction,
  updateEventSessionModeAction,
} from '@/stores/slices/event/current-event/live-session.slice'
import { EventContextType } from '@/types/event-context.type'
import {
  EventSessionMode,
  PresentationStatuses,
} from '@/types/event-session.type'

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
  const { preview } = useContext(EventContext) as EventContextType
  const dispatch = useStoreDispatch()
  const isCreateBreakoutOpen = useStoreSelector(
    (state) =>
      state.event.currentEvent.liveSessionState.breakout.isCreateBreakoutOpen
  )
  const { isHost, presentationStatus, dyteStates, setDyteStates } =
    useEventSession()
  const activePlugin = useDyteSelector((m) => m.plugins.active.toArray()?.[0])
  const selfScreenShared = useDyteSelector((m) => m.self.screenShareEnabled)
  const screensharingParticipant = useDyteSelector((m) =>
    m.participants.joined.toArray().find((p) => p.screenShareEnabled)
  )

  const isScreensharing = !!screensharingParticipant || selfScreenShared

  useEffect(() => {
    if (
      activePlugin ||
      isScreensharing ||
      presentationStatus === PresentationStatuses.STARTED
    ) {
      dispatch(updateEventSessionModeAction(EventSessionMode.PRESENTATION))

      return
    }

    dispatch(updateEventSessionModeAction(EventSessionMode.LOBBY))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isScreensharing, activePlugin, presentationStatus, preview, isHost])

  return (
    <LiveLayout
      header={<Header />}
      leftSidebar={<LeftSidebar />}
      rightSidebar={
        <RightSidebar dyteStates={dyteStates} setDyteStates={setDyteStates} />
      }
      footer={<Footer />}>
      <Content />
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
    </LiveLayout>
  )
}
