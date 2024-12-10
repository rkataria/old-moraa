const startMeeting = async ({
  token,
  meetingId,
  url,
}: {
  token: string
  meetingId: string
  url: string
}) =>
  fetch('https://api.dyte.io/v2/recordings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ meeting_id: meetingId, url }),
  })

const stopMeeting = async ({
  recordingId,
  token,
}: {
  recordingId: string
  token: string
}) =>
  fetch(`https://api.dyte.io/v2/recordings/${recordingId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ action: 'stop' }),
  })

export const DyteRecordingService = {
  startMeeting,
  stopMeeting,
}
