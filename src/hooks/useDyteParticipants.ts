/* eslint-disable @typescript-eslint/no-explicit-any */
import { useDyteSelector } from '@dytesdk/react-web-core'
import { DyteParticipant } from '@dytesdk/web-core'

import { useEventSession } from '@/contexts/EventSessionContext'

export function useDyteParticipants() {
  const { activeSession } = useEventSession()

  const handRaised = activeSession?.handsRaised || []
  const joinedParticipants = useDyteSelector((state) =>
    state.participants.joined
      .toArray()
      .filter((participant) => !participant.flags.hiddenParticipant)
  )

  const waitlistedParticipants = useDyteSelector((state) =>
    state.participants.waitlisted
      .toArray()
      .filter((participant) => !participant.flags.hiddenParticipant)
  )

  const activeParticipantsState = useDyteSelector((state) =>
    state.participants.active
      .toArray()
      .filter(
        (participant) =>
          !participant.isPinned && !participant.flags.hiddenParticipant
      )
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
    ...(!self.isPinned && !hideSelf ? [self] : []),
    ...activeParticipantsState,
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

  const handRaisedActiveParticipants = handRaised
    .map((id: string) =>
      sortedParticipants.find((participant) => participant.id === id)
    )
    .filter(Boolean)

  return {
    joinedParticipants: joinedParticipants || [],
    activeParticipants: activeParticipants || [],
    pinnedParticipants: pinnedParticipants || [],
    sortedParticipants: sortedParticipants || [],
    sortedParticipantsWithOutPinned: sortedParticipantsWithOutPinned || [],
    handRaisedActiveParticipants: handRaisedActiveParticipants || [],
    waitlistedParticipants: waitlistedParticipants || [],
  } as {
    activeParticipants: DyteParticipant[]
    pinnedParticipants: DyteParticipant[]
    sortedParticipants: DyteParticipant[]
    sortedParticipantsWithOutPinned: DyteParticipant[]
    handRaisedActiveParticipants: DyteParticipant[]
    joinedParticipants: DyteParticipant[]
    waitlistedParticipants: Omit<
      DyteParticipant,
      'audioTrack' | 'videoTrack' | 'screenShareTracks'
    >[]
  }
}
