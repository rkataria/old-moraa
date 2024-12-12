/* eslint-disable react/button-has-type */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

import { useEffect } from 'react'

import { DyteParticipantsAudio } from '@dytesdk/react-ui-kit'
import { useDyteMeeting, useDyteSelector } from '@dytesdk/react-web-core'

import { RecordingLayout } from '../common/RecordingLayout'
import { FlyingEmojisOverlay } from '../event-session/FlyingEmojisOverlay'
import { Content } from '../event-session/MeetingScreen/Content'

import { useEventContext } from '@/contexts/EventContext'
import { useEventSession } from '@/contexts/EventSessionContext'
import { useStoreDispatch } from '@/hooks/useRedux'
import { updateEventSessionModeAction } from '@/stores/slices/event/current-event/live-session.slice'
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

export function RecordingView() {
  const { meeting } = useDyteMeeting()
  const { preview } = useEventContext()
  const dispatch = useStoreDispatch()
  const { isHost, presentationStatus } = useEventSession()
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
    }

    // TODO: Move this code to right place.
    // dispatch(updateEventSessionModeAction(EventSessionMode.LOBBY))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isScreensharing, activePlugin, presentationStatus, preview, isHost])

  return (
    <RecordingLayout>
      <div className="flex flex-col gap-2 h-full">
        <Content />
      </div>
      {/* Emoji Overlay */}
      <FlyingEmojisOverlay />

      {/* Required Dyte Components */}
      <DyteParticipantsAudio meeting={meeting} />
    </RecordingLayout>
  )
}
