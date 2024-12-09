import { useDyteSelector } from '@dytesdk/react-web-core'

import { ParticipantsClassicView } from './ParticipantsClassicView'
import { ParticipantsGalleryView } from './ParticipantsGalleryView'
import { ParticipantsSpotlightView } from './ParticipantsSpotlightView'

import { useEventSession } from '@/contexts/EventSessionContext'

export function ParticipantTiles({
  spotlightMode,
  // panelSize,
}: {
  spotlightMode: boolean
  // panelSize: number
}) {
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

  const sortedParticipantsWithOutPinned = [
    ...handRaisedParticipants,
    ...otherParticipants,
  ]

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
