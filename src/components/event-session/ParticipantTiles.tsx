import { ParticipantsClassicView } from './ParticipantsClassicView'
import { ParticipantsGalleryView } from './ParticipantsGalleryView'
import { ParticipantsSpotlightView } from './ParticipantsSpotlightView'

import { useDyteParticipants } from '@/hooks/useDyteParticipants'

export function ParticipantTiles({
  spotlightMode,
  // panelSize,
}: {
  spotlightMode: boolean
  // panelSize: number
}) {
  const {
    pinnedParticipants,
    activeParticipants,
    sortedParticipantsWithOutPinned,
    sortedParticipants,
  } = useDyteParticipants()

  if (spotlightMode) {
    if (pinnedParticipants.length > 0) {
      return (
        <ParticipantsSpotlightView
          key={activeParticipants.length}
          spotlightParticipants={pinnedParticipants}
          participants={[...sortedParticipantsWithOutPinned]}
        />
      )
    }

    return (
      <ParticipantsClassicView
        key={activeParticipants.length}
        participants={[...sortedParticipants]}
      />
    )
  }

  return (
    <ParticipantsGalleryView
      key={activeParticipants.length}
      participants={[...sortedParticipants]}
    />
  )
}
