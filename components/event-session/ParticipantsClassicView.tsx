import { DyteParticipant, DyteSelf } from '@dytesdk/web-core'

import { ParticipantsGridView } from './ParticipantsGridView'

const GRID_SIZE = 16

export function ParticipantsClassicView({
  participants,
}: {
  participants: (DyteParticipant | Readonly<DyteSelf>)[]
}) {
  const firstPageParticipants = participants.slice(0, GRID_SIZE)

  return (
    <ParticipantsGridView
      gridSize={GRID_SIZE}
      gridStyles={{
        'grid-cols-2': firstPageParticipants.length <= 1,
        'grid-cols-4':
          firstPageParticipants.length > 1 && firstPageParticipants.length <= 4,
        'grid-cols-6':
          firstPageParticipants.length > 4 && firstPageParticipants.length <= 9,
        'grid-cols-8':
          firstPageParticipants.length > 9 &&
          firstPageParticipants.length <= 16,
        'grid-rows-4': participants.length > 16, // 4x4 grid
      }}
      participants={participants}
    />
  )
}
