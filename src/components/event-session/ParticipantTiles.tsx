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
  const activeParticipants = useDyteSelector((m) =>
    m.participants.active.toArray()
  )
  const selfParticipant = useDyteSelector((m) => m.self)
  const pinnedParticipants = meeting.participants.pinned.toArray()
  const isSelfPinned = selfParticipant.isPinned

  if (spotlightMode) {
    if (pinnedParticipants.length > 0 || isSelfPinned) {
      const activeParticipantsWithoutPinned = activeParticipants.filter(
        (p) => !p.isPinned
      )

      if (isSelfPinned) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        pinnedParticipants.push(selfParticipant as any)
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        activeParticipantsWithoutPinned.push(selfParticipant as any)
      }

      return (
        <ParticipantsSpotlightView
          key={activeParticipants.length}
          spotlightParticipants={pinnedParticipants}
          participants={[...activeParticipantsWithoutPinned]}
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
