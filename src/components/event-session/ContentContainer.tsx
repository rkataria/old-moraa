import {
  DyteAudioVisualizer,
  DyteNameTag,
  DytePluginMain,
  DyteScreenshareView,
} from '@dytesdk/react-ui-kit'
import { useDyteMeeting, useDyteSelector } from '@dytesdk/react-web-core'
import { useHotkeys } from 'react-hotkeys-hook'

import { Frame } from '../common/Frame/Frame'
import { SectionOverview } from '../common/SectionOverview'

import { useEventSession } from '@/contexts/EventSessionContext'
import { useStoreDispatch, useStoreSelector } from '@/hooks/useRedux'
import { updateEventSessionModeAction } from '@/stores/slices/event/current-event/live-session.slice'
import {
  EventSessionMode,
  PresentationStatuses,
} from '@/types/event-session.type'

export function ContentContainer() {
  const { currentFrame, presentationStatus, isHost, eventSessionMode } =
    useEventSession()
  const dispatch = useStoreDispatch()
  const { meeting } = useDyteMeeting()
  const selfParticipant = useDyteSelector((m) => m.self)
  const activePlugins = useDyteSelector((m) => m.plugins.active.toArray())
  const selfScreenShared = useDyteSelector((m) => m.self.screenShareEnabled)
  const screensharingParticipant = useDyteSelector((m) =>
    m.participants.joined.toArray().find((p) => p.screenShareEnabled)
  )
  const currentSectionId = useStoreSelector(
    (state) => state.event.currentEvent.eventState.currentSectionId
  )

  useHotkeys('esc', () => {
    if (eventSessionMode === EventSessionMode.PEEK) {
      dispatch(updateEventSessionModeAction(EventSessionMode.LOBBY))
    }
  })

  const recentActivePlugin = activePlugins?.[activePlugins.length - 1]

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
    return (
      <div className="relative h-full w-full">
        <div className="absolute right-0 top-0 w-8 h-8 rounded-full bg-[#f5f5f5]" />
        <DytePluginMain meeting={meeting} plugin={recentActivePlugin} />
      </div>
    )
  }

  if (presentationStatus === PresentationStatuses.STOPPED && !isHost) {
    return null
  }

  if (currentSectionId) {
    return <SectionOverview />
  }

  if (currentFrame) {
    if (eventSessionMode === EventSessionMode.PEEK) {
      return <Frame frame={currentFrame} />
    }

    return (
      <div className="relative h-full flex flex-col">
        <Frame key={`frame-${currentFrame.id}`} frame={currentFrame} />
      </div>
    )
  }

  return null
}
