import { useDyteSelector } from '@dytesdk/react-web-core'
import { BsRecord2 } from 'react-icons/bs'

import { Tooltip } from '../common/ShortuctTooltip'

export function MeetingRecordingIndicator() {
  const recordingState = useDyteSelector(
    (meet) => meet.recording.recordingState
  )
  const isRecording = recordingState === 'RECORDING'

  if (isRecording) {
    return (
      <Tooltip content="This session is being recorded">
        <div className="w-fit h-8 flex justify-center items-center gap-1 rounded-md px-2 py-0 -ml-4 bg-red-500 text-white text-sm">
          <BsRecord2 size={20} /> <span>Rec</span>
        </div>
      </Tooltip>
    )
  }

  return null
}
