import { useEffect, useRef } from 'react'

import {
  DyteAudioVisualizer,
  DyteNameTag,
  DytePluginMain,
  DyteScreenshareView,
} from '@dytesdk/react-ui-kit'
import { useDyteMeeting, useDyteSelector } from '@dytesdk/react-web-core'

import { Frame } from '../common/Frame/Frame'
import { SectionOverview } from '../common/SectionOverview'

import { useEventSession } from '@/contexts/EventSessionContext'
import { useStoreSelector } from '@/hooks/useRedux'
import {
  EventSessionMode,
  PresentationStatuses,
} from '@/types/event-session.type'

export function ContentContainer() {
  const dyteScreenshareViewRef = useRef<HTMLDyteScreenshareViewElement>(null)
  const { currentFrame, presentationStatus, isHost, eventSessionMode } =
    useEventSession()
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

  const recentActivePlugin = activePlugins?.[activePlugins.length - 1]

  useEffect(() => {
    if (!dyteScreenshareViewRef.current) return

    setTimeout(() => {
      dyteScreenshareViewRef.current?.shadowRoot
        ?.querySelector('div#video-container')
        ?.setAttribute(
          'style',
          'position: absolute !important; width: 100% !important; max-width: 100% !important;'
        )
    }, 2000)
  }, [dyteScreenshareViewRef, screensharingParticipant, selfScreenShared])

  if (screensharingParticipant) {
    return (
      <DyteScreenshareView
        ref={dyteScreenshareViewRef}
        meeting={meeting}
        participant={screensharingParticipant}>
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
        ref={dyteScreenshareViewRef}
        meeting={meeting}
        participant={selfParticipant}>
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
