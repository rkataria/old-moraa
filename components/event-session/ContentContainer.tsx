import { useDyteMeeting } from "@dytesdk/react-web-core"
import Slide from "./Slide"
import { DytePluginMain } from "@dytesdk/react-ui-kit"
import { useContext } from "react"
import EventSessionContext from "@/contexts/EventSessionContext"
import {
  EventSessionContextType,
  PresentationStatuses,
} from "@/types/event-session.type"
import SlideViewControls from "./SlideViewControls"

const ContentWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex-auto bg-gray-100 p-4 relative flex justify-center items-start">
      <div className="h-full aspect-video bg-white rounded-md relative group">
        {children}
      </div>
    </div>
  )
}

function ContentContainer() {
  const { presentationStatus, isHost } = useContext(
    EventSessionContext
  ) as EventSessionContextType

  const { meeting } = useDyteMeeting()

  const activePlugin = meeting.plugins.active.toArray()?.[0]

  if (activePlugin) {
    return (
      <ContentWrapper>
        <DytePluginMain meeting={meeting} plugin={activePlugin} />
      </ContentWrapper>
    )
  }

  if (presentationStatus === PresentationStatuses.STOPPED) return null

  return (
    <ContentWrapper>
      <Slide />
      {isHost && <SlideViewControls />}
    </ContentWrapper>
  )
}

export default ContentContainer
