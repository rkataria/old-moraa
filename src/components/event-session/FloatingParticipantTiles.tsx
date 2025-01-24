import { FloatingParticipantTile } from './FloatingParticipantTile'

import { useDyteParticipants } from '@/hooks/useDyteParticipants'

export function FloatingParticipantTiles() {
  const { sortedParticipants, handRaisedActiveParticipants } =
    useDyteParticipants()

  return (
    <div className="w-full z-10 flex flex-col gap-2">
      <div className="flex justify-center items-start flex-wrap gap-2">
        {sortedParticipants.slice(0, 4).map((participant) => (
          <FloatingParticipantTile
            key={participant.id}
            participant={participant}
            handRaised={
              !!handRaisedActiveParticipants.find(
                (p) => p.id === participant.id
              )
            }
            showOrder={handRaisedActiveParticipants.length > 1}
            handRaisedOrder={
              handRaisedActiveParticipants.findIndex(
                (p) => p.id === participant.id
              ) + 1
            }
          />
        ))}
      </div>
    </div>
  )
}
