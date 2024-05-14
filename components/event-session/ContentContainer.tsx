import { useContext } from 'react'

import {
  DyteAudioVisualizer,
  DyteNameTag,
  DytePluginMain,
  DyteScreenshareView,
} from '@dytesdk/react-ui-kit'
import { useDyteMeeting, useDyteSelector } from '@dytesdk/react-web-core'

import { Slide } from './Slide'
import { SlideControls } from '../common/SlideControls'
import { SlidePreview } from '../common/SlidePreview'

import { EventContext } from '@/contexts/EventContext'
import { EventSessionContext } from '@/contexts/EventSessionContext'
import { EventContextType } from '@/types/event-context.type'
import {
  EventSessionContextType,
  PresentationStatuses,
} from '@/types/event-session.type'

export function ContentContainer() {
  const { currentSlide } = useContext(EventContext) as EventContextType
  const {
    eventSessionMode,
    presentationStatus,
    previousSlide,
    nextSlide,
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

  if (eventSessionMode === 'Preview' && currentSlide && isHost) {
    return (
      <>
        <SlidePreview slide={currentSlide} />
        <SlideControls onPrevious={previousSlide} onNext={nextSlide} />
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

  if (!currentSlide) return null

  return (
    <div className="relative flex flex-col h-full">
      <Slide key={`slide-${currentSlide.id}`} />
      {isHost && (
        <SlideControls onPrevious={previousSlide} onNext={nextSlide} />
      )}
    </div>
  )
}
