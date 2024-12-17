import { useEffect } from 'react'

import { useDyteSelector } from '@dytesdk/react-web-core'
import { useParams } from '@tanstack/react-router'

import { useEventPermissions } from './useEventPermissions'
import { useStoreSelector } from './useRedux'

import { useFlags } from '@/flags/client'
import { DyteRecordingService } from '@/services/dyte-recording.service'

export function useRecording() {
  const { eventId } = useParams({
    strict: false,
  })
  const { flags } = useFlags()
  const { permissions } = useEventPermissions()
  const enrollment = useStoreSelector(
    (state) => state.event.currentEvent.liveSessionState.enrollment.data
  )
  const mainMeetingId = useDyteSelector(
    (m) => m.connectedMeetings.currentMeetingId
  )
  const connectedMeetings = useDyteSelector((m) => m.connectedMeetings.meetings)
  const recordings = useDyteSelector((m) => m.recording.recordings)

  const isRecording = recordings.some((r) =>
    ['IDLE', 'STARTING', 'RECORDING'].includes(r.state)
  )

  const isHost = permissions.canAcessAllSessionControls()

  useEffect(() => {
    if (!isRecording) return
    if (!isHost) return
    if (!flags?.record_breakout_meeting) return

    connectedMeetings.forEach((meeting) => {
      startRecordingForMeeting(meeting.id!)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHost, isRecording, connectedMeetings, flags?.record_breakout_meeting])

  const startRecording = () => {
    startRecordingForMeeting(mainMeetingId)
  }

  const startRecordingForMeeting = async (meetingId: string) => {
    if (!enrollment?.meeting_token) return

    await DyteRecordingService.startMeeting({
      token: enrollment.meeting_token,
      meetingId,
      eventId: eventId!,
    })
  }

  return {
    recordings,
    isRecording,
    startRecording,
  }
}
