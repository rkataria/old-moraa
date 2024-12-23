/* eslint-disable @typescript-eslint/no-explicit-any */
import { useDyteSelector } from '@dytesdk/react-web-core'

import { useEventSession } from '@/contexts/EventSessionContext'

export function useParticipantTiles() {
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

  return {
    activeParticipants: activeParticipants || [],
    pinnedParticipants: pinnedParticipants || [],
    sortedParticipants: sortedParticipants || [],
    sortedParticipantsWithOutPinned: sortedParticipantsWithOutPinned || [],
  } as any
}
