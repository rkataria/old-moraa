import React, { useContext } from 'react'

import {
  DyteAudioVisualizer,
  DyteNameTag,
  DyteParticipantTile,
  DyteSpotlightGrid,
} from '@dytesdk/react-ui-kit'
import { useDyteMeeting, useDyteSelector } from '@dytesdk/react-web-core'
import { HiMiniHandRaised } from 'react-icons/hi2'

import { EventSessionContext } from '@/contexts/EventSessionContext'
import {
  EventSessionContextType,
  PresentationStatuses,
} from '@/types/event-session.type'

export function ParticipantTiles() {
  const { meeting } = useDyteMeeting()
  const { presentationStatus, activeStateSession } = useContext(
    EventSessionContext
  ) as EventSessionContextType
  const activePlugin = meeting.plugins.active.toArray()?.[0]
  const selfScreenShared = useDyteSelector((m) => m.self.screenShareEnabled)
  const screensharingParticipant = useDyteSelector((m) =>
    m.participants.joined.toArray().find((p) => p.screenShareEnabled)
  )

  const isScreensharing = !!screensharingParticipant || selfScreenShared

  if (
    !isScreensharing &&
    !activePlugin &&
    presentationStatus === PresentationStatuses.STOPPED
  ) {
    return (
      <div className="flex-auto flex justify-center items-center bg-gray-900">
        <DyteSpotlightGrid
          meeting={meeting}
          layout="row"
          participants={meeting.participants.active.toArray()}
          pinnedParticipants={[meeting.self]}
          style={{ height: '80%', width: '100%' }}
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
        className="relative h-[140px] w-64 rounded-none aspect-video flex-none border-2 border-green-500 left-0 z-[1]">
        <DyteNameTag meeting={meeting} participant={meeting.self}>
          <DyteAudioVisualizer slot="start" participant={meeting.self} />
        </DyteNameTag>
        {activeStateSession?.data?.handsRaised?.includes(meeting.self.id) && (
          <HiMiniHandRaised className="absolute right-2 top-2 text-xl animate-pulse flex justify-center items-center text-[#FAC036]" />
        )}
      </DyteParticipantTile>
      {meeting.participants.active.toArray().map((participant) => (
        <DyteParticipantTile
          meeting={meeting}
          participant={participant}
          nameTagPosition="bottom-center"
          variant="gradient"
          className="h-[140px] w-64 rounded-none aspect-video flex-none">
          <DyteNameTag meeting={meeting} participant={participant}>
            <DyteAudioVisualizer slot="start" participant={participant} />
          </DyteNameTag>
          {activeStateSession?.data?.handsRaised?.includes(participant.id) && (
            <HiMiniHandRaised className="absolute right-2 top-2 text-xl animate-pulse flex justify-center items-center text-[#FAC036]" />
          )}
        </DyteParticipantTile>
      ))}
    </div>
  )
}
