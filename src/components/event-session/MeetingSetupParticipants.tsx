import { useEffect, useState } from 'react'

import { useDyteMeeting } from '@dytesdk/react-web-core'

export function MeetingSetupParticipants() {
  const { meeting } = useDyteMeeting()
  const [joinedParticipants, setJoinedParticipants] = useState([])

  useEffect(() => {
    const getParticipants = async () => {
      const participants =
        await meeting.participants.getParticipantsInMeetingPreJoin()

      if (participants?.peers) {
        setJoinedParticipants(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          participants.peers.filter((p) => !p.flags?.hiddenParticipant) as any
        )
      }
    }

    getParticipants()
  }, [meeting])

  if (joinedParticipants.length === 0) {
    return (
      <ParticipantsContainer>
        Nobody has joined the meeting yet
      </ParticipantsContainer>
    )
  }

  const participantFirstNames = joinedParticipants.map(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (p: any) => p.displayName.split(' ')[0]
  )

  if (joinedParticipants.length === 1) {
    return (
      <ParticipantsContainer>
        {participantFirstNames[0]} has already joined the meeting
      </ParticipantsContainer>
    )
  }

  if (joinedParticipants.length === 2) {
    return (
      <ParticipantsContainer>
        {participantFirstNames[0]} and {participantFirstNames[1]} have already
        joined the meeting
      </ParticipantsContainer>
    )
  }

  if (joinedParticipants.length === 3) {
    return (
      <ParticipantsContainer>
        {participantFirstNames[0]}, {participantFirstNames[1]} and{' '}
        {participantFirstNames[2]} have already joined the meeting
      </ParticipantsContainer>
    )
  }

  if (joinedParticipants.length === 4) {
    return (
      <ParticipantsContainer>
        {participantFirstNames[0]}, {participantFirstNames[1]},{' '}
        {participantFirstNames[2]} and one more have already joined the meeting
      </ParticipantsContainer>
    )
  }

  return (
    <ParticipantsContainer>
      {participantFirstNames[0]}, {participantFirstNames[1]},{' '}
      {participantFirstNames[2]} and {joinedParticipants.length - 3} others have
      already joined the meeting
    </ParticipantsContainer>
  )
}

function ParticipantsContainer({ children }: { children: React.ReactNode }) {
  return <div className="pt-4 text-gray-100 font-light">{children}</div>
}
