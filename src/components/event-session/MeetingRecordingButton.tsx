import { useDyteMeeting, useDyteSelector } from '@dytesdk/react-web-core'
import { IoMdRadioButtonOn } from 'react-icons/io'

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
      hideTooltip
      buttonProps={{
        size: 'sm',
        radius: 'md',
        variant: 'light',

        className: cn(
          'w-full gap-4 justify-between transition-all duration-300',
          {
            'bg-red-500 text-white': isRecording,
          }
        ),
      }}
      onClick={onRecordingToggle}>
      <span className="flex items-center gap-4">
        <IoMdRadioButtonOn size={24} />
        {isRecording ? 'Stop' : 'Start'} Recording
      </span>
    </ControlButton>
  )
}
