import { useDyteMeeting, useDyteSelector } from '@dytesdk/react-web-core'

import { ControlButton } from '../common/ControlButton'

import { useEventSession } from '@/contexts/EventSessionContext'
import { useFlags } from '@/flags/client'
import { cn } from '@/utils/utils'

export function MeetingRecordingButton() {
  const { meeting } = useDyteMeeting()
  const { flags } = useFlags()
  const { isHost } = useEventSession()
  const recordingState = useDyteSelector(
    (meet) => meet.recording.recordingState
  )
  const isRecording = recordingState === 'RECORDING'

  const onRecordingToggle = () => {
    if (isRecording) {
      meeting.recording.stop()
    } else {
      meeting.recording.start()
    }
  }

  if (flags?.show_recording_button || !isHost) {
    return null
  }

  return (
    <ControlButton
      tooltipProps={{
        content: isRecording ? 'Stop Recording' : 'Start Recording',
        actionKey: 'R',
      }}
      buttonProps={{
        size: 'sm',
        radius: 'md',
        variant: 'flat',
        // isIconOnly: true,
        className: cn('live-button', {
          active: isRecording,
        }),
      }}
      onClick={onRecordingToggle}>
      {/* <IoMdRadioButtonOn size={18} /> */}
      {isRecording ? 'Recording' : 'Record'}
    </ControlButton>
  )
}
