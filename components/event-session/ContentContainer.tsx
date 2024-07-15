import { useContext } from 'react'

import {
  DyteAudioVisualizer,
  DyteNameTag,
  DytePluginMain,
  DyteScreenshareView,
} from '@dytesdk/react-ui-kit'
import { useDyteMeeting, useDyteSelector } from '@dytesdk/react-web-core'

import { Frame } from './Frame'
import { FrameControls } from '../common/FrameControls'
import { FramePreview } from '../common/FramePreview'

import { EventContext } from '@/contexts/EventContext'
import { EventSessionContext } from '@/contexts/EventSessionContext'
import { useEventPermissions } from '@/hooks/useEventPermissions'
import { EventContextType } from '@/types/event-context.type'
import {
  EventSessionContextType,
  PresentationStatuses,
} from '@/types/event-session.type'

export function ContentContainer() {
  const { currentFrame } = useContext(EventContext) as EventContextType
  const { permissions } = useEventPermissions()

  const {
    eventSessionMode,
    presentationStatus,
    previousFrame,
    nextFrame,
    isHost,
  } = useContext(EventSessionContext) as EventSessionContextType

  const { meeting } = useDyteMeeting()
  const selfParticipant = useDyteSelector((m) => m.self)
  const activePlugins = useDyteSelector((m) => m.plugins.active.toArray())
  const selfScreenShared = useDyteSelector((m) => m.self.screenShareEnabled)
  const screensharingParticipant = useDyteSelector((m) =>
    m.participants.joined.toArray().find((p) => p.screenShareEnabled)
  )

  const recentActivePlugin = activePlugins?.[activePlugins.length - 1]

  if (eventSessionMode === 'Preview' && currentFrame && isHost) {
    return (
      <>
        <FramePreview
          frame={currentFrame}
          isInteractive={permissions.canAcessAllSessionControls}
        />
        <FrameControls
          onPrevious={previousFrame}
          onNext={nextFrame}
          switchPublishedFrames={!permissions.canAcessAllSessionControls}
        />
      </>
    )
  }

  if (screensharingParticipant) {
    return (
      <DyteScreenshareView
        meeting={meeting}
        participant={screensharingParticipant}
        className="h-full">
        <DyteNameTag participant={screensharingParticipant}>
          <DyteAudioVisualizer
            slot="start"
            participant={screensharingParticipant}
          />
        </DyteNameTag>
      </DyteScreenshareView>
    )
  }

  if (selfScreenShared) {
    return (
      <DyteScreenshareView
        meeting={meeting}
        participant={selfParticipant}
        className="h-full">
        <DyteNameTag participant={selfParticipant}>
          <DyteAudioVisualizer slot="start" participant={selfParticipant} />
        </DyteNameTag>
      </DyteScreenshareView>
    )
  }

  if (recentActivePlugin) {
    return <DytePluginMain meeting={meeting} plugin={recentActivePlugin} />
  }

  if (presentationStatus === PresentationStatuses.STOPPED && !isHost) {
    return null
  }

  if (!currentFrame) return null

  return (
    <div className="relative h-full flex flex-col">
      <Frame key={`frame-${currentFrame.id}`} />
      {isHost && (
        <FrameControls
          onPrevious={previousFrame}
          onNext={nextFrame}
          switchPublishedFrames={!permissions.canAcessAllSessionControls}
        />
      )}
    </div>
  )
}
