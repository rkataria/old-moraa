import { useDyteMeeting, useDyteSelector } from '@dytesdk/react-web-core'
import { IoMdRadioButtonOn } from 'react-icons/io'

import { ControlButton } from '../common/ControlButton'

import { useFlags } from '@/flags/client'
import { cn } from '@/utils/utils'

export function MeetingRecordingButton() {
  const { meeting } = useDyteMeeting()
  const { flags } = useFlags()
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

  if (flags?.show_recording_button) {
    return null
  }

  return (
    <ControlButton
      buttonProps={{
        isIconOnly: true,
        size: 'sm',
        radius: 'md',
        variant: 'flat',
        className: cn(
          'transition-all duration-300 bg-[#F3F4F6] text-[#444444]',
          {
            'bg-red-500 text-white': isRecording,
          }
        ),
      }}
      tooltipProps={{
        content: isRecording ? 'Stop Recording' : 'Start Recording',
      }}
      onClick={onRecordingToggle}>
      <IoMdRadioButtonOn size={20} />
    </ControlButton>
  )
}
