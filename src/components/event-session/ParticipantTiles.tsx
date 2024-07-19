import { useDyteMeeting, useDyteSelector } from '@dytesdk/react-web-core'

import { ParticipantsClassicView } from './ParticipantsClassicView'
import { ParticipantsGalleryView } from './ParticipantsGalleryView'
import { ParticipantsSpotlightView } from './ParticipantsSpotlightView'

export function ParticipantTiles({
  spotlightMode,
  // panelSize,
}: {
  spotlightMode: boolean
  // panelSize: number
}) {
  const { meeting } = useDyteMeeting()
  // const { activeSession } = useContext(
  //   EventSessionContext
  // ) as EventSessionContextType
  const activeParticipants = useDyteSelector((m) =>
    m.participants.active.toArray()
  )
  const selfParticipant = useDyteSelector((m) => m.self)
  // const pinnedParticipants = useDyteSelector((m) =>
  //   m.participants.pinned.toArray()
  // )
  const pinnedParticipants = meeting.participants.pinned.toArray()

  if (spotlightMode) {
    if (pinnedParticipants.length > 0) {
      const activeParticipantsWithoutPinned = activeParticipants.filter(
        (p) => !pinnedParticipants.includes(p)
      )
      const isSelfPinned = pinnedParticipants.find(
        (p) => p.id === selfParticipant.id
      )

      const unpinnedParticipants = activeParticipantsWithoutPinned

      if (isSelfPinned) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        unpinnedParticipants.push(selfParticipant as any)
      }

      return (
        <ParticipantsSpotlightView
          key={activeParticipants.length}
          spotlightParticipants={pinnedParticipants}
          participants={[...unpinnedParticipants]}
        />
      )
    }

    return (
      <ParticipantsClassicView
        key={activeParticipants.length}
        participants={[...activeParticipants, selfParticipant]}
      />
    )
  }

  return (
    <ParticipantsGalleryView
      key={activeParticipants.length}
      participants={[...activeParticipants, selfParticipant]}
    />
  )
}
