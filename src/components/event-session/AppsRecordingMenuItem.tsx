import { useState } from 'react'

import { useDyteMeeting } from '@dytesdk/react-web-core'
import { BsRecord2 } from 'react-icons/bs'
import { FaStopCircle } from 'react-icons/fa'

import { AppsDropdownMenuItem } from './AppsDropdownMenuItem'
import { ConfirmationModal } from '../common/ConfirmationModal'

import { useEventSession } from '@/contexts/EventSessionContext'
import { useRecording } from '@/hooks/useRecording'

export function AppsRecordingDropdownMenuItem() {
  const { isHost } = useEventSession()
  const { meeting } = useDyteMeeting()
  const { isRecording, startRecording } = useRecording()
  const [openRecordingConfirmationModal, setOpenRecordingConfirmationModal] =
    useState(false)

  const handleRecordingToggle = async () => {
    if (isRecording) {
      meeting.recording.stop()

      return
    }

    setOpenRecordingConfirmationModal(true)
  }

  const handleStartRecording = () => {
    startRecording()
    setOpenRecordingConfirmationModal(false)
  }

  if (!isHost) return null

  return (
    <>
      <AppsDropdownMenuItem
        icon={
          isRecording ? <FaStopCircle size={24} /> : <BsRecord2 size={24} />
        }
        title={isRecording ? 'Stop Recording' : 'Record Meeting'}
        description={
          isRecording
            ? 'Stop recording the meeting'
            : 'Start recording the meeting'
        }
        onClick={handleRecordingToggle}
      />
      <ConfirmationModal
        open={openRecordingConfirmationModal}
        confirmButtonLabel="Start Recording"
        title="Ready to Start Recording?"
        description="Once you hit start, we’ll begin recording everything in the session.
               Make sure everyone’s set before you begin!"
        onConfirm={handleStartRecording}
        onClose={() => setOpenRecordingConfirmationModal(false)}
      />
    </>
  )
}
