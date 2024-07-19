import { type DyteParticipant } from '@dytesdk/web-core'

import type DyteClient from '@dytesdk/web-core'

export const participantIdentifier = (
  participant: DyteParticipant | DyteClient['self']
) => participant.customParticipantId ?? participant.clientSpecificId

// NOTE: Keeping this code for reference
// export const getAllConnectedParticipants = (meeting: DyteClient) => {
//   const map = new Map<string, string>()

//   const participants = [meeting.self, ...meeting.participants.joined.toArray()]

//   participants.forEach((p) => map.set(participantIdentifier(p), p.picture))

//   return [
//     meeting.connectedMeetings.parentMeeting,
//     ...meeting.connectedMeetings.meetings,
//   ]
//     .flatMap((m) => m.participants)
//     .map((connectedPeer) => ({
//       id: connectedPeer.id,
//       customParticipantId: participantIdentifier(
//         connectedPeer as DyteParticipant
//       ),
//       displayName: connectedPeer.displayName,
//       displayPictureUrl:
//         connectedPeer.displayPictureUrl !== ''
//           ? connectedPeer.displayPictureUrl
//           : map.get(participantIdentifier(connectedPeer as DyteParticipant)),
//     }))
// }
