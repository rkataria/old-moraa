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

import { EventSessionContext } from '@/contexts/EventSessionContext'
import {
  EventSessionContextType,
  PresentationStatuses,
} from '@/types/event-session.type'

export function ContentContainer() {
  const { presentationStatus, currentSlide } = useContext(
    EventSessionContext
  ) as EventSessionContextType

  const { meeting } = useDyteMeeting()

  const activePlugin = meeting.plugins.active.toArray()?.[0]

  const selfScreenShared = meeting.self.screenShareEnabled
  const screensharingParticipant = useDyteSelector((m) =>
    m.participants.joined.toArray().find((p) => p.screenShareEnabled)
  )

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
        participant={meeting.self}
        className="h-full">
        <DyteNameTag participant={meeting.self}>
          <DyteAudioVisualizer slot="start" participant={meeting.self} />
        </DyteNameTag>
      </DyteScreenshareView>
    )
  }

  if (activePlugin) {
    return <DytePluginMain meeting={meeting} plugin={activePlugin} />
  }

  if (presentationStatus === PresentationStatuses.STOPPED || !currentSlide) {
    return null
  }

  return (
    <div className="relative h-full">
      <Slide key={`slide-${currentSlide.id}`} />
      <SlideControls />
    </div>
  )
}
