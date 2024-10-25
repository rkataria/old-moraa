import { DyteParticipant, DyteSelf } from '@dytesdk/web-core'

import { ParticipantsGridView } from './ParticipantsGridView'

const GRID_SIZE = 8

export function ParticipantsGalleryView({
  participants,
}: {
  participants: (DyteParticipant | Readonly<DyteSelf>)[]
}) {
  const firstPageParticipants = participants.slice(0, GRID_SIZE)

  return (
    <ParticipantsGridView
      gridSize={GRID_SIZE}
      gridStyles={{
        'grid-cols-2 grid-rows-auto justify-center content-center':
          firstPageParticipants.length <= 4,
        'grid-cols-4 grid-rows-4': firstPageParticipants.length > 4,
      }}
      participants={participants}
    />
  )
}
