import { useDyteSelector } from '@dytesdk/react-web-core'

export function BreakoutRoomsDebug() {
  const dyteMeetingSelector = useDyteSelector((m) => m)
  const connectedMeetings = useDyteSelector((m) => m.connectedMeetings.meetings)

  // const { meetings } = dyteMeetingSelector.connectedMeetings

  console.log(
    'BreakoutRoomsDebug: meeting.connectedMeetings.meetings',
    connectedMeetings
  )
  console.log(
    'BreakoutRoomsDebug: dyteMeetingSelector.self',
    dyteMeetingSelector?.self
  )
  console.log(
    'BreakoutRoomsDebug: dyteMeetingSelector.self',
    dyteMeetingSelector?.participants.joined.toArray()
  )

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex flex-row gap-2">
        <span>Meeting Id:</span>
        <pre>{dyteMeetingSelector?.meta.meetingId}</pre>
      </div>
      <div className="flex flex-row gap-2">
        <span>Meeting join status:</span>
        <pre>{JSON.stringify(dyteMeetingSelector?.self.roomJoined)}</pre>
      </div>
      <div>
        <span>Participants:</span>
        <pre>
          {JSON.stringify(
            dyteMeetingSelector?.participants.joined
              .toArray()
              .map(({ customParticipantId, userId, id, name }) => ({
                customParticipantId,
                userId,
                id,
                name,
              })),
            null,
            2
          )}
        </pre>
      </div>
      {/* <div className="flex flex-row gap-2">
        <span>Meeting Self:</span>
        <pre>{JSON.stringify(dyteMeetingSelector?.self, null, 2)}</pre>
      </div> */}
      <div className="flex flex-row gap-2">
        <span>Meeting Meta:</span>
        <pre>{JSON.stringify(dyteMeetingSelector?.meta, null, 2)}</pre>
      </div>
      <div className="flex flex-row gap-2">
        <span>Connected Meetings: </span>
        <pre>{JSON.stringify(connectedMeetings, null, 2)}</pre>
      </div>
    </div>
  )
}
