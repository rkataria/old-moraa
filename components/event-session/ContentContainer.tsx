import { useContext } from "react"
import {
  DyteAudioVisualizer,
  DyteNameTag,
  DytePluginMain,
  DyteScreenshareView,
} from "@dytesdk/react-ui-kit"
import { useDyteMeeting, useDyteSelector } from "@dytesdk/react-web-core"

import EventSessionContext from "@/contexts/EventSessionContext"
import {
  EventSessionContextType,
  PresentationStatuses,
} from "@/types/event-session.type"
import SlideViewControls from "./SlideViewControls"
import { SlideWrapper } from "./SlideWrapper"
import Slide from "./Slide"

function ContentContainer() {
  const { presentationStatus, isHost } = useContext(
    EventSessionContext
  ) as EventSessionContextType

  const { meeting } = useDyteMeeting()

  const activePlugin = meeting.plugins.active.toArray()?.[0]

  const selfScreenShared = meeting.self.screenShareEnabled
  const screensharingParticipant = useDyteSelector((m) =>
    m.participants.joined.toArray().find((p) => p.screenShareEnabled)
  )

  if (presentationStatus === PresentationStatuses.STOPPED) return null

  if (screensharingParticipant) {
    return (
      <SlideWrapper>
        <DyteScreenshareView
          meeting={meeting}
          participant={screensharingParticipant}
          className="h-full"
        >
          <DyteNameTag participant={screensharingParticipant}>
            <DyteAudioVisualizer
              slot="start"
              participant={screensharingParticipant}
            />
          </DyteNameTag>
        </DyteScreenshareView>
      </SlideWrapper>
    )
  }

  if (selfScreenShared) {
    return (
      <SlideWrapper>
        <DyteScreenshareView
          meeting={meeting}
          participant={meeting.self}
          className="h-full"
        >
          <DyteNameTag participant={meeting.self}>
            <DyteAudioVisualizer slot="start" participant={meeting.self} />
          </DyteNameTag>
        </DyteScreenshareView>
      </SlideWrapper>
    )
  }

  if (activePlugin) {
    return (
      <SlideWrapper>
        <DytePluginMain meeting={meeting} plugin={activePlugin} />
      </SlideWrapper>
    )
  }

  return (
    <SlideWrapper>
      <Slide />
      {isHost && <SlideViewControls />}
    </SlideWrapper>
  )
}

export default ContentContainer
