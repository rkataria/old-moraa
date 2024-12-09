import { DyteParticipant, DyteSelf } from '@dytesdk/web-core'

import { ParticipantsGrid } from '../common/ParticipantsGrid/ParticipantsGrid'

// const GRID_SIZE = 16

export function ParticipantsClassicView({
  participants,
}: {
  participants: (DyteParticipant | Readonly<DyteSelf>)[]
}) {
  return <ParticipantsGrid participants={participants} />
}
