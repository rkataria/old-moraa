import { useDyteSelector } from '@dytesdk/react-web-core'

import { FloatingParticipantTile } from './FloatingParticipantTile'

import { useEventSession } from '@/contexts/EventSessionContext'

export function FloatingParticipantTiles() {
  const { activeSession } = useEventSession()

  const handRaised = activeSession?.handsRaised || []
  const activeParticipantsState = useDyteSelector((state) =>
    state.participants.active
      .toArray()
      .filter((participant) => !participant.isPinned)
  )
  const pinnedParticipantsState = useDyteSelector((state) =>
    state.participants.pinned.toArray()
  )
  const { self, stage } = useDyteSelector((state) => state)

  const { permissions } = self
  const { isRecorder } = permissions
  const isOffStage = stage.status !== 'ON_STAGE'

  const hideSelf = isOffStage || isRecorder || permissions.hiddenParticipant

  const activeParticipants = [
    ...activeParticipantsState,
    ...(!self.isPinned && !hideSelf ? [self] : []),
  ]
  const pinnedParticipants = [
    ...pinnedParticipantsState,
    ...(self.isPinned && !hideSelf ? [self] : []),
  ]

  const handRaisedParticipants = activeParticipants.filter((participant) =>
    handRaised.includes(participant.id)
  )
  const otherParticipants = activeParticipants.filter(
    (participant) => !handRaised.includes(participant.id)
  )

  const sortedParticipants = [
    ...pinnedParticipants,
    ...handRaisedParticipants,
    ...otherParticipants,
  ]

  const handRaisedActiveParticipants = sortedParticipants.filter(
    (participant) => handRaised.includes(participant.id)
  )

  return (
    <div className="w-full z-10 flex flex-col gap-2">
      <div className="flex justify-center items-start flex-wrap gap-2">
        {sortedParticipants.slice(0, 4).map((participant) => (
          <FloatingParticipantTile
            key={participant.id}
            participant={participant}
            handRaised={handRaised.includes(participant.id)}
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
