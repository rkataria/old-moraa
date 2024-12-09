import { DyteParticipant, DyteSelf } from '@dytesdk/web-core'

import { ParticipantsGrid } from '../common/ParticipantsGrid/ParticipantsGrid'

export function ParticipantsGalleryView({
  participants,
}: {
  participants: (DyteParticipant | Readonly<DyteSelf>)[]
}) {
  return <ParticipantsGrid participants={participants} />
}
