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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setJoinedParticipants(participants.peers as any)
      }
    }

    getParticipants()
  }, [meeting])

  if (joinedParticipants.length === 0) return null

  const participantFirstNames = joinedParticipants.map(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (p: any) => p.displayName.split(' ')[0]
  )

  if (joinedParticipants.length === 1) {
    return (
      <div className="pt-4">
        {participantFirstNames[0]} has already joined the meeting
      </div>
    )
  }

  if (joinedParticipants.length === 2) {
    return (
      <div className="pt-4">
        {participantFirstNames[0]} and {participantFirstNames[1]} have already
        joined the meeting
      </div>
    )
  }

  if (joinedParticipants.length === 3) {
    return (
      <div className="pt-4">
        {participantFirstNames[0]}, {participantFirstNames[1]} and{' '}
        {participantFirstNames[2]} have already joined the meeting
      </div>
    )
  }

  if (joinedParticipants.length === 4) {
    return (
      <div className="pt-4">
        {participantFirstNames[0]}, {participantFirstNames[1]},{' '}
        {participantFirstNames[2]} and one more have already joined the meeting
      </div>
    )
  }

  return (
    <div className="pt-4">
      {participantFirstNames[0]}, {participantFirstNames[1]},{' '}
      {participantFirstNames[2]} and {joinedParticipants.length - 3} others have
      already joined the meeting
    </div>
  )
}
