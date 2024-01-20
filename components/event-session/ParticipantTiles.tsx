import EventSessionContext from "@/contexts/EventSessionContext"
import {
  EventSessionContextType,
  PresentationStatuses,
} from "@/types/event-session.type"
import {
  DyteAudioVisualizer,
  DyteNameTag,
  DyteParticipantTile,
  DyteSpotlightGrid,
} from "@dytesdk/react-ui-kit"
import { useDyteMeeting } from "@dytesdk/react-web-core"
import React, { useContext } from "react"

function ParticipantTiles() {
  const { meeting } = useDyteMeeting()
  const { presentationStatus } = useContext(
    EventSessionContext
  ) as EventSessionContextType

  if (presentationStatus === PresentationStatuses.STOPPED) {
    return (
      <div className="flex-auto flex justify-center items-center bg-gray-900">
        <DyteSpotlightGrid
          meeting={meeting}
          layout="row"
          participants={[meeting.self]}
          pinnedParticipants={[meeting.self]}
          style={{ height: "80%", width: "100%" }}
        />
      </div>
    )
  }

  return (
    <div className="h-36 bg-gray-700 overflow-hidden overflow-x-auto flex justify-start items-center gap-[0.125rem] p-[0.125rem] flex-nowrap scrollbar-transparent scrollbar-thumb-transparent scrollbar-track-transparent scrollbar-track-rounded-full">
      <DyteParticipantTile
        meeting={meeting}
        participant={meeting.self}
        nameTagPosition="bottom-center"
        variant="gradient"
        className="h-[140px] w-64 rounded-none aspect-video flex-none border-2 border-green-500 sticky left-0 z-[1]"
      >
        <DyteNameTag meeting={meeting} participant={meeting.self}>
          <DyteAudioVisualizer slot="start" participant={meeting.self} />
        </DyteNameTag>
      </DyteParticipantTile>
      {meeting.participants.active.toArray().map((participant) => (
        <DyteParticipantTile
          meeting={meeting}
          participant={participant}
          nameTagPosition="bottom-center"
          variant="gradient"
          className="h-[140px] w-64 rounded-none aspect-video flex-none"
        >
          <DyteNameTag meeting={meeting} participant={participant}>
            <DyteAudioVisualizer slot="start" />
          </DyteNameTag>
        </DyteParticipantTile>
      ))}
    </div>
  )
}

export default ParticipantTiles
