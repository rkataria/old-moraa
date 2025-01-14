/* eslint-disable @typescript-eslint/no-explicit-any */

const startMeeting = async ({
  token,
  meetingId,
  eventId,
}: {
  token: string
  meetingId: string
  eventId: string
}) => {
  const { location } = window

  return fetch('https://api.dyte.io/v2/recordings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      meeting_id: meetingId,
      url: `${location.origin}/event-session/${eventId}/record`,
    }),
  })
}

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

const getRecordings = async ({
  token,
  dyteMeetingId,
  queryParams,
}: {
  token: string
  dyteMeetingId: string
  queryParams?: Record<string, any>
}) => {
  const queryString = new URLSearchParams({
    meeting_id: dyteMeetingId,
    ...queryParams,
  }).toString()

  const url = `https://api.dyte.io/v2/recordings?${queryString}`

  return fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
}

const getRecording = async ({
  token,
  recordingId,
}: {
  token: string
  recordingId: string
}) =>
  fetch(`https://api.dyte.io/v2/recordings/${recordingId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

const getTranscripts = async ({
  token,
  sessionId,
}: {
  token: string
  sessionId: string
}) =>
  fetch(`https://api.dyte.io/v2/sessions/${sessionId}/transcript`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

const getSummary = async ({
  token,
  sessionId,
}: {
  token: string
  sessionId: string
}) =>
  fetch(`https://api.dyte.io/v2/sessions/${sessionId}/summary`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

const generateSummary = async ({
  token,
  sessionId,
}: {
  token: string
  sessionId: string
}) =>
  fetch(`https://api.dyte.io/v2/sessions/${sessionId}/summary`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

export const DyteRecordingService = {
  startMeeting,
  stopMeeting,
  getRecordings,
  getRecording,
  getTranscripts,
  generateSummary,
  getSummary,
}
